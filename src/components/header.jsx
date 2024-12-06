import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import Logo from '/logopicsart.png';

// import { Button } from './ui/button';
import { SignedIn, SignedOut, SignIn, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from './ui/button';
import { BriefcaseBusiness, PenBox, Heart, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Header = () => {

  const [showSignIn, setShowSignIn] = useState(false);
  
  const [search, setSearch] = useSearchParams();
  useEffect(()=>{
    if(search.get('sign-in')){
      setShowSignIn(true);
    }
  },[search]);

  const handleOverlayClick=(e)=>{
    if(e.target === e.currentTarget){
      setShowSignIn(false);
      setSearch({});
    }
  };

  const {user} = useUser();
  return (
    <div>
        <nav className='py-4 flex justify-between items-center'>
            <Link><img src={Logo} className='h-16'></img></Link>
            
            <div className="flex gap-8">

            <SignedOut>
              <Button variant='outline' onClick={() => setShowSignIn(true)}>Log In</Button>
            </SignedOut>
            <SignedIn>
              {user?.unsafeMetadata?.role === "recruiter" && (

                <Link to="/post-job">
                  <Button variant='destructive' className='rounded-full'>
                    <PenBox size={20} className='mr-2'/>
                    Post a Job
                  </Button>
                </Link>
              )}
              {user?.unsafeMetadata?.role === "admin" && (

                <Link to="/admin-dashboard">
                  <Button variant='destructive' className='rounded-full'>
                    <LayoutDashboard size={20} className='mr-2'/>
                    Dashboard
                  </Button>
                </Link>
                )}
              <UserButton appearance={{
                elements:{
                  avatarBox:"w-11 h-11"
                }
              }}>
                <UserButton.MenuItems>
                  <UserButton.Link 
                    label='My Jobs'
                    labelIcon={<BriefcaseBusiness size={15}/>}
                    href='/my-jobs'
                  />
                  <UserButton.Link 
                    label='Saved Jobs'
                    labelIcon={<Heart size={15}/>}
                    href='/saved-job'
                  />
                </UserButton.MenuItems>

              </UserButton>
            </SignedIn>
            </div>
            
        </nav>
        {showSignIn && <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20' 
        onClick={handleOverlayClick}>
          <SignIn
          signUpForceRedirectUrl='/onboarding'
          fallbackRedirectUrl='/onboarding'/>
          </div>}
    </div>
  )
}

export default Header;