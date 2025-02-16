
//----------------------------------------------------------------



import React, { useEffect, useState } from "react";
import api from "../../axiosInstance";
import AssignReviewerModal from "./AssignReviewerModal";



// Define TypeScript interface for screening data
interface Screening {
  resumeScreeningId: number;
  jobName: string;
  candidateName: string;
  status: string;
}

const ScreeningPage: React.FC = () => {
  const [screenings, setScreenings] = useState<Screening[]>([]); // Explicitly set type
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewers, setReviewers] = useState<{ id: number; name: string }[]>([]);

  
  const [selectedReviewer, setSelectedReviewer] = useState<number | null>(null);
  // const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const [selectedScreeningRecord, setSelectedScreeningRecord] = useState<number | null>(null);




  const fetchScreenings=() => {
    api
      .get<Screening[]>("http://localhost:5283/api/screenings") // Ensure correct response type
      .then((response) => {
        setScreenings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching screening data:", error);
      });
  };

  useEffect(() => {
    fetchScreenings(); // Fetch data when component mounts
  }, []);



  useEffect(() => {
    fetch("http://localhost:5283/api/employees/reviewers")
      .then((response) => response.json())
      .then((data) => setReviewers(data))
      .catch((error) => console.error("Error fetching reviewers:", error));
  }, []);

  const handleOpenModal = (resumeScreeningId: number) => {
    setSelectedScreeningRecord(resumeScreeningId);
    setIsModalOpen(true);
  };

  const handleAssignReviewer = async () => {
    if (selectedScreeningRecord === null || selectedReviewer === null) {
      console.error("No screening record or reviewer selected!");
      return;
    }
    try {
      await api.post("http://localhost:5283/api/screenings/assign-reviewer", {
        resumeScreeningId: selectedScreeningRecord,
        reviewerId: selectedReviewer,
      });
      setIsModalOpen(false);
    console.log("Reviewer assigned successfully");


    fetchScreenings();

  } catch (error) {
    console.error("Error assigning reviewer:", error);
  }
};




  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">ResumeScreening ID</th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">Job Title</th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">Candidate Name</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {screenings.length > 0 ? (
              screenings.map((screening, index) => (
                <tr key={index}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{screening.resumeScreeningId}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">{screening.jobName}</h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{screening.candidateName}</p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        screening.status === "Accepted"
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
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => handleOpenModal(screening.resumeScreeningId)}
                  >
                    Assign Reviewer
                  </button>                  </td>
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
      </div>

      {/* Assign Reviewer Modal */}
      <AssignReviewerModal
        isOpen={isModalOpen}
        reviewers={reviewers}
        selectedReviewer={selectedReviewer}
        setSelectedReviewer={setSelectedReviewer}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssignReviewer}
      />
    </div>
  );
};

export default ScreeningPage;
















