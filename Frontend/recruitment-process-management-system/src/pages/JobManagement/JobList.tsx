import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { isRoleAllowed } from "../../auth";


export const JobList = ({ onViewJob ,isOpen}: any) => {

const [jobs, setJobs] = useState<any[]>([]); // State to store jobs

useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("http://localhost:5283/api/job"); // Replace with your API URL
        console.log("Fetched Jobs:", response.data); // Log the response
        setJobs(response.data); // Update state with fetched jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [isOpen]);



    return (

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

            <div className="max-w-full overflow-x-auto">

                <table className="w-full table-auto">

                    <thead>

                        <tr className="bg-gray-2 text-left dark:bg-meta-4">


                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">

                                ID

                            </th>



                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">

                                Job Title

                            </th>

                            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">

                                 Minimum Experience

                            </th>

                            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">

                                Status

                            </th>

                            <th className="py-4 px-4 font-medium text-black dark:text-white">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            jobs.map((job, key) => (

                                <tr key={key}>


                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">

                                    <p className="text-black dark:text-white">

                                        {job.id}

                                    </p>

                                    </td>




                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">

                                        <h5 className="font-medium text-black dark:text-white">

                                            {job.title}

                                        </h5>

                                        {/* <p className="text-sm">${packageItem.price}</p> */}

                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">

                                        <p className="text-black dark:text-white">

                                            {job.minExperience}

                                        </p>

                                    </td>

                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">

                                        <p

                                            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${job.status === 'open'

                                                ? 'bg-success text-success'

                                                : job.status === 'on_hold'

                                                    ? 'bg-danger text-danger'

                                                    : 'bg-warning text-warning'

                                                }`}

                                        >

                                            {job.status}

                                        </p>

                                    </td>


                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button  onClick={() => {onViewJob(job.id,"view")
                    }}   className="hover:text-primary" >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {isRoleAllowed(["Recruiter","Admin"]) &&( 

                                            <button  onClick={()=> onViewJob(job.id,"edit")} className="hover:text-primary">
                                                <svg
                                                    className="fill-current"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M14.06 2.94a2.5 2.5 0 0 1 3.54 0l2.46 2.46a2.5 2.5 0 0 1 0 3.54L7.42 21.58a1 1 0 0 1-.5.27l-4.49 1a1 1 0 0 1-1.21-1.21l1-4.49a1 1 0 0 1 .27-.5L14.06 2.94ZM15.12 5.06L4 16.18v2.12h2.12L19.06 5.12l-3.94-3.94ZM21 7.12l-2.12-2.12 1.06-1.06a.5.5 0 0 1 .7 0l1.42 1.42a.5.5 0 0 1 0 .7L21 7.12Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                    )}

                  </div>
                </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    )
}
