import React from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from '@radix-ui/react-label';
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from 'react-hook-form';
import useFetch from '@/hooks/use-fetch';
import { applyToJob } from '@/api/apiApplications';
import { BarLoader } from 'react-spinners';
import toast from 'react-hot-toast';

const schema = z.object({
    experience: z.number().min(0, { message: "Experience must be at least 0" }).int(),
    skills: z.string().min(1, { message: "Skills are required" }),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], { message: "Education is required" }),
    resume: z  
    .any()  
    .refine(    
        (fileList) =>      
            fileList.length > 0 &&      
        (fileList[0].type === "application/pdf" ||        
            fileList[0].type === "application/msword" ||         
            fileList[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),    
            { message: "Only PDF or Word documents are allowed" }  
        )
  });
  
  
const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
      } = useForm({
        resolver: zodResolver(schema),
      });
    
      const {
        loading: loadingApply,
        error: errorApply,
        fn: fnApply,
      } = useFetch(applyToJob);
    
      const onSubmit = (data) => {
        fnApply({
          ...data,
          job_id: job.id,
          candidate_id: user.id,
          name: user.fullName,
          status: "applied",
          resume: data.resume[0],
        }).then(() => {
          fetchJob();
          reset();
          toast.success('Successfully Applied');
        });
      };

  return (
    <Drawer open={applied ? false : undefined} className='w-1/2 flex flex-col items-center'>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied} // Fixed disabled logic
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Apply for {job?.title} at {job?.company?.name}</DrawerTitle>
          <DrawerDescription>Please fill the form below.</DrawerDescription>
        </DrawerHeader>
        <form className='flex flex-col gap-4 p-4 pb-0' onSubmit={handleSubmit(onSubmit)}>
          <Input type="number" placeholder='Years of Experience (Ex: 2.6 for 2 Years and 6 Months)' name='experience' className='flex-1' {...register("experience", {
              valueAsNumber: true,
            })} />
            {errors.experience && (
              toast.error(errors.experience.message)
          )}
          <Input type="text" placeholder='Skills (Comma Separated) (Ex: nodejs, react, tailwind)' name='skills' className='flex-1' {...register("skills")} />
          {errors.skills && (
            toast.error(errors.skills.message)
          )}
          <Controller
          name='education'
          control={control}
          render={({field})=>(

          <RadioGroup name="qualification" onValueChange={field.onChange} {...field}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Graduate" id="graduate" />
              <Label htmlFor="graduate">Graduate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Post Graduate" id="post-graduate" />
              <Label htmlFor="post-graduate">Post Graduate</Label>
            </div>
          </RadioGroup>
          )}
          />
           {errors.education && (
            toast.error(errors.education.message)
            
          )}
          <Input
            type="file"
            name="resume"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
            />

          {errors.resume && (
            toast.error(errors.resume.message)
          )}
          {errorApply?.message && (
            toast.error(errorApply?.message)
          )}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}
          
          <Button type='submit' variant='blue' size='lg'>Apply</Button>
        </form>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ApplyJobDrawer;
