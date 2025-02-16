import React, { useState, useEffect } from "react";
import api from "../../axiosInstance";
import Select from "react-select";

interface CandidateFormProps {
    isOpen: boolean;
    onClose: () => void;
    onCandidateAdded: () => void
  }
  
  const CandidateForm: React.FC<CandidateFormProps> = ({ isOpen, onClose,onCandidateAdded }) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: 0,
        skillIds: [] as number[],
      });
      
      const [skills, setSkills] = useState<{ value: number; label: string }[]>([]);

      useEffect(() => {
        if (isOpen) {
          setFormData({
            name: "",
            email: "",
            phone: "",
            experience: 0,
            skillIds: [],
          });
        }
      }, [isOpen]);
    
    
      // Fetch skills from the backend
  useEffect(() => {
    api
      .get("http://localhost:5283/api/skill") // Adjust the API if needed
      .then((response) => {
        const skillOptions = response.data.map((skill: { id: number; name: string }) => ({
          value: skill.id,
          label: skill.name,
        }));
        setSkills(skillOptions);
        console.log(response);
      })
      .catch((error) => console.error("Error fetching skills:", error));
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle skill selection
  const handleSkillChange = (selected: any) => {
    setFormData({ ...formData, skillIds: selected.map((s: { value: number }) => s.value) });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        await api.post("http://localhost:5283/api/candidates", formData);
        onCandidateAdded();
        alert("Candidate added successfully!");
        onClose(); // Close the modal after submission
      } catch (error) {
        console.error("Error adding candidate:", error);
        alert("Failed to add candidate.");
      }
    };
    // If modal is closed, do not render the form
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Create Candidate</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2">Skills</label>
              <Select
                isMulti
                options={skills}
                onChange={handleSkillChange}
                className="my-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
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
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;


//---------------------------------------------------------------------------------------------------------


