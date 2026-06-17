# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY HelpDesk.Api/HelpDesk.Api.csproj HelpDesk.Api/
RUN dotnet restore HelpDesk.Api/HelpDesk.Api.csproj

COPY HelpDesk.Api/ HelpDesk.Api/
RUN dotnet publish HelpDesk.Api/HelpDesk.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# curl is used by the docker-compose healthcheck.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Honour the PORT env var (Render/Fly/Heroku) and default to 8080 otherwise.
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "HelpDesk.Api.dll"]
