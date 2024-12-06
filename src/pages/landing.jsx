import React from 'react';
import Logo from '/logopicsart.png';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import Companies from '../data/companies.json';
import faqs from '../data/faq.json';
import Autoplay from "embla-carousel-autoplay";
import video from "/b7e94ef4.mp4";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/clerk-react';


const LandingPage = () => {
  const {user} = useUser();
  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20'>
      <section className='text-center'>
        <h1 className='flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4'>
        Discover Your Dream Jobs{" "} <span className='flex '>With Our{" "}
            <img src={Logo} alt='JobHunt Logo' className='h-10 sm:h-20 lg:h-32 rotate-12 ml-4 -mt-3 -z-0'></img>
            </span></h1>
        <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
          Explore thousend of job listings or find the perfect candidate
        </p>
      </section>
      {user?.unsafeMetadata?.role !== "admin" && (
      <div className='flex flex-wrap items-center gap-6 justify-center'>
        
        {user?.unsafeMetadata?.role !== "recruiter" && (
          <Link to="/jobs">
            <Button variant="blue" size="xl">Find Jobs</Button>
          </Link>
        )}
        {user?.unsafeMetadata?.role !== "candidate" && (
          <Link to="/post-job">
            <Button variant="destructive" size="xl">Post Jobs</Button>
          </Link>
        )}
        
      </div>
      )}
    
      {/* {user?.unsafeMetadata?.role === null && (
        <Link to="/post-job">
          <Button variant="destructive" size="xl">Post Jobs</Button>
        </Link>
      )} */}
      <Carousel 
      plugins = {[Autoplay({ delay: 2000})]} 
      className="w-full py-10"
      >
      <CarouselContent className="flex gap-5 sm:gap-20 items-center">
        {Companies.map(({name,id,path})=>{
          return(
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
              <img src={path} alt={name} className='h-9 sm:h-14 object-contain'/>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
        <video src={video} autoPlay loop muted className='w-full h-full object-cover rounded-3xl' />

    <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    <Card>
      <CardHeader>
        <CardTitle>For Job Seekers</CardTitle>
      </CardHeader>
      <CardContent>
        Search and apply for jobs, track applications, and more.
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>For Employers</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Post jobs, manage applications, and find the best candidates.</p>
        
      </CardContent>
    </Card>

    </section>
    <Accordion type="single" collapsible>
      {faqs.map((faq, index) => {
        return(

          <AccordionItem key={index} value={`item-${index + 1}`}>
        <AccordionTrigger>{faq.question}</AccordionTrigger>
        <AccordionContent>
        {faq.answer}
        </AccordionContent>
      </AccordionItem>
        );
      })}
    </Accordion>


    </main>
  );
};

export default LandingPage;