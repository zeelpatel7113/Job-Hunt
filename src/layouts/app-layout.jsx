import Header from '@/components/header';
import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
        <div className='grid-background'></div>
        <main className='min-h-screen container'>
          <Header/>
        <Outlet/>
        </main>
        <div className="p-10 text-center mt-10">
          <hr className='h-1 bg-gray-900 rounded-full'></hr>
          <div className="flex justify-between mt-2">
            <p>&copy; JobHunt</p>
            <p>Made With JobHunt 🥂</p>
          </div>
          <div><Toaster
  position="bottom-right"
  reverseOrder={false}
/></div>
        </div>
    </div>
  );
};

export default AppLayout;