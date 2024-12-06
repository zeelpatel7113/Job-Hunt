import { getSingleJob, updateCheckStatus, updateHiringStatus } from '@/api/apiJobs';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import MDEditor from '@uiw/react-md-editor';
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent,  SelectItem } from '@/components/ui/select';
import { useParams, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import ApplyJobDrawer from '@/components/apply-job';
import ApplicationCard from '@/components/application-card';
import toast from 'react-hot-toast';

const JobPage = () => {
  
  const {isLoaded, user} = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  


  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const { loading: loadingCheckStatus, fn: fnCheckStatus } = useFetch(
    updateCheckStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
    toast.success('Successfully Status Changed')
  };

  const handleCheckChange = (value) => {
    const check = value === "true";
    fnCheckStatus(check).then(() => {
      fnJob(); // Refresh the job data
      navigate('/admin-dashboard'); // Redirect to /admin-dashboard
    toast.success('Successfully Status Changed')
    });
  };
  

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (


    <div className='flex flex-col gap-8 mt-5'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.title}</h1>
        <img src={job?.company?.logo_url} className='h-12' alt={job?.title}/>
      </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <MapPinIcon/>
            {job?.location}
          </div>
          <div className='flex gap-2'>
            <Briefcase/> {job?.applications?.length} Applicants
          </div>
          <div className='flex gap-2'>
            {job?.isOpen?<><DoorOpen/>Open</>:<><DoorClosed/>Closed</>}
          </div>
        </div>
        {/* hiring Status */}
        {job?.recruiter_id === user?.id && (
           <Select onValueChange={handleStatusChange}>
           <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
             <SelectValue placeholder={
              "Hiring Status " + (job?.isOpen ? "( Open )":"( Closed )")
             } />
           </SelectTrigger>
           <SelectContent>  
                   <SelectItem value={"open"}>Open</SelectItem>
                   <SelectItem value={"closed"}>Closed</SelectItem>
           </SelectContent>
         </Select>
        )}


        <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}  
        className="bg-transparent sm:text-lg" // add global ul styles - tutorial
      />

      {user?.unsafeMetadata?.role === 'candidate' && (
      <ApplyJobDrawer job={job} user={user} fetchJob={fnJob} applied={job?.applications?.find((ap)=>ap.candidate_id === user.id)}/>
      )}

{loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.applications?.length > 0 && user?.unsafeMetadata?.role === 'recruiter' && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
      {loadingCheckStatus && <BarLoader width={"100%"} color="#36d7b7" />}


      {user?.unsafeMetadata?.role === 'admin' && (
   <Select onValueChange={handleCheckChange}>
     <SelectTrigger className={`w-full ${job?.check === true ? "bg-green-950" : job?.check === false ? "bg-red-950" : "bg-yellow-950"}`}>
     <SelectValue placeholder={
    "Checking - " + (job?.check === true ? "( Accepted )" : job?.check === false ? "( Rejected )" : "( Pending )")
  } />
     </SelectTrigger>
     <SelectContent>
       <SelectItem value={"true"}>Accepted</SelectItem>
       <SelectItem value={"false"}>Rejected</SelectItem>
     </SelectContent>
   </Select>
)}
    </div>
  );
};

export default JobPage;