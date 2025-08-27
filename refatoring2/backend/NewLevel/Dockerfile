# Stage for VS debugging on Docker
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
ENV ASPNETCORE_URLS="http://+:5004;"
ENV ASPNETCORE_HTTP_PORT=https//+:7004
WORKDIR /app
EXPOSE 5004


# Get base SDK Image from MS
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy projects and restore it's dependencies
COPY ["NewLevel.csproj", "src/NewLevel/"]
RUN dotnet restore "./src/NewLevel/NewLevel.csproj"

# Copy project files and build it's release
WORKDIR "/src/NewLevel"
COPY . .
RUN dotnet build "NewLevel.csproj" -c Release -o /app/build

# Publish released build
FROM build AS publish
RUN dotnet publish "NewLevel.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NewLevel.dll"]