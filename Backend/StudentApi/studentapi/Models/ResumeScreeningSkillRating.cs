using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace studentapi.Models
{
    [Table("resume_screening_skill_rating")]
    public class ResumeScreeningSkillRating
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("screening_id")]
        public int ScreeningId { get; set; }

        [Required]
        [Column("skill_id")]
        public int SkillId { get; set; }

        [Column("rating")]
        public int? Rating { get; set; } // Nullable because rating might not always be provided

        [Column("additional_comments")]
        public string? AdditionalComments { get; set; } // Nullable for optional comments

        // Navigation Properties
        [ForeignKey("ScreeningId")]
        public ResumeScreening? ResumeScreening { get; set; }

        [ForeignKey("SkillId")]
        public Skill? Skill { get; set; }
    }
}
