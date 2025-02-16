
//------------------------------------------------------------------------------------------------------------------------------


import React, { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../axiosInstance";


// Define the interface for interviewers
interface Interviewer {
  value: number;  // ✅ Store Interviewer ID instead of email
  label: string;  // Interviewer Name
  email: string;  // Interviewer Email
}

interface ShortlistModalProps {
  resumeScreeningId: number;  // ✅ Add this
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  totalExperience: number;
  onClose: () => void;
}

const ShortlistModal: React.FC<ShortlistModalProps> = ({
  resumeScreeningId,  // ✅ Include resumeScreeningId
  candidateName,
  candidateEmail,
  jobTitle,
  totalExperience,
  onClose,
}) => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]); // Interviewers List
  const [selectedInterviewers, setSelectedInterviewers] = useState<Interviewer[]>([]); // Selected Interviewers
  const [interviewTime, setInterviewTime] = useState<string>(""); // Editable field
  const [totalRounds, setTotalRounds] = useState<number | "">(""); // Added state for total rounds


  const handleScheduleInterview = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent form submission from refreshing the page
    if (selectedInterviewers.length === 0) {
      alert("Please select at least one interviewer.");
      return;
    }
    if (!interviewTime) {
      alert("Please select an interview time.");
      return;
    }
    if (!totalRounds) {
      alert("Please select the total number of rounds.");
      return;
    }
    // Extract interviewer IDs and Emails
    const interviewerIds = selectedInterviewers.map((interviewer) => interviewer.value);
    const interviewerEmails = selectedInterviewers.map((interviewer) => interviewer.email);


    try {
      await api.post("http://localhost:5283/api/interview/schedule", {
        resumeScreeningId,  // ✅ Include resumeScreeningId
        candidateEmail,
        interviewerEmails: interviewerEmails,
        interviewerIds,  // ✅ Include interviewer IDs
        time: interviewTime,
        totalRounds,  // ✅ Include totalRounds

      });

      alert("Interview scheduled successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      alert("Failed to schedule interview. Please try again.");
    }
  };





  // Fetch interviewers from API
  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await api.get("http://localhost:5283/api/employees/interviewers");

        if (response.data && Array.isArray(response.data)) {
          // Transform API response into required format for react-select
          const formattedData = response.data.map((interviewer) => ({
            value: interviewer.id,  // ✅ Store ID as value
            label: interviewer.name, 
            email: interviewer.email,  // ✅ Keep email separately
          }));

          setInterviewers(formattedData);
        }
      } catch (error) {
        console.error("Error fetching interviewers:", error);
      }
    };

    fetchInterviewers();
  }, []);




  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>

        <form onSubmit={handleScheduleInterview}>
          {/* Job Title */}
          <div className="mb-4">
            <label className="block mb-1">Job Title</label>
            <input
              type="text"
              value={jobTitle}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-200"
            />
          </div>

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

          {/* Total Rounds Dropdown */}
          <div className="mb-4">
            <label className="block mb-1">Total Rounds</label>
            <select
              value={totalRounds}
              onChange={(e) => setTotalRounds(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Rounds</option>
              <option value="2">2</option>
              <option value="3">3</option>

            </select>
          </div>



          {/* Interviewer Selection */}
          <div className="mb-4">
            <label className="block mb-1">Select Interviewer</label>
            <Select
              isMulti
              options={interviewers}
              value={selectedInterviewers}
              onChange={(selected) => setSelectedInterviewers(selected as Interviewer[])}
              className="my-2"
              placeholder="Select interviewers..."
            />
          </div>

          {/* Interview Time */}
          <div className="mb-4">
            <label className="block mb-1">Interview Time</label>
            <input
              type="datetime-local"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
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
            //   onClick={handleScheduleInterview}

            >
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShortlistModal;


