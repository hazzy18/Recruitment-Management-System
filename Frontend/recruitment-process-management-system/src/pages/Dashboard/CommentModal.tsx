
//---------------------------------------------------------------------------------------------------------------------------------------


import React, { useEffect } from "react";
import axios from "axios"; // 


interface Skill {
  skillName: string;
  skillExperience: string;
  skillId: number; // ✅ Ensure skillId exists

}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: number; // ✅ Added candidateId for API
  resumeScreeningId: number; // ✅ Needed for backend

  candidateName: string;
  totalExperience: number;
  skills: Skill[];
  comments:string;
  onSkillExperienceChange: (index: number, value: string) => void;
  onSubmit: () => void; // ✅ Callback after successful submission

}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  resumeScreeningId,
  candidateName,
  totalExperience,
  skills,
  comments,   
  onSkillExperienceChange,
 
}) => {
  const [commonText, setComments] = React.useState(comments||"");

  useEffect(() => {
    setComments(comments || "");
  }, [comments]);


  // ✅ Function to submit data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Transform skills to match backend structure
    const formattedSkills = skills.map((skill) => ({
        skillId: skill.skillId,
        experienceSkill: Number(skill.skillExperience) || 0, // Convert to number
      }));
      
  
      const payload = {
        resumeScreeningId,
        comment: commonText,
        skills: formattedSkills,
      };
  
      try {
        const response = await axios.post("http://localhost:5283/api/screenings/submit-comment", payload);
        console.log("Success:", response.data);
        onClose(); // ✅ Close modal
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Add Comment</h2>

        <form
          onSubmit={handleSubmit}
        >
          {/* Candidate Name */}
          <div className="mb-4">
            <label className="block mb-1">Candidate Name</label>
            <input
              type="text"
              value={candidateName}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Total Experience */}
          <div className="mb-4">
            <label className="block mb-1">Total Experience (Years)</label>
            <input
              type="number"
              value={totalExperience}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-200"
            />
          </div>

          {/* Skills & Experience */}
          <div className="mb-4">
            <label className="block mb-1">Skills & Experience</label>
            {skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skill.skillName}
                  disabled
                  className="w-1/2 px-3 py-2 border rounded-md bg-gray-200"
                />
                <input
                  type="text"
                  placeholder="Enter experience"
                  value={skill.skillExperience}
                  onChange={(e) => onSkillExperienceChange(index, e.target.value)}
                  className="w-1/2 px-3 py-2 border rounded-md"
                />
              </div>
            ))}
          </div>

          {/* Comments */}
          <div className="mb-4">
            <label className="block mb-1">Comments</label>
            <textarea
              value={commonText}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your comments here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;