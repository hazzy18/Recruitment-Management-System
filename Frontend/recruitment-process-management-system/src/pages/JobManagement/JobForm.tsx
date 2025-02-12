import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

const JobForm = ({ isOpen, setIsOpen, jobId, operation }: any) => {
  const [skills, setSkills] = useState<{ value: string; label: string }[]>([]);

  // Separate states for required and preferred skills
  const [requiredSkills, setRequiredSkills] = useState<{ value: string; label: string }[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<{ value: string; label: string }[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    min_experience: "",
    status: "open",
    closure_reason: "",
    closed_candidate_id: "",
    required_skills: [] as string[], // Store values only
    preferred_skills: [] as string[], // Store values only
  });




  // Handle text & select inputs
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle required skills selection
  const handleRequiredSkillsChange = (selected: any) => {
    setRequiredSkills(selected);
    setFormData({ ...formData, required_skills: selected.map((s: any) => s.value) });
  };

  // Handle preferred skills selection
  const handlePreferredSkillsChange = (selected: any) => {
    setPreferredSkills(selected);
    setFormData({ ...formData, preferred_skills: selected.map((s: any) => s.value) });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(operation=='create'){

    
    try {
  
      // Transform form data into API-compatible format
      const apiPayload = {
        title: formData.title,
        description: formData.description,
        minExperience: parseInt(formData.min_experience, 10), // Convert string to number
        status: formData.status,
        closureReason: formData.closure_reason || "", // Ensure it's always a string
        jobSkills: [
          ...formData.required_skills.map((id: string) => ({
            skillId: parseInt(id, 10),
            type: "required",
          })),
          ...formData.preferred_skills.map((id: string) => ({
            skillId: parseInt(id, 10),
            type: "preferred",
          })),
        ],
      };

      console.log("Transformed Payload:", apiPayload);
      // Send data to API using Axios
      const response = await axios.post("http://localhost:5283/api/job", apiPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Job created successfully:", response.data);
      alert("Job created successfully")

      setIsOpen(false);
    }
    
    catch (error) {
      console.error("Error submitting job:", error);
    }
  }else if(operation=="edit"){
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        minExperience: formData.min_experience,
        status: formData.status,
        closureReason: formData.closure_reason || null,
        jobSkills: [
          ...formData.required_skills.map((skillId: string) => ({
            skillId: parseInt(skillId),
            type: "required",
          })),
          ...formData.preferred_skills.map((skillId: string) => ({
            skillId: parseInt(skillId),
            type: "preferred",
          })),
        ],
      };

      const response = await axios.put(
        `http://localhost:5283/api/job/${jobId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Job updated successfully:", response.data);
      alert("Succesfully updated ")
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating job:", error);

    }
  }
  };


  useEffect(() => {
    if (jobId && isOpen && (operation == "view" || operation == "edit")) {
      const fetchJobDetails = async () => {
        try {
          const response: any = await axios.get(`http://localhost:5283/api/job/${jobId}`);

          console.log(response)
          const data = response.data
          console.log(data)

          if (data) {
            setFormData({
              title: data.title,
              description: data.description,
              min_experience: data.minExperience,
              status: data.status,
              closure_reason: data.closureReason || "",
              closed_candidate_id: "",
              required_skills: data.jobSkills
                .filter((skill: any) => skill.type === "required")
                .map((skill: any) => skill.skillId.toString()),

              preferred_skills: data.jobSkills
                .filter((skill: any) => skill.type === "preferred")
                .map((skill: any) => skill.skillId.toString()),
            });
            // Extract required skills
            const requiredSkillIds = data.jobSkills
              .filter((skill: any) => skill.type === "required")
              .map((skill: any) => skill.skillId.toString());

// Extract preferred skill IDs
const preferredSkillIds = data.jobSkills
.filter((skill: any) => skill.type === "preferred")
.map((skill: any) => skill.skillId.toString());



            // Map required skills to { value, label } format
            const requiredSkillObjects = requiredSkillIds
              .map((skillId: any) => skills.find(skill => skill.value === skillId))
              .filter((skill: any) => skill !== undefined) as { value: string; label: string }[];


 // Map preferred skills to { value, label } format
 const preferredSkillObjects = preferredSkillIds
 .map((skillId:any) => skills.find(skill => skill.value === skillId))
 .filter((skill:any) => skill !== undefined) as { value: string; label: string }[];


            setRequiredSkills(requiredSkillObjects);
            setPreferredSkills(preferredSkillObjects);

          }
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      };
      fetchJobDetails();
    }
    else {
      setFormData({
        title: "",
        description: "",
        min_experience: "",
        status: "open",
        closure_reason: "",
        closed_candidate_id: "",
        required_skills: [] as string[], // Store values only
        preferred_skills: [] as string[], // Store values only
        
      })
      setRequiredSkills([]);
      setPreferredSkills([]);

    }
  }, [jobId, isOpen]);

//for fteching skills 
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:5283/api/skill");
        console.log("Api response is coming", response)
        // Assuming API response is an array of objects like [{ id: 1, name: "React" }]
        const formattedSkills = response.data.map((skill: any) => ({
          value: skill.id.toString(), // Convert id to string if needed
          label: skill.name
        }));

        setSkills(formattedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
          { operation=="view" && <h2 className="text-xl font-semibold mb-4">View Job</h2>}
          { operation=="edit" && <h2 className="text-xl font-semibold mb-4">Edit Job</h2>}
          { operation=="create" && <h2 className="text-xl font-semibold mb-4">Create Job</h2>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    disabled={operation == "view"}
                  />
                </div>
                <div>
                  <label className="block mb-2">Minimum Experience</label>
                  <input
                    type="number"
                    name="min_experience"
                    value={formData.min_experience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    disabled={operation == "view"}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    disabled={operation == "view"}
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    disabled={operation == "view"}
                  >
                    <option value="open">Open</option>
                    <option value="on_hold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                {formData.status !== "open" && (
                  <>
                    <div>
                      <label className="block mb-2">Closure Reason</label>
                      <textarea
                        name="closure_reason"
                        value={formData.closure_reason}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                        disabled={operation == "view"}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-2">Closed Candidate ID</label>
                      <input
                        type="text"
                        name="closed_candidate_id"
                        value={formData.closed_candidate_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                        disabled={operation == "view"}
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block mb-2">Required Skills</label>
                  <Select
                    isMulti
                    options={skills}
                    value={requiredSkills}
                    onChange={handleRequiredSkillsChange}
                    className="my-2"
                    isDisabled={operation == "view"}
                  />
                </div>
                <div>
                  <label className="block mb-2">Preferred Skills</label>
                  <Select
                    isMulti
                    options={skills}
                    value={preferredSkills}
                    onChange={handlePreferredSkillsChange}
                    className="my-2"
                    isDisabled={operation == "view"}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                {operation != "view" &&
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                }
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobForm;
