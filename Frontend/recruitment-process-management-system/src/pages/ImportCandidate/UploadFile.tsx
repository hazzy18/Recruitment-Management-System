import React, { useEffect, useState } from "react";
import axios from "axios";

interface UploadFileProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onCandidateAdded: () => void


}

const UploadFile: React.FC<UploadFileProps> = ({ isOpen, onClose, onFileSelect,selectedFile,onCandidateAdded }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);


    // Reset file when modal opens
  useEffect(() => {
    if (isOpen) {
      setFile(null); // Clear previous selection
      setMessage(null);
    }
  }, [isOpen]);

  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFile = event.target.files[0];
      setFile(newFile);
      onFileSelect(newFile); // Pass file to parent component
    }
  };



  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5283/api/candidates/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onCandidateAdded();


      setMessage("Upload successful!");
    //   onClose();

    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };




  if (!isOpen) return null; // Hide modal when not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Excel File</h2>
        
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
        />

        {file && (
          <p className="mt-2 text-sm text-gray-700">Selected File: {file.name}</p>
        )}
        {message && <p className="mt-2 text-sm text-center text-green-600">{message}</p>}


        <div className="mt-4 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button 
          onClick={handleUpload}
            disabled={!file || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
