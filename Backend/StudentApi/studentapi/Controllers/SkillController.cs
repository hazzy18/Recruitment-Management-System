using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentapi.Data;
using studentapi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace studentapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SkillController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SkillDto>>> GetSkills()
        {
            var skills = await _context.Skills
                .AsNoTracking()
                .Select(s => new SkillDto
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();

            return Ok(skills);
        }
    }
}
