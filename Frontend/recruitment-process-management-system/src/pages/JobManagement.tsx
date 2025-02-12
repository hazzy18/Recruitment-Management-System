// // import { useState } from "react";

// // const packageData: any[] = [
// //   {
// //     name: 'Free package',
// //     price: 0.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Paid',
// //   },
// //   {
// //     name: 'Standard Package',
// //     price: 59.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Paid',
// //   },
// //   {
// //     name: 'Business Package',
// //     price: 99.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Unpaid',
// //   },
// //   {
// //     name: 'Standard Package',
// //     price: 59.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Pending',
// //   },
// // ];

// // const JobManagement = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     min_experience: "",
// //     status: "open",
// //     closure_reason: "",
// //     closed_candidate_id: "",
// //   });

// //   const handleChange = (e: any) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleSubmit = (e: any) => {
// //     e.preventDefault();
// //     console.log("Job Created:", formData);
// //     setIsOpen(false);
// //   };

// //   return (
// //     <>
// //       <div className="flex justify-between items-center mb-4">
// //         <div></div> {/* Empty div for spacing */}
// //         <button
// //           className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
// //           onClick={() => setIsOpen(true)}
// //         >
// //           Create Job
// //         </button>
// //       </div>

// //       <div>JobManagement</div>
// //       <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
// //         <div className="max-w-full overflow-x-auto">
// //           <table className="w-full table-auto">
// //             <thead>
// //               <tr className="bg-gray-2 text-left dark:bg-meta-4">
// //                 <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
// //                   Package
// //                 </th>
// //                 <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
// //                   Invoice date
// //                 </th>
// //                 <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
// //                   Status
// //                 </th>
// //                 <th className="py-4 px-4 font-medium text-black dark:text-white">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {packageData.map((packageItem, key) => (
// //                 <tr key={key}>
// //                   <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
// //                     <h5 className="font-medium text-black dark:text-white">
// //                       {packageItem.name}
// //                     </h5>
// //                     <p className="text-sm">${packageItem.price}</p>
// //                   </td>
// //                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
// //                     <p className="text-black dark:text-white">
// //                       {packageItem.invoiceDate}
// //                     </p>
// //                   </td>
// //                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
// //                     <p
// //                       className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${packageItem.status === 'Paid'
// //                         ? 'bg-success text-success'
// //                         : packageItem.status === 'Unpaid'
// //                           ? 'bg-danger text-danger'
// //                           : 'bg-warning text-warning'
// //                         }`}
// //                     >
// //                       {packageItem.status}
// //                     </p>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {isOpen && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
// //             <h2 className="text-xl font-semibold mb-4">Create Job</h2>
// //             <form onSubmit={handleSubmit}>
// //               <label className="block mb-2">Title</label>
// //               <input
// //                 type="text"
// //                 name="title"
// //                 value={formData.title}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border rounded-md mb-3"
// //                 required
// //               />

// //               <label className="block mb-2">Description</label>
// //               <textarea
// //                 name="description"
// //                 value={formData.description}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border rounded-md mb-3"
// //                 required
// //               ></textarea>

// //               <label className="block mb-2">Minimum Experience</label>
// //               <input
// //                 type="number"
// //                 name="min_experience"
// //                 value={formData.min_experience}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border rounded-md mb-3"
// //                 required
// //               />

// //               <label className="block mb-2">Status</label>
// //               <select
// //                 name="status"
// //                 value={formData.status}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border rounded-md mb-3"
// //               >
// //                 <option value="open">Open</option>
// //                 <option value="on_hold">On Hold</option>
// //                 <option value="closed">Closed</option>
// //               </select>

// //               {formData.status === "closed" && (
// //                 <>
// //                   <label className="block mb-2">Closure Reason</label>
// //                   <textarea
// //                     name="closure_reason"
// //                     value={formData.closure_reason}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border rounded-md mb-3"
// //                     required
// //                   ></textarea>

// //                   <label className="block mb-2">Closed Candidate ID</label>
// //                   <input
// //                     type="number"
// //                     name="closed_candidate_id"
// //                     value={formData.closed_candidate_id}
// //                     onChange={handleChange}
// //                     className="w-full px-3 py-2 border rounded-md mb-3"
// //                     required
// //                   />
// //                 </>
// //               )}

