

//----------------------------------------------------------------------------------------------


import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import FeedbackModal from "./FeedbackModal";
import { isRoleAllowed } from "../../auth";

interface ResumeScreening {
  resumeScreeningId: number;
  jobId:number,
  jobName: string;
  candidateName: string;
  candidateEmail: string;
  experience: number;
  status: string;
  reviewerId: number;
}

const Round1 = () => {
  const [screenings, setScreenings] = useState<ResumeScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<ResumeScreening | null>(null);


// Open modal
const handleOpenModal = (screening: ResumeScreening) => {
  setSelectedScreening(screening);
};

// // Close modal
// const handleCloseModal = () => {
//   setSelectedScreening(null);
// };



  // useEffect(() => {
  //   const fetchScreenings = async () => {
  //     try {
  //       const response = await api.get<ResumeScreening[]>(
  //         "http://localhost:5283/api/screenings/?unassignedOnly=false&statusFilter=Round 1"
  //       );
  //       setScreenings(response.data);
  //     } catch (err) {
  //       setError("Failed to fetch data. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchScreenings();
  // }, []);

















  
    const fetchScreenings = async () => {
      try {
        const response = await api.get<ResumeScreening[]>(
          "http://localhost:5283/api/screenings/?unassignedOnly=false&statusFilter=Round 1"
        );
        setScreenings(response.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    
    useEffect(() => {

    fetchScreenings();
  }, []);


  const handleCloseModal = (refresh: boolean = false) => {
    setSelectedScreening(null);
    if (refresh) {
      fetchScreenings(); // Refresh the list after feedback submission
    };
  }
  


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Round 1 Candidates
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
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
                      <p className="text-black dark:text-white">
                        {screening.experience}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          screening.status === "Round1"
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
                     {isRoleAllowed(["Admin","Interviewer"]) &&(
                      
                      <button
                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => handleOpenModal(screening)}
                        >
                        Add feedback
                      </button>
                     )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-gray-500">
                    No candidates available for Round 1.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
{selectedScreening && (
  <FeedbackModal
    isOpen={!!selectedScreening}
    onClose={handleCloseModal}
    resumeScreeningId={selectedScreening.resumeScreeningId}
    jobId={selectedScreening.jobId}
    candidateName={selectedScreening.candidateName}
    jobTitle={selectedScreening.jobName}

  />
)}
    </div>
  );
};

export default Round1;
