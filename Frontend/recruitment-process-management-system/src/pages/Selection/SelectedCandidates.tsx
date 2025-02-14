
// //----------------------------------------------------------------------------------


// import { useEffect, useState } from "react";
// import axios from "axios";
// import HistoryModal from "./HistoryModal";
// import UploadFile from "./UploadFile";


// interface ResumeScreening {
//   resumeScreeningId: number;
//   jobName: string;
//   jobId: number;
//   candidateName: string;
//   candidateEmail: string;
//   experience: number;
//   status: string;
//   reviewerId: number;
// }

// const SelectedCandidates = () => {
//   const [screenings, setScreenings] = useState<ResumeScreening[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedScreening, setSelectedScreening] = useState<ResumeScreening | null>(null);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);


  
//   // Open modal
// const handleOpenModal = (screening: ResumeScreening) => {
//     setSelectedScreening(screening);
//   };
  
//   // Close modal
//   const handleCloseModal = () => {
//     setSelectedScreening(null);
//   };

// // Open file upload modal
// const handleOpenUploadModal = () => {
//   setIsUploadModalOpen(true);
// };

// const handleCloseUploadModal = () => {
//   setIsUploadModalOpen(false);
//   setSelectedFile(null);
// };

// const handleFileSelect = (file: File) => {
//   setSelectedFile(file);
// };

// const handleCandidateAdded = () => {
//   alert("File uploaded successfully!");
//   handleCloseUploadModal();
// };


  


//   useEffect(() => {
//     const fetchScreenings = async () => {
//       try {
//         const response = await axios.get<ResumeScreening[]>(
//           "http://localhost:5283/api/screenings/?unassignedOnly=false&statusFilter=Selected"
//         );
//         setScreenings(response.data);
//       } catch (err) {
//         setError("Failed to fetch data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScreenings();
//   }, []);

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
//         Selected Candidates
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <div className="max-w-full overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-2 text-left dark:bg-meta-4">
//                 <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
//                   Job Title
//                 </th>
//                 <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
//                   Candidate Name
//                 </th>
//                 <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
//                   Status
//                 </th>
//                 <th className="py-4 px-4 font-medium text-black dark:text-white">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {screenings.length > 0 ? (
//                 screenings.map((screening) => (
//                   <tr key={screening.resumeScreeningId}>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <h5 className="font-medium text-black dark:text-white">
//                         {screening.jobName}
//                       </h5>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <p className="text-black dark:text-white">
//                         {screening.candidateName}
//                       </p>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
//                         {screening.status}
//                       </p>
//                     </td>
//                     <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                       <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
//                         onClick={() => handleOpenModal(screening)}

//                       >
//                         Interview History
//                       </button>


//                         {/* Upload Document Button */}

//   <button
//     className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
//     onClick={handleOpenUploadModal}

//   >
//     Upload Document
//   </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center py-5 text-gray-500">
//                     No candidates available in Selected status.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

// {selectedScreening && (
//   <HistoryModal
//     isOpen={!!selectedScreening}
//     onClose={handleCloseModal}
//     resumeScreeningId={selectedScreening.resumeScreeningId}
//     jobId={selectedScreening.jobId}
//     candidateName={selectedScreening.candidateName}
//     jobTitle={selectedScreening.jobName}
//   />
// )}
//  {/* Upload File Modal */}
//  <UploadFile
//         isOpen={isUploadModalOpen}
//         onClose={handleCloseUploadModal}
//         onFileSelect={handleFileSelect}
//         selectedFile={selectedFile}
//         onCandidateAdded={handleCandidateAdded}
//       />

//     </div>
//   );
// };

// export default SelectedCandidates;


//-----------------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------


import { useEffect, useState } from "react";
import axios from "axios";
import HistoryModal from "./HistoryModal";
import UploadFile from "./UploadFile";


interface ResumeScreening {
  resumeScreeningId: number;
  jobName: string;
  jobId: number;
  candidateName: string;
  candidateEmail: string;
  experience: number;
  status: string;
  reviewerId: number;
}

const SelectedCandidates = () => {
  const [screenings, setScreenings] = useState<ResumeScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<ResumeScreening | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedResumeScreeningId, setSelectedResumeScreeningId] = useState<number | null>(null);


  
  // Open modal
const handleOpenModal = (screening: ResumeScreening) => {
    setSelectedScreening(screening);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setSelectedScreening(null);
  };

// Open file upload modal & set resumeScreeningId
const handleOpenUploadModal = (screening: ResumeScreening) => {
  setSelectedResumeScreeningId(screening.resumeScreeningId);
  setIsUploadModalOpen(true);
};

// Close modal
const handleCloseUploadModal = () => {
  setIsUploadModalOpen(false);
  setSelectedFile(null);
  setSelectedResumeScreeningId(null);
};

const handleFileSelect = (file: File) => {
  setSelectedFile(file);
};
  


  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await axios.get<ResumeScreening[]>(
          "http://localhost:5283/api/screenings/?unassignedOnly=false&statusFilter=Selected"
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
        Selected Candidates
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
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  Job Title
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Candidate Name
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
                      <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium bg-success text-success">
                        {screening.status}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
                        onClick={() => handleOpenModal(screening)}

                      >
                        Interview History
                      </button>


                        {/* Upload Document Button */}

  <button
    className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
    onClick={()=>handleOpenUploadModal(screening)}

  >
    Upload Document
  </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-gray-500">
                    No candidates available in Selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

{selectedScreening && (
  <HistoryModal
    isOpen={!!selectedScreening}
    onClose={handleCloseModal}
    resumeScreeningId={selectedScreening.resumeScreeningId}
    jobId={selectedScreening.jobId}
    candidateName={selectedScreening.candidateName}
    jobTitle={selectedScreening.jobName}
  />
)}
 {/* Upload File Modal */}
 <UploadFile
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
  resumeScreeningId={selectedResumeScreeningId}
      />

    </div>
  );
};

export default SelectedCandidates;