// //               <div className="flex justify-end space-x-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsOpen(false)}
// //                   className="px-4 py-2 bg-gray-300 rounded-lg"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
// //                 >
// //                   Submit
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default JobManagement;




























// // import React, { useState, useEffect } from "react";
// // import Select from 'react-select';
// // import { createJob, getJobs, getSkills } from '../api';
// // import { JobPosition, Skill } from '../types';

// // // Static package data
// // const packageData: any[] = [
// //   {
// //     name: 'Free package',
// //     price: 0.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Paid',
// //   },
// //   {
// //     name: 'Standard Package',
// //     price: 59.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Paid',
// //   },
// //   {
// //     name: 'Business Package',
// //     price: 99.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Unpaid',
// //   },
// //   {
// //     name: 'Standard Package',
// //     price: 59.0,
// //     invoiceDate: `Jan 13,2023`,
// //     status: 'Pending',
// //   },
// // ];

// // const JobManagement = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [showSkills, setShowSkills] = useState(false);
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     min_experience: "",
// //     status: "open",
// //     closure_reason: "",
// //     closed_candidate_id: "",
// //     required_skills: [],
// //     preferred_skills: []
// //   });
// //   const [jobs, setJobs] = useState<JobPosition[]>([]);
// //   const [skills, setSkills] = useState<{ value: number; label: string }[]>([]);

// //   useEffect(() => {
// //     const fetchJobs = async () => {
// //       try {
// //         const response = await getJobs();
// //         setJobs(response.data);
// //       } catch (error) {
// //         console.error("Error fetching jobs:", error);
// //       }
// //     };

// //     const fetchSkills = async () => {
// //       try {
// //         const response = await getSkills();
// //         setSkills(response.data.map((skill:any) => ({ value: skill.id, label: skill.name })));
// //       } catch (error) {
// //         console.error("Error fetching skills:", error);
// //       }
// //     };

// //     fetchJobs();
// //     fetchSkills();
// //   }, []);

// //   const handleChange = (e: any) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleSelectChange = (type: string, selectedOptions: any) => {
// //     setFormData({ ...formData, [type]: selectedOptions });
// //   };

// //   const handleSubmit = async (e: any) => {
// //     e.preventDefault();

// //     const jobData = {
// //       title: formData.title,
// //       description: formData.description,
// //       minExperience: formData.min_experience,
// //       status: formData.status,
// //       closureReason: formData.closure_reason,
// //       jobSkills: [
// //         ...formData.required_skills.map((skill: any) => ({ skillId: skill.value, type: 'required' })),
// //         ...formData.preferred_skills.map((skill: any) => ({ skillId: skill.value, type: 'preferred' }))
// //       ]
// //     };

// //     try {
// //       const response = await createJob(jobData);
// //       console.log("Job Created:", response.data);
// //       setIsOpen(false);
// //       // Optionally, you can update the jobs state to include the newly created job
// //       setJobs([response.data, ...jobs]);
// //     } catch (error) {
// //       console.error("Error creating job:", error);
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="flex justify-between items-center mb-4">
// //         <div></div> {/* Empty div for spacing */}
// //         <button
// //           className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
// //           onClick={() => setIsOpen(true)}
// //         >
// //           Create Job
// //         </button>
// //       </div>

// //       <div>JobManagement</div>
// //       <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
// //         <div className="max-w-full overflow-x-auto">
// //           <table className="w-full table-auto">
// //             <thead>
// //               <tr className="bg-gray-2 text-left dark:bg-meta-4">
// //                 <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
// //                   Package
// //                 </th>
// //                 <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
// //                   Invoice date
// //                 </th>
// //                 <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
// //                   Status
// //                 </th>
// //                 <th className="py-4 px-4 font-medium text-black dark:text-white">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {packageData.map((packageItem, key) => (
// //                 <tr key={key}>
// //                   <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
// //                     <h5 className="font-medium text-black dark:text-white">
// //                       {packageItem.name}
// //                     </h5>
// //                     <p className="text-sm">${packageItem.price}</p>
// //                   </td>
// //                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
// //                     <p className="text-black dark:text-white">
// //                       {packageItem.invoiceDate}
// //                     </p>
// //                   </td>
// //                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
// //                     <p
// //                       className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${packageItem.status === 'Paid'
// //                         ? 'bg-success text-success'
// //                         : packageItem.status === 'Unpaid'
// //                           ? 'bg-danger text-danger'
// //                           : 'bg-warning text-warning'
// //                         }`}
// //                     >
// //                       {packageItem.status}
// //                     </p>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {isOpen && (
// //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
// //           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
// //             <h2 className="text-xl font-semibold mb-4">Create Job</h2>
// //             <form onSubmit={handleSubmit}>
// //               <div className="mb-4">
// //                 <label className="block mb-2">Title</label>
// //                 <input
// //                   type="text"
// //                   name="title"
// //                   value={formData.title}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                   required
// //                 />
// //               </div>

// //               <div className="mb-4">
// //                 <label className="block mb-2">Description</label>
// //                 <textarea
// //                   name="description"
// //                   value={formData.description}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                   required
// //                 ></textarea>
// //               </div>

// //               <div className="mb-4">
// //                 <label className="block mb-2">Minimum Experience</label>
// //                 <input
// //                   type="number"
// //                   name="min_experience"
// //                   value={formData.min_experience}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                   required
// //                 />
// //               </div>

// //               <div className="mb-4">
// //                 <label className="block mb-2">Status</label>
// //                 <select
// //                   name="status"
// //                   value={formData.status}
// //                   onChange={handleChange}
// //                   className="w-full px-3 py-2 border rounded-md"
// //                 >
// //                   <option value="open">Open</option>
// //                   <option value="on_hold">On Hold</option>
// //                   <option value="closed">Closed</option>
// //                 </select>
// //               </div>

// //               {formData.status === "closed" && (
// //                 <>
// //                   <div className="mb-4">
// //                     <label className="block mb-2">Closure Reason</label>
// //                     <textarea
// //                       name="closure_reason"
// //                       value={formData.closure_reason}
// //                       onChange={handleChange}
// //                       className="w-full px-3 py-2 border rounded-md"
// //                       required
// //                     ></textarea>
// //                   </div>

// //                   <div className="mb-4">
// //                     <label className="block mb-2">Closed Candidate ID</label>
// //                     <input
// //                       type="number"
// //                       name="closed_candidate_id"
// //                       value={formData.closed_candidate_id}
// //                       onChange={handleChange}
// //                       className="w-full px-3 py-2 border rounded-md"
// //                       required
// //                     />
// //                   </div>
// //                 </>
// //               )}

// //               <div className="mb-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowSkills(!showSkills)}
// //                   className="w-full px-3 py-2 border rounded-md text-left"
// //                 >
// //                   {showSkills ? "Hide Skills" : "Add Skills"}
// //                 </button>
// //                 {showSkills && (
// //                   <div className="mt-2">
// //                     <div className="mb-4">
// //                       <label className="block mb-2">Required Skills</label>
// //                       <Select
// //                         isMulti
// //                         options={skills}
// //                         value={formData.required_skills}
// //                         onChange={(selectedOptions) => handleSelectChange('required_skills', selectedOptions)}
// //                         className="basic-multi-select"
// //                         classNamePrefix="select"
// //                       />
// //                     </div>

// //                     <div className="mb-4">
// //                       <label className="block mb-2">Preferred Skills</label>
// //                       <Select
// //                         isMulti
// //                         options={skills}
// //                         value={formData.preferred_skills}
// //                         onChange={(selectedOptions) => handleSelectChange('preferred_skills', selectedOptions)}
// //                         className="basic-multi-select"
// //                         classNamePrefix="select"
// //                       />
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex justify-end space-x-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsOpen(false)}
// //                   className="px-4 py-2 bg-gray-300 rounded-lg"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
// //                 >
// //                   Submit
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default JobManagement;








// //---------------------------------------------------------------------------------------------------------------------------------




// import { useState } from "react";
// import Select from 'react-select';

// const packageData: any[] = [
//   {
//     name: 'Free package',
//     price: 0.0,
//     invoiceDate: `Jan 13,2023`,
//     status: 'Paid',
//   },
//   {
//     name: 'Standard Package',
//     price: 59.0,
//     invoiceDate: `Jan 13,2023`,
//     status: 'Paid',
//   },
//   {
//     name: 'Business Package',
//     price: 99.0,
//     invoiceDate: `Jan 13,2023`,
//     status: 'Unpaid',
//   },
//   {
//     name: 'Standard Package',
//     price: 59.0,
//     invoiceDate: `Jan 13,2023`,
//     status: 'Pending',
//   },
// ];

// const skills = [
//   { value: 1, label: 'JavaScript' },
//   { value: 2, label: 'Python' },
//   { value: 3, label: 'React' },
//   { value: 4, label: 'Node.js' },
//   { value: 5, label: 'SQL' },
//   // Add more skills as needed
// ];

// const JobManagement = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showSkills, setShowSkills] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     min_experience: "",
//     status: "open",
//     closure_reason: "",
//     closed_candidate_id: "",
//     required_skills: [],
//     preferred_skills: []
//   });

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSelectChange = (type: string, selectedOptions: any) => {
//     setFormData({ ...formData, [type]: selectedOptions });
//   };

//   const handleSubmit = (e: any) => {
//     e.preventDefault();
//     console.log("Job Created:", formData);
//     setIsOpen(false);
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center mb-4">
//         <div></div> {/* Empty div for spacing */}
//         <button
//           className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
//           onClick={() => setIsOpen(true)}
//         >
//           Create Job
//         </button>
//       </div>

//       <div>JobManagement</div>
//       <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//         <div className="max-w-full overflow-x-auto">
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gray-2 text-left dark:bg-meta-4">
//                 <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                   Package
//                 </th>
//                 <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
//                   Invoice date
//                 </th>
//                 <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
//                   Status
//                 </th>
//                 <th className="py-4 px-4 font-medium text-black dark:text-white">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {packageData.map((packageItem, key) => (
//                 <tr key={key}>
//                   <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
//                     <h5 className="font-medium text-black dark:text-white">
//                       {packageItem.name}
//                     </h5>
//                     <p className="text-sm">${packageItem.price}</p>
//                   </td>
//                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                     <p className="text-black dark:text-white">
//                       {packageItem.invoiceDate}
//                     </p>
//                   </td>
//                   <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
//                     <p
//                       className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${packageItem.status === 'Paid'
//                         ? 'bg-success text-success'
//                         : packageItem.status === 'Unpaid'
//                           ? 'bg-danger text-danger'
//                           : 'bg-warning text-warning'
//                         }`}
//                     >
//                       {packageItem.status}
//                     </p>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">Create Job</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="mb-4">
//                 <label className="block mb-2">Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2">Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   required
//                 ></textarea>
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2">Minimum Experience</label>
//                 <input
//                   type="number"
//                   name="min_experience"
//                   value={formData.min_experience}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   required
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                 >
//                   <option value="open">Open</option>
//                   <option value="on_hold">On Hold</option>
//                   <option value="closed">Closed</option>
//                 </select>
//               </div>

//               {formData.status === "closed" && (
//                 <>
//                   <div className="mb-4">
//                     <label className="block mb-2">Closure Reason</label>
//                     <textarea
//                       name="closure_reason"
//                       value={formData.closure_reason}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-md"
//                       required
//                     ></textarea>
//                   </div>

//                   <div className="mb-4">
//                     <label className="block mb-2">Closed Candidate ID</label>
//                     <input
//                       type="number"
//                       name="closed_candidate_id"
//                       value={formData.closed_candidate_id}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border rounded-md"
//                       required
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="mb-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowSkills(!showSkills)}
//                   className="w-full px-3 py-2 border rounded-md text-left"
//                 >
//                   {showSkills ? "Hide Skills" : "Add Skills"}
//                 </button>
//                 {showSkills && (
//                   <div className="mt-2">
//                     <div className="mb-4">
//                       <label className="block mb-2">Required Skills</label>
//                       <Select
//                         isMulti
//                         options={skills}
//                         value={formData.required_skills}
//                         onChange={(selectedOptions) => handleSelectChange('required_skills', selectedOptions)}
//                         className="basic-multi-select"
//                         classNamePrefix="select"
//                       />
//                     </div>

//                     <div className="mb-4">
//                       <label className="block mb-2">Preferred Skills</label>
//                       <Select
//                         isMulti
//                         options={skills}
//                         value={formData.preferred_skills}
//                         onChange={(selectedOptions) => handleSelectChange('preferred_skills', selectedOptions)}
//                         className="basic-multi-select"
//                         classNamePrefix="select"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsOpen(false)}
//                   className="px-4 py-2 bg-gray-300 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default JobManagement;

