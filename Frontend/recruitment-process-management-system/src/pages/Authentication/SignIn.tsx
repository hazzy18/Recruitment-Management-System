

// //----------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import LogoDark from '../../images/logo/logo-dark.svg';
// import Logo from '../../images/logo/logo.svg';
// import axios from 'axios';
// import { isRoleAllowed } from '../../auth';

// const SignIn: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await api.post("http://localhost:5283/api/login", {
//         email,
//         password,
//       });

//       // Extract JWT Token
//       const token = response.data.token;
//       const role = response.data.role; // Assuming API sends role directly

//       if (token  && role) {
//         localStorage.setItem("token", token); // Store the token
//         localStorage.setItem("role", role); // Store role in local storage

//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Set default header
//         switch (role) {
//           case "HR":
//             navigate("/documentverification");
//             break;
//           case "Reviewer":
//             navigate("/reviewerpage");
//             break;
//           case "Recruiter":
//             navigate("/job");
//             break;
//           case "Admin":
//             navigate("/");
//             break;
//           case "Interviewer":
//             navigate("/round1Container");
//             break;
//           case "Candidate":
//             navigate("/job");
//             break;
//           default:
//             navigate("/"); // Default fallback
//         }
//       } else {
//         setError("Invalid response from server.");
//       }
//     } catch (err) {
//       setError("Invalid email or password.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="mb-4">
//         <label className="mb-2.5 block font-medium text-black dark:text-white">
//           Email
//         </label>
//         <div className="relative">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="mb-6">
//         <label className="mb-2.5 block font-medium text-black dark:text-white">
//           Password
//         </label>
//         <div className="relative">
//           <input
//             type="password"
//             placeholder="6+ Characters, 1 Capital letter"
//             className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//       </div>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <div className="mb-5">
//         <input
//           type="submit"
//           value="Sign In"
//           className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
//         />
//       </div>
//     </form>
//   );
// };

// export default SignIn;

//--------------------------------------------------------------------------------------------------------------------------




//----------------------------------------------------------------------------------

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';
import { isRoleAllowed } from '../../auth';
import api from '../../axiosInstance';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("http://localhost:5283/api/login", {
        email,
        password,
      });

      // Extract JWT Token
      const token = response.data.token;
      const role = response.data.role; // Assuming API sends role directly

      if (token  && role) {
        localStorage.setItem("token", token); // Store the token
        localStorage.setItem("role", role); // Store role in local storage

        switch (role) {
          case "HR":
            navigate("/documentverification");
            break;
          case "Reviewer":
            navigate("/reviewerpage");
            break;
          case "Recruiter":
            navigate("/job");
            break;
          case "Admin":
            navigate("/");
            break;
          case "Interviewer":
            navigate("/round1Container");
            break;
          case "Candidate":
            navigate("/job");
            break;
          default:
            navigate("/"); // Default fallback
        }
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}


    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            placeholder="6+ Characters, 1 Capital letter"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-5">
        <input
          type="submit"
          value="Sign In"
          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
        />
      </div>
    </form>
    </div>
    </div>
  );
};

export default SignIn;
