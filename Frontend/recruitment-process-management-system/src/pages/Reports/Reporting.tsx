import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const Reporting: React.FC = () => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Filters
  const [technology, setTechnology] = useState("");
  const [minExperience, setMinExperience] = useState("");

  useEffect(() => {
    fetchSkills();
    fetchReport();
  }, [technology, minExperience]); // Refetch when filter changes

  // 🔹 Fetch Technologies (Skills)
  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:5283/api/skill");
      setSkills(response.data);
    } catch (err) {
      console.error("Failed to fetch skills", err);
    }
  };

  // 🔹 Fetch Report Data
  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5283/api/reports/position-wise", {
        params: { technology, minExperience },
      });
      setReportData(response.data);
    } catch (err) {
      setError("Failed to fetch report");
    }
    setLoading(false);
  };

  // Colors for Pie Chart
  const COLORS = ["#0088FE", "#FFBB28"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Position-wise Report</h2>

      {/* 🔹 Filter Options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <select
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Technology</option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Experience"
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="p-4 border rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-2">Total Applicants Per Job</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <XAxis dataKey="jobTitle" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalApplicants" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="p-4 border rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-2">Shortlisted vs Rejected</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData}
                  dataKey="shortlisted"
                  nameKey="jobTitle"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#0088FE"
                  label
                >
                  {reportData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reporting;



//--------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// const Reporting: React.FC = () => {
//   const [reportData, setReportData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Filters
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [technology, setTechnology] = useState("");
//   const [minExperience, setMinExperience] = useState("");

//   useEffect(() => {
//     fetchReport();
//   }, [startDate, endDate, technology, minExperience]); // Refetch data on filter change

//   const fetchReport = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:5283/api/reports/position-wise", {
//         params: { startDate, endDate, technology, minExperience },
//       });
//       setReportData(response.data);
//     } catch (err) {
//       setError("Failed to fetch report");
//     }
//     setLoading(false);
//   };

//   // Colors for Pie Chart
//   const COLORS = ["#0088FE", "#FFBB28"];

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Position-wise Report</h2>

//       {/* 🔹 Filter Options */}
//       <div className="grid grid-cols-4 gap-4 mb-4">
//         <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
//         <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
//         <select value={technology} onChange={(e) => setTechnology(e.target.value)} className="p-2 border rounded">
//           <option value="">Select Technology</option>
//           <option value="React">React</option>
//           <option value=".NET">.NET</option>
//           <option value="Java">Java</option>
//         </select>
//         <input type="number" placeholder="Min Experience" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} className="p-2 border rounded" />
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && (
//         <div className="grid grid-cols-2 gap-6">
//           {/* Bar Chart */}
//           <div className="p-4 border rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold text-center mb-2">Total Applicants Per Job</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={reportData}>
//                 <XAxis dataKey="jobTitle" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="totalApplicants" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Pie Chart */}
//           <div className="p-4 border rounded-lg shadow-lg">
//             <h3 className="text-lg font-semibold text-center mb-2">Shortlisted vs Rejected</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={reportData}
//                   dataKey="shortlisted"
//                   nameKey="jobTitle"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#0088FE"
//                   label
//                 >
//                   {reportData.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reporting;
