using System.Text;
using System.Text.Json.Serialization;
using HelpDesk.Api.Auth;
using HelpDesk.Api.Background;
using HelpDesk.Api.Data;
using HelpDesk.Api.Models;
using HelpDesk.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Honour the PORT env var that PaaS hosts (Render/Fly/Heroku) inject.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ---- Database (PostgreSQL) ----
// Prefer an explicit connection string; otherwise accept a DATABASE_URL (the form
// Render/Heroku/Fly inject) and translate it to an Npgsql connection string.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? DatabaseUrl.ToNpgsql(Environment.GetEnvironmentVariable("DATABASE_URL"))
    ?? "Host=localhost;Port=5432;Database=helpdesk;Username=postgres;Password=postgres";
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// ---- Options ----
var slaOptions = builder.Configuration.GetSection("Sla").Get<SlaOptions>() ?? new SlaOptions();
builder.Services.AddSingleton(slaOptions);

// ---- Application services ----
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<SlaEscalationRunner>();
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddHostedService<SlaEscalationService>();

// ---- AuthN / AuthZ (JWT bearer with roles) ----
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey) || Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key is missing or shorter than 32 bytes. Provide a strong key via the " +
        "Jwt__Key environment variable, user-secrets, or appsettings.Development.json.");
}
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });
builder.Services.AddAuthorization();

// ---- MVC + consistent JSON / errors ----
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HelpDesk API",
        Version = "v1",
        Description = "A helpdesk / ticketing REST API: tickets, comments, JWT roles (agent vs. customer), and an SLA-escalation background job."
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Paste your JWT here as: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Apply migrations and seed a default agent so the API is usable on first run.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await SeedData.EnsureSeededAsync(db);
}

app.UseExceptionHandler(); // ProblemDetails for unhandled exceptions

// Serve the web agent console from wwwroot. The console's screens are .jsx files
// compiled in-browser by Babel; the static-file middleware only serves known
// extensions, so register .jsx as a text type or those requests would 404.
var staticTypes = new FileExtensionContentTypeProvider();
staticTypes.Mappings[".jsx"] = "text/jsx";
app.UseDefaultFiles();                        // "/" -> /index.html
app.UseStaticFiles(new StaticFileOptions { ContentTypeProvider = staticTypes });

app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy" })).AllowAnonymous();
app.MapFallbackToFile("index.html");          // serve the console for non-API routes

app.Run();

// Exposed so the integration test project (WebApplicationFactory) can reference the entry point.
public partial class Program { }
