//------------------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import axios from "axios";
import CommentModal from "./CommentModal";

interface Screening {
  resumeScreeningId: number;
  jobName: string;
  candidateName: string;
  status: string;
  experience:number;
  
}

const ReviewerPage: React.FC = () => {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({
    screeningId:0,
    name: "",
    experience: 0,
    skills: [] as { skillName: string; skillExperience: string }[],
  });
  const [selectedComment, setSelectedComment] = useState({})



  const handleOpenModal = async (screenId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5283/api/screenings/candidate-details/${screenId}`
      );

      //--------------debugging
      console.log("API Response:", response.data); // Debugging
      console.log("Comments:", response.data.comments);

      const { candidateName, experience, skills,comments } = response.data;
  
      setSelectedCandidate({
        screeningId:screenId,
        name:candidateName,
        experience,
        skills: skills.map((skill: any) => ({
          skillName: skill.skillName,
          skillExperience: skill.experienceSkill.toString(), // Ensure it's a string
          skillId: skill.skillId || 0, // ✅ Ensure skillId exists

        })),
            });
      
      setSelectedComment(comments || ""); // Store fetched comment

  
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    }
  };
  



  useEffect(() => {
    axios
      .get("http://localhost:5283/api/screenings/?unassignedOnly=false&statusFilter=In Review")
      .then((response) => {
        setScreenings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching screenings:", error);
      });
  }, []);








  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await axios.put(`http://localhost:5283/api/screenings/${id}/status`, {
        status: newStatus,
      });
  
      console.log("Status updated:", response.data);
  
      // Update state to reflect new status
      setScreenings((prevScreenings) =>
        prevScreenings.map((screening) =>
          screening.resumeScreeningId === id
            ? { ...screening, status: newStatus }
            : screening
        )
      );
    } catch (error) {
      console.error(`Error updating status to ${newStatus}:`, error);
    }
  };



 

  const handleShortlist = (id: number) => {
  handleStatusChange(id, "Shortlisted");
    // Call API to update status to "Shortlisted"
  };

  const handleReject = (id: number) => {
    handleStatusChange(id, "Rejected");
    // Call API to update status to "Rejected"
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                ResumeScreening ID
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Job Title
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Candidate Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
  Experience (Years)
</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {screenings.length > 0 ? (
              screenings.map((screening) => (
                <tr key={screening.resumeScreeningId}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {screening.resumeScreeningId}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {screening.jobName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {screening.candidateName}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
  <p className="text-black dark:text-white">{screening.experience}</p>
</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        screening.status === "Shortlisted"
                          ? "bg-success text-success"
                          : screening.status === "Rejected"
                          ? "bg-danger text-danger"
                          : "bg-warning text-warning"
                      }`}
                    >
                      {screening.status}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
                      onClick={() => handleOpenModal(screening.resumeScreeningId)}                    >
                      Add Comment
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600 mr-2"
                      onClick={() => handleShortlist(screening.resumeScreeningId)}
                    >
                      Shortlist
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleReject(screening.resumeScreeningId)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5 text-gray-500">
                  No screening data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeScreeningId={selectedCandidate.screeningId}
        candidateName={selectedCandidate.name}
        totalExperience={selectedCandidate.experience}
        skills={selectedCandidate.skills}
        comments={selectedComment} // Pass the existing comment

        onSkillExperienceChange={(index: number, value: string) => {
          setSelectedCandidate((prev) => {
            const updatedSkills = prev.skills.map((skill, i) =>
              i === index ? { ...skill, skillExperience: value } : skill
            );
            return { ...prev, skills: updatedSkills };
          });
        }}
      />
      </div>
    </div>
  );
};

export default ReviewerPage;



