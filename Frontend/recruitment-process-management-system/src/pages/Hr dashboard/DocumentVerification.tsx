
//--------------------------------------------------------------------------------------------


import { useEffect, useState } from "react";
import axios from "axios";


interface ResumeScreening {
  resumeScreeningId: number;
  jobName: string;
  jobId:number;

  candidateName: string;
  candidateEmail: string;
  experience: number;
  status: string;
  reviewerId: number;
}

const DocumentVerification = () => {
  const [screenings, setScreenings] = useState<ResumeScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<ResumeScreening | null>(null);


  const handleDownload = async (resumeScreeningId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5283/api/hr/download/${resumeScreeningId}`,
        { responseType: "blob" } // Ensures we receive a file
      );

          // Extract filename from the response headers (if available)
    let fileName = "Candidate_Document";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) {
        fileName = match[1]; // Get the actual file name from the response
      }
    }

    // Determine file type from response headers
    const fileType = response.headers["content-type"] || "application/octet-stream";

    // Create a Blob with the correct type
    const blob = new Blob([response.data], { type: fileType });
  
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Change as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  

  const handleVerify = async (resumeScreeningId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:5283/api/hr/verify/${resumeScreeningId}`
      );
  
      alert("Candidate Verified Successfully!");
      window.location.reload(); // Refresh the page to update status
    } catch (error) {
      console.error("Error verifying candidate:", error);
      alert("Failed to verify candidate.");
    }
  };
  
  

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await axios.get<ResumeScreening[]>(
          "http://localhost:5283/api/screenings/?unassignedOnly=false&statusFilter=Document Uploaded"
        );
        setScreenings(response.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchScreenings();
  }, []);




  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
         Candidates for Document Verification
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


                        {/* Download Button */}
 <button className="hover:text-primary"
 onClick={() => handleDownload(screening.resumeScreeningId)}
 >
    <svg
      className="fill-current mr-4"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 12L5 8H8V2H10V8H13L9 12ZM3 14V16H15V14H3Z"
        fill="currentColor"
      />
    </svg>
  </button>
                      <button
                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => handleVerify(screening.resumeScreeningId)}
                        >

                        Verify Candidate
                      </button>
 
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-gray-500">
                    No candidates available for Round 2.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      )}


    </div>
  );
};

export default DocumentVerification;
