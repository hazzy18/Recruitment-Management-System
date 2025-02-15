using studentapi.Models;
using studentapi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

[ApiController]
[Route("api")]
public class LoginController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LoginController(ApplicationDbContext context)
    {
        _context = context;
    }

[HttpPost("login")]
public IActionResult Login([FromBody] UserDvo login)
{
    // Search for the user in Employee table
    var employee = _context.Employees
        .FirstOrDefault(e => e.Email == login.Email && e.Password == login.Password);

    // Search for the user in Candidate table
    var candidate = _context.Candidates
        .FirstOrDefault(c => c.Email == login.Email && c.Password == login.Password);

    // If user is not found in both tables, return Unauthorized
    if (employee == null && candidate == null)
        return Unauthorized();

    // Determine user role based on where the user is found
    string role = employee != null ? employee.Role : "Candidate";
    string email = employee != null ? employee.Email : candidate!.Email;

    // Generate JWT Token
    var token = GenerateJwtToken(email, role);

    return Ok(new { Token = token, Email = email, Role = role });
}

    private string GenerateJwtToken(string username, string role)//2 inputs 
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        // var key = Encoding.ASCII.GetBytes("your-secret-key-1234");
        var key = Encoding.ASCII.GetBytes("your-super-secure-secret-key-123456!");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
                //i can add name also 
            }),
            Expires = DateTime.UtcNow.AddHours(4),
            Issuer = "your-app",  // Add Issuer
        Audience = "your-client", // Add Audience
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

public class UserDvo{
 public string Email { get; set; }
    public string Password { get; set; } 
}