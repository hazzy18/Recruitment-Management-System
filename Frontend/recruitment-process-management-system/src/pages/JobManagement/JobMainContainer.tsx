import { useState } from "react";
import { JobList } from "./JobList";
import JobForm from "./JobForm";
import JobViewForm from "./JobViewForm";
import { isRoleAllowed } from "../../auth";

export const JobMainContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [jobId, setJobId] = useState<number | null>(null);
    const[operation,setOperation]=useState<string | null>(null);

    const handleViewJob = (id: number,operation:string) => {
        setJobId(id);
        setIsOpen(true);
        setOperation(operation)
      };



    return (
        <>
            {/* {isRoleAllowed(["Interviewer","Reviewer","HR"]) && */}
            {isRoleAllowed(["Recruiter","Admin"]) &&( 

             <div className="flex justify-between items-center mb-4">
                <div></div> {/* Empty div for spacing */}
                <button
                    className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    onClick={() =>  {
                        setIsOpen(true)
                        setOperation("create")
                    }
                         
                    }
                >
                    Create Job
                </button>
            </div> 
            )}

            <JobList onViewJob={handleViewJob} isOpen={isOpen} />
            <JobForm jobId={jobId} isOpen={isOpen} setIsOpen={setIsOpen} operation={operation}/>
            
     </>
    )
}
