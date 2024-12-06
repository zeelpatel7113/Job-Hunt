import { getCompanies, getProfession } from '@/api/apiCompanies';

import { addNewJob } from '@/api/apiJobs';
// import { main } from '@/api/mailer';
import AddCompanyDrawer from '@/components/add-company-drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react';
import { zodResolver } from '@hookform/resolvers/zod';
// import { } from '@radix-ui/react-select';
import MDEditor from '@uiw/react-md-editor';
import { State } from 'country-state-city';
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import z from 'zod';
// import { data } from 'autoprefixer';




const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  Profession: z.string().min(1, { message: "Profession are required" }),
  
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "", Profession: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
    // total += 1;
    // notifunction(data);
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      // main(); // Ensure this is executed after navigating
      navigate("/my-jobs");
    toast.success('Successfully Job Created')
    

    }
  }, [loadingCreateJob, dataCreateJob]);
  

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  

  const {
    loading: loadingProfession,
    data: Profession,
    fn: fnProfession,
  } = useFetch(getProfession);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
      fnProfession();  // Fetch professions when isLoaded is true
    }
  }, [isLoaded]);

  useEffect(() => {
    if (Profession) {
      console.log("Professions fetched:", Profession);
    }
  }, [Profession]);

  if (!isLoaded || loadingCompanies || loadingProfession) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    
    <div>
    <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
      Post a Job
    </h1>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 pb-0"
    >
      <Input placeholder="Job Title" {...register("title")} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <Textarea placeholder="Job Description" {...register("description")} />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <div className="flex gap-4 items-center">
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Job Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("IN").map(({ name }) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        
        <Controller
        name="Profession"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Profession">
                {field.value
                  ? Profession?.find((pro) => pro.id === Number(field.value))
                      ?.name
                  : "Profession"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Profession?.map(({ name, id }) => (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <Controller
          name="company_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Company">
                  {field.value
                    ? companies?.find((com) => com.id === Number(field.value))
                        ?.name
                    : "Company"}
                </SelectValue>
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
          )}
        />
        <AddCompanyDrawer fetchCompanies={fnCompanies} />

      </div>
      {errors.location && (
        <p className="text-red-500">{errors.location.message}</p>
      )}
      {errors.company_id && (
        <p className="text-red-500">{errors.company_id.message}</p>
      )}

      <Controller
        name="requirements"
        control={control}
        render={({ field }) => (
          <MDEditor value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.requirements && (
        <p className="text-red-500">{errors.requirements.message}</p>
      )}
      {errors.errorCreateJob && (
        <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
      )}
      {errorCreateJob?.message && (
        <p className="text-red-500">{errorCreateJob?.message}</p>
      )}
      {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
      <Button type="submit" variant="blue" size="lg" className="mt-2">
        Submit
      </Button>
    </form>
  </div>
);
}

export default PostJob;