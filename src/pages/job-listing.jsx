import { getCompanies, getProfession } from '@/api/apiCompanies';
import { getJobs } from '@/api/apiJobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import JobCard from '@/components/job-card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { State } from 'country-state-city';
import React, { useEffect, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { Navigate } from 'react-router-dom'; // Added this import for navigation

const JobListing = () => {
    const { user, isLoaded } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState(""); // Corrected typo here
    const [company_id, setCompany_id] = useState("");
    const [selectedProfession, setSelectedProfession] = useState("");
    const [timeRange, setTimeRange] = useState("");

    const { fn: fnJobs, data: jobs, loading: loadingJobs } = useFetch(getJobs, {
        location, 
        company_id, 
        searchQuery, 
        Profession: selectedProfession,
        last5Days: timeRange,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const query = formData.get("search-query");
        if (query) setSearchQuery(query);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setCompany_id("");
        setSelectedProfession("");
        setLocation(""); 
        setTimeRange("");
    };

    const { data: companies, fn: fnCompanies } = useFetch(getCompanies);
    const { data: professions, fn: fnProfession } = useFetch(getProfession); 

    useEffect(() => {
        if (isLoaded) fnJobs();
    }, [isLoaded, location, company_id, searchQuery, selectedProfession, timeRange]); // Add timeRange here
    

    useEffect(() => {
        fnCompanies(); // No need for isLoaded check here
        fnProfession(); // No need for isLoaded check here
    }, []);

    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    if (!user || user.unsafeMetadata?.role == "recruiter") {
        return <Navigate to="/my-jobs" />;
    }

    return (
        <div>
            <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
                Latest Jobs
            </h1>

            <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'>
                <Input type='text' placeholder='Search Jobs by title...' name='search-query' className='h-full flex-1 px-4 text-md'/>
                <Button type="submit" className='h-full sm:w-28' variant='blue'>
                    Search
                </Button>
            </form>

            <div className='flex flex-col sm:flex-row gap-2'>
                <Select value={location} onValueChange={(value) => setLocation(value)}> {/* Corrected typo */}
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {State.getStatesOfCountry("IN")?.map(({ name }) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Company" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {companies?.map(({ name, id }) => (
                                <SelectItem key={name} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={selectedProfession} onValueChange={(value) => setSelectedProfession(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Profession" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {professions?.map(({name, id}) => (
                                <SelectItem key={name} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="1">Today</SelectItem>
                            <SelectItem value="7">This Week</SelectItem>
                            <SelectItem value="30">This Month</SelectItem>
                            <SelectItem value="365">This Year</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>


                <Button onClick={clearFilters} variant='destructive' className='sm:w-1/2'>
                    Clear Filters
                </Button>
            </div>

            {loadingJobs && <BarLoader className='mt-4' width={"100%"} color='#36d7b7' />}

            {!loadingJobs && (
                <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {jobs?.length ? (
                        jobs.map((job) => (
                            <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
                        ))
                    ) : (
                        <div>No Jobs Found...</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobListing;
