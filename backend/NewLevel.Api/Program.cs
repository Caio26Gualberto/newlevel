using Microsoft.OpenApi.Models;
using NewLevel.Api.Middleware;
using NewLevel.Application.Services.SignalR;
using NewLevel.Domain.Interfaces.Seeding;
using NewLevel.Infra.IoC;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//Testando Pipe
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddInfraIoC(builder.Configuration);
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "NewLevel", Version = "v1" });

    // Definir o baseUrl na especificação OpenAPI
    options.SwaggerGeneratorOptions.Servers = new List<OpenApiServer>
    {
        new OpenApiServer { Url = "https://localhost:7096" } // Defina o baseUrl aqui
    };
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<ISeedService>();
    await seeder.SeedRolesAndAdminAsync();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "NewLevel v1");
        options.RoutePrefix = string.Empty;
    });

    app.MapGet("/openapi.json", async context =>
    {
        context.Response.ContentType = "application/json";
        var provider = app.Services.GetRequiredService<Swashbuckle.AspNetCore.Swagger.ISwaggerProvider>();
        var swagger = provider.GetSwagger("v1");
        var json = System.Text.Json.JsonSerializer.Serialize(swagger, new System.Text.Json.JsonSerializerOptions
        {
            WriteIndented = true
        });
        await context.Response.WriteAsync(json);
    });
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseMiddleware<JWTMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<PostsHub>("/hubs/posts");

app.MapControllers();

app.Run();
