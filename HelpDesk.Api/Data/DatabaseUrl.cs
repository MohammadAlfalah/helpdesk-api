using System.Text;

namespace HelpDesk.Api.Data;

/// <summary>
/// Translates a <c>postgres://user:pass@host:port/db</c> URL (the form Render,
/// Heroku and Fly inject as DATABASE_URL) into an Npgsql key/value connection string.
/// </summary>
public static class DatabaseUrl
{
    public static string? ToNpgsql(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;

        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':', 2);
        var database = uri.AbsolutePath.TrimStart('/');

        var sb = new StringBuilder();
        sb.Append($"Host={uri.Host};");
        sb.Append($"Port={(uri.Port > 0 ? uri.Port : 5432)};");
        sb.Append($"Database={database};");
        sb.Append($"Username={Uri.UnescapeDataString(userInfo[0])};");
        if (userInfo.Length > 1)
            sb.Append($"Password={Uri.UnescapeDataString(userInfo[1])};");

        // "Prefer" uses SSL when the server offers it (managed hosts like Render)
        // and falls back to plaintext for internal/local connections that don't.
        sb.Append("SSL Mode=Prefer;Trust Server Certificate=true;");
        return sb.ToString();
    }
}
