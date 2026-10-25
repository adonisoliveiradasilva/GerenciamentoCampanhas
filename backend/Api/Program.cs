using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

Env.TraversePath().Load();

var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");

var connectionString = $"Host=localhost;Port=5433;Database={dbName};Username={dbUser};Password={dbPassword}";

// Teste rápido para ver se leu corretamente (pode apagar depois)
Console.WriteLine($"Conectando no banco: {dbName} com usuário {dbUser}");

builder.Services.AddControllers();
// injeção do banco de dados aqui usando a connectionString

var app = builder.Build();

app.UseAuthorization();
app.MapControllers();

app.Run();