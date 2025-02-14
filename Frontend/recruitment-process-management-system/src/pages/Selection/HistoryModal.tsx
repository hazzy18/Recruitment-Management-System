
//-----------------------------------------------------------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeScreeningId: number;
  jobId: number;
  candidateName: string;
  jobTitle: string;
}

interface Skill {
  skillId: number;
  skillName: string;
  type: "Preferred" | "Required";
}

interface SkillRating {
  skillId: number;
  rating: number;
  additionalComments: string | null;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  resumeScreeningId,
  jobId,
  candidateName,
  jobTitle,
}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [ratings, setRatings] = useState<{ [skillId: number]: number }>({});
  const [comments, setComments] = useState<{ [skillId: number]: string }>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch skills and ratings from backend
  useEffect(() => {
    if (!isOpen) return;

    const fetchSkillsAndRatings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch job skills
        const skillsResponse = await axios.get<Skill[]>(`http://localhost:5283/api/job/${jobId}/skills`);
        setSkills(skillsResponse.data);

        // Fetch ratings and comments
        const ratingsResponse = await axios.get<SkillRating[]>(
          `http://localhost:5283/api/history/get-skill-ratings/${resumeScreeningId}`
        );

        // Map fetched ratings
        const ratingMap = ratingsResponse.data.reduce((acc, { skillId, rating }) => {
          acc[skillId] = rating;
          return acc;
        }, {} as { [skillId: number]: number });

        // Map fetched comments
        const commentMap = ratingsResponse.data.reduce((acc, { skillId, additionalComments }) => {
          acc[skillId] = additionalComments || ""; // Handle null comments
          return acc;
        }, {} as { [skillId: number]: string });

        // Set state
        setRatings(ratingMap);
        setComments(commentMap);
      } catch (err) {
        setError("Failed to fetch job skills or skill ratings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsAndRatings();
  }, [isOpen, jobId, resumeScreeningId]);

  // Handle rating change
  const handleRatingChange = (skillId: number, value: number) => {
    setRatings((prev) => ({ ...prev, [skillId]: value }));
  };

  // Handle comment change
  const handleCommentChange = (skillId: number, value: string) => {
    setComments((prev) => ({ ...prev, [skillId]: value }));
  };

  // Submit feedback


  // Star Rating Component
  const StarRating = ({ skillId, value }: { skillId: number; value: number }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          className={`cursor-pointer ${star <= value ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          onClick={() => handleRatingChange(skillId, star)}
        />
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
        <h2 className="text-xl font-semibold mb-4">Add Feedback</h2>
        <div className="mb-4">
          <label className="block mb-1">Candidate Name</label>
          <input type="text" value={candidateName} disabled className="w-full px-3 py-2 border rounded-md bg-gray-200" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Job Title</label>
          <input type="text" value={jobTitle} disabled className="w-full px-3 py-2 border rounded-md bg-gray-200" />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading skills...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Preferred Skills */}
            <div className="mb-4">
              <label className="block mb-1">Preferred Skills</label>
              {skills.filter((s) => s.type === "preferred").map((skill) => (
                <div key={skill.skillId} className="flex gap-2 mb-2 items-center">
                  <span className="w-1/3 font-medium truncate">{skill.skillName}</span>
                  <StarRating skillId={skill.skillId} value={ratings[skill.skillId] || 1} />
                  <textarea
                    placeholder="Add comments..."
                    value={comments[skill.skillId] || ""}
                    onChange={(e) => handleCommentChange(skill.skillId, e.target.value)}
                    className="w-1/3 h-[30px] px-2 py-1 border rounded-md text-sm resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Required Skills */}
            <div className="mb-4">
              <label className="block mb-1">Required Skills</label>
              {skills.filter((s) => s.type === "required").map((skill) => (
                <div key={skill.skillId} className="flex gap-2 mb-2 items-center">
                  <span className="w-1/3 font-medium truncate">{skill.skillName}</span>
                  <StarRating skillId={skill.skillId} value={ratings[skill.skillId] || 1} />
                  <textarea
                    placeholder="Add comments..."
                    value={comments[skill.skillId] || ""}
                    onChange={(e) => handleCommentChange(skill.skillId, e.target.value)}
                    className="w-1/3 h-[30px] px-2 py-1 border rounded-md text-sm resize-none"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
