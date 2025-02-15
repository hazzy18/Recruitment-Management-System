
import React, { useState } from 'react'
import CandidateForm from "./CandidateForm";
import CandidateList from './CandidateList';
import axios from "axios";
import UploadFile from './UploadFile';


export const ImportCandidateMainContainer = () => {

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Track changes
  const [isUploadOpen, setIsUploadOpen] = useState(false);



 // Function to refresh the candidate list
 const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

   // Open upload modal and reset file
   const handleOpenUpload = () => {
    setSelectedFile(null); // Reset file before opening modal
    setIsUploadOpen(true);
  };




  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div></div> {/* Empty div for spacing */}
        
        {/* <button
        onClick={handleOpenUpload}
          className="inline-flex items-center justify-center gap-2.5 bg-green-600 py-4 px-10 text-white hover:bg-green-700 lg:px-8 xl:px-10 ml-2"
        >
          Import Candidate
        </button>

        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"

        >
          Create Candidate
        </button> */}


<div className="flex items-center gap-2">
  <button
    onClick={handleOpenUpload}
    className="inline-flex items-center justify-center bg-green-600 py-4 px-10 text-white hover:bg-green-700"
  >
    Import Candidate
  </button>
  <button
    onClick={() => setIsFormOpen(true)}
    className="inline-flex items-center justify-center bg-primary py-4 px-10 text-white hover:bg-opacity-90"
  >
    Create Candidate
  </button>
</div>

        
      </div>

      <CandidateList refreshTrigger={refreshTrigger} />
      <CandidateForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onCandidateAdded={triggerRefresh}/>
      <UploadFile isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onFileSelect={setSelectedFile} selectedFile={selectedFile} onCandidateAdded={triggerRefresh}/>

    </>
  )
}

export default ImportCandidateMainContainer;







