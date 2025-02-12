using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace studentapi.Models
{
    [Table("skill")]
    public class Skill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Column("name")]

        public string Name { get; set; } = string.Empty;

        public ICollection<JobSkill>? JobSkills { get; set; }


        //------------------------------------ Added
         public ICollection<CandidateSkill>? CandidateSkills { get; set; }
         //--------------------------------------------

    }
}
