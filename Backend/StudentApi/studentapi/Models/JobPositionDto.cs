namespace studentapi.Models
{
    public class JobPositionDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int MinExperience { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ClosureReason { get; set; }
        public List<JobSkillDto> JobSkills { get; set; } = new List<JobSkillDto>();
    }

    public class JobSkillDto
    {
        public int SkillId { get; set; }
        public string Type { get; set; } = string.Empty;
    }
}
