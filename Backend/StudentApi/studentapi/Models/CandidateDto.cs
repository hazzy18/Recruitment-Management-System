namespace studentapi.Models
{
    public class CandidateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public int Experience { get; set; }
    public List<int> SkillIds { get; set; } = new List<int>(); // List of skill IDs
}

}


