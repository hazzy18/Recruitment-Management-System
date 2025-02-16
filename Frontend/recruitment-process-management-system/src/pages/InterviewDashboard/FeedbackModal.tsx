
// //------------------------------------------------------------------------------------------------------------------------

// import { useEffect, useState } from "react";
// import api from "../../axiosInstance";
// import { Star } from "lucide-react";




// interface FeedbackModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   resumeScreeningId: number;
//   jobId: number;
//   candidateName: string;
//   jobTitle: string;
// }

// interface Skill {
//   skillId: number;
//   skillName: string;
//   type: "Preferred" | "Required";
// }



// const FeedbackModal: React.FC<FeedbackModalProps> = ({
//   isOpen,
//   onClose,
//   resumeScreeningId,

//   jobId,
//   candidateName,
//   jobTitle,
// }) => {
//     const [skills, setSkills] = useState<Skill[]>([]);
//     const [ratings, setRatings] = useState<{ [skillId: number]: number }>({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [submitting, setSubmitting] = useState(false);


//     // Fetch skills from backend
//   useEffect(() => {
//     if (!isOpen) return;

//     const fetchSkills = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await api.get<Skill[]>(`http://localhost:5283/api/job/${jobId}/skills`);
//         setSkills(response.data);

//         // Initialize ratings with default value 1 for each skill
//         const initialRatings = response.data.reduce(
//           (acc, skill) => ({ ...acc, [skill.skillId]: 1 }),
//           {}
//         );
//         setRatings(initialRatings);
//       } catch (err) {
//         setError("Failed to fetch job skills.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSkills();
//   }, [isOpen, jobId]);




//   const handleRatingChange = (skillId: number, value: number) => {
//     setRatings((prev) => ({ ...prev, [skillId]: value }));
//   };


//   const handleSubmit = async () => {
//     setSubmitting(true);
//     setError(null);

//     const payload = {
//       resumeScreeningId,
//       jobId,
//       skillRatings: ratings,
//     };

//     try {
//       await api.post("http://localhost:5283/api/interview/evaluate-screening", payload);
//       onClose(); // Close modal after successful submission
//     } catch (err) {
//       setError("Failed to submit evaluation.");
//     } finally {
//       setSubmitting(false);
//     }
//   };



//     // Star Rating Component
//     const StarRating = ({ skillId, value }: { skillId: number; value: number }) => (
//         <div className="flex gap-1">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               size={24}
//               className={`cursor-pointer ${star <= value ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
//               onClick={() => handleRatingChange(skillId, star)}
//             />
//           ))}
//         </div>
//       );





//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
//         <h2 className="text-xl font-semibold mb-4">Add Feedback</h2>
//         <div className="mb-4">
//           <label className="block mb-1">Candidate Name</label>
//           <input type="text" value={candidateName} disabled className="w-full px-3 py-2 border rounded-md bg-gray-200" />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1">Job Title</label>
//           <input type="text" value={jobTitle} disabled className="w-full px-3 py-2 border rounded-md bg-gray-200" />
//         </div>


//         {loading ? (
//           <p className="text-center text-gray-500">Loading skills...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : (
//           <>
//             {/* Preferred Skills */}
//             <div className="mb-4">
//               <label className="block mb-1">Preferred Skills</label>
//               {skills.filter((s) => s.type.toLowerCase() === "preferred").map((skill) => (
//                 <div key={skill.skillId} className="flex gap-2 mb-2">
//                   <input type="text" value={skill.skillName} disabled className="w-1/2 px-3 py-2 border rounded-md bg-gray-200" />
                  
                  
//                   <StarRating skillId={skill.skillId} value={ratings[skill.skillId]} />

//                 </div>
//               ))}
//             </div>






//         {/* Required Skills */}
//         <div className="mb-4">
//               <label className="block mb-1">Required Skills</label>
//               {skills.filter((s) => s.type.toLowerCase() === "required").map((skill) => (
//                 <div key={skill.skillId} className="flex gap-2 mb-2">
//                   <input type="text" value={skill.skillName} disabled className="w-1/2 px-3 py-2 border rounded-md bg-gray-200" />



//                   <StarRating skillId={skill.skillId} value={ratings[skill.skillId]} />

//                 </div>
//               ))}
//             </div>
//           </>
//         )}



//         <div className="flex justify-end space-x-2">
//           <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
//             Cancel
//           </button>
//           <button type="button" 
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           onClick={handleSubmit}
//             disabled={submitting}
//           >
//             {submitting ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FeedbackModal;


//-------------------------------------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { Star } from "lucide-react";




interface FeedbackModalProps {
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



const FeedbackModal: React.FC<FeedbackModalProps> = ({
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


    // Fetch skills from backend
  useEffect(() => {
    if (!isOpen) return;

    const fetchSkills = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<Skill[]>(`http://localhost:5283/api/job/${jobId}/skills`);
        setSkills(response.data);

        // Initialize ratings with default value 1 for each skill
        const initialRatings = response.data.reduce(
          (acc, skill) => ({ ...acc, [skill.skillId]: 1 }),
          {}
        );
        setRatings(initialRatings);
      } catch (err) {
        setError("Failed to fetch job skills.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [isOpen, jobId]);




  const handleRatingChange = (skillId: number, value: number) => {
    setRatings((prev) => ({ ...prev, [skillId]: value }));
  };


   // Handle comment change
   const handleCommentChange = (skillId: number, value: string) => {
    setComments((prev) => ({ ...prev, [skillId]: value }));
  };


  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const payload = {
      resumeScreeningId,
      jobId,
      skillRatings: ratings,
      skillComments: comments, 

    };

    try {
      await api.post("http://localhost:5283/api/interview/evaluate-screening", payload);
      onClose(); // Close modal after successful submission
    } catch (err) {
      setError("Failed to submit evaluation.");
    } finally {
      setSubmitting(false);
    }
  };



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
              {skills.filter((s) => s.type.toLowerCase() === "preferred").map((skill) => (

                <div key={skill.skillId} className="flex gap-2 mb-2 items-center">


                {/* **Increased width for better visibility** */}
              <span className="**w-1/3 font-medium truncate**">{skill.skillName}</span> 


                    {/* <div className="flex justify-between items-center mb-1 " >
                  <input type="text" value={skill.skillName} disabled className="w-1/2 px-3 py-2 border rounded-md bg-gray-200" /> */}
                  



            
                  <StarRating skillId={skill.skillId} value={ratings[skill.skillId]} />
                
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
              {skills.filter((s) => s.type.toLowerCase() === "required").map((skill) => (
                <div key={skill.skillId} className="flex gap-2 mb-2 items-center">
                    {/* <div className="flex justify-between items-center mb-1">
                  <input type="text" value={skill.skillName} disabled className="w-1/2 px-3 py-2 border rounded-md bg-gray-200" />
                   */}

              <span className="**w-1/3 font-medium truncate**">{skill.skillName}</span> 


                  <StarRating skillId={skill.skillId} value={ratings[skill.skillId]} />

               

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
          <button type="button" 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;