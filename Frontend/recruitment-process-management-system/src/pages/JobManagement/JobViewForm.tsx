import { useEffect, useState } from "react";
import axios from "axios";

interface JobViewProps {
  jobId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const JobViewForm = ({ jobId, isOpen, setIsOpen }: JobViewProps) => {
  const [jobData, setJobData] = useState<any>(null);  // Use a more specific type based on your data

  useEffect(() => {
    if (jobId && isOpen) {
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5283/api/job/${jobId}`);
          setJobData(response.data);
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      };
      fetchJobDetails();
    }
  }, [jobId, isOpen]);

  return (
    <>
      {isOpen && jobData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    value={jobData.title}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled
                  />
                </div>
                <div>
                  <label className="block mb-2">Minimum Experience</label>
                  <input
                    type="number"
                    value={jobData.minExperience}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={jobData.description}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2">Status</label>
                  <input
                    type="text"
                    value={jobData.status}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled
                  />
                </div>
                {jobData.status !== "open" && (
                  <>
                    <div>
                      <label className="block mb-2">Closure Reason</label>
                      <textarea
                        value={jobData.closureReason}
                        className="w-full px-3 py-2 border rounded-md"
                        disabled
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-2">Closed Candidate ID</label>
                      <input
                        type="text"
                        value={jobData.closedCandidateId}
                        className="w-full px-3 py-2 border rounded-md"
                        disabled
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block mb-2">Skills</label>
                  <div className="my-2">
                    {jobData.skills && jobData.skills.length > 0 ? (
                      jobData.skills.map((skill: string, index: number) => (
                        <div key={index} className="px-2 py-1 border rounded-md my-1">
                          {skill}
                        </div>
                      ))
                    ) : (
                      <div>No skills listed</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobViewForm;
