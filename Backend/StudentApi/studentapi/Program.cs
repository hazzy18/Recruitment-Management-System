
// using Microsoft.EntityFrameworkCore;
// using studentapi.Data;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using System.Text.Json.Serialization;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;



// var builder = WebApplication.CreateBuilder(args);




// // Add CORS policy
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowReactApp",
//         policy =>
//         {
//             policy.WithOrigins("http://localhost:5173") // Allow only your React app
//                   .AllowAnyHeader()
//                   .AllowAnyMethod();
//         });
// });



// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true, // Validate the token issuer
//             ValidateAudience = true, // Validate the token audience
//             ValidateLifetime = true, // Check if the token is expired
//             ValidateIssuerSigningKey = true, // Validate the token's signature
//  ValidIssuer = "your-app",  // Must match the token Issuer
//             ValidAudience = "your-client", // Must match the token Audience

//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("your-super-secure-secret-key-123456!")), // Secret key for signing
//                         ClockSkew = TimeSpan.Zero

//         };
//     });


// // Add services to the container.
// builder.Services.AddControllers()
//     .AddJsonOptions(options =>
//     {
//         options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // Fix: No $id, $values
//     });

// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));





// var app = builder.Build();

// // Enable CORS before routing
// app.UseCors("AllowReactApp");


// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI(options =>
//     {
//         options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
//         options.RoutePrefix = string.Empty;
//     });
// }

// app.UseHttpsRedirection();
// app.UseAuthorization();
// app.MapControllers();
// app.Run();


//------------------------------------------------------------------------------------


using Microsoft.EntityFrameworkCore;
using studentapi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;



var builder = WebApplication.CreateBuilder(args);





// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Allow only your React app
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Validate the token issuer
            ValidateAudience = true, // Validate the token audience
            ValidateLifetime = true, // Check if the token is expired
            ValidateIssuerSigningKey = true, // Validate the token's signature
 ValidIssuer = "your-app",  // Must match the token Issuer
            ValidAudience = "your-client", // Must match the token Audience

            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("your-super-secure-secret-key-123456!")), // Secret key for signing
                        ClockSkew = TimeSpan.Zero

        };
    });


// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles; // Fix: No $id, $values
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));





var app = builder.Build();

// Enable CORS before routing
app.UseCors("AllowReactApp");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
