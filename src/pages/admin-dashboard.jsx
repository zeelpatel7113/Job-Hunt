import { getApplicationslength } from '@/api/apiApplications';
import { getCompanies } from '@/api/apiCompanies';
import { adminJobs, getJobs } from '@/api/apiJobs';
import JobCard from '@/components/job-card';
import AdminCard from '@/components/ui/admin-card';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { BriefcaseIcon, Building2, FilePlus2, User, Users } from 'lucide-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const AdminDashboard = ({total}) => {

  const {isLoaded} = useUser();

  


  const { data: applications, fn: fnApplications } = useFetch(getApplicationslength);
  const { fn: fnJobs, data: jobs, loading: loadingJobs } = useFetch(adminJobs);
  const { fn: fnJobsCount, data: jobsCount } = useFetch(getJobs);
  const { fn: fnCompanyCount, data: CompanyCount } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      console.log("User is loaded, fetching jobs and applications...");
      fnApplications(); // Fetch applications count
      fnJobs(); // Fetch jobs
      fnJobsCount();
      fnCompanyCount();
    }
  }, [isLoaded]);

  // const chartData = jobsCount.created_at;

  console.log("Applications data:", applications);
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        DashBoard
      </h1>
      <div className='flex flex-wrap gap-3 items-center justify-center mb-6'>

      <AdminCard icon={<Users size={36}/>} title={applications} description='Total Applications' color='bg-indigo-950'/>
      <AdminCard icon={<BriefcaseIcon size={36}/>} title={jobsCount?.length} description='Total Available Jobs' color='bg-emerald-950'/>
      {/* <AdminCard icon={<FilePlus2 size={36}/>} title={maxJobId} description='Total Created Jobs'/> */}
      <AdminCard icon={<FilePlus2 size={36}/>} title={jobs?.length} description='Total Pending Jobs' color='bg-orange-950'/>
      <AdminCard icon={<Building2 size={36}/>} title={CompanyCount?.length} description='Total Companies' color='bg-gray-900'/>
      </div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Pending Jobs
      </h1>
      {loadingJobs && (
        <BarLoader className='mt-4' width={"100%"} color='#36d7b7'/>
        )}
      {loadingJobs === false && (
        <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {jobs?.length ?(
            jobs.map((job) => {
              return <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0}/>
            })
          ):(
            <div>No Jobs Found...</div>
          )}
        </div>          
      )}
    </div>
  )
}

export default AdminDashboard