using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace studentapi.Models
{
    [Table("candidate_skill")]
    public class CandidateSkill
    {
        [Key]
        public int Id { get; set; } 

        [ForeignKey("Candidate")]
        [Column("candidate_id")]
        public int CandidateId { get; set; }
        public Candidate Candidate { get; set; }

        [ForeignKey("Skill")]
        [Column("skill_id")]
        public int SkillId { get; set; }
        public Skill Skill { get; set; }
         [Column("experience_skill")]
        public int? ExperienceSkill { get; set; } // Nullable to allow default NULL
    }
}
