using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace studentapi.Models
{
    [Table("job_skill")]

    public class JobSkill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [Column("job_id")]
        public int JobId { get; set; }

        [ForeignKey("JobId")]
        public JobPosition? JobPosition { get; set; }

        [Required]
        [Column("skill_id")]

        public int SkillId { get; set; }

        [ForeignKey("SkillId")]
        public Skill? Skill { get; set; }

        [Required]
        [StringLength(50)]
        [Column("type")]

        public string Type { get; set; } = string.Empty;
    }
}
