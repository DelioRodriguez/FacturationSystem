using Facturacion.API.Data.Context;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5013); // Configura el puerto aquí
});
// Add services to the container.
builder.Services.AddDbContext<FacturacionContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("To-do")));

builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add Authentication services
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/auth/login";  // Ruta para iniciar sesión
        options.AccessDeniedPath = "/api/auth/accessdenied";  // Ruta en caso de acceso denegado
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy
app.UseCors("AllowAll");

// Enable authentication
app.UseAuthentication();  // Asegúrate de que esto esté antes de app.UseAuthorization()

// Enable authorization
app.UseAuthorization();

app.MapControllers();

app.Run();
