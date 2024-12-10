// src/App.jsx
import React, { useEffect, useState } from 'react';
// import { Notifications } from 'react-push-notification';
// import axios from 'axios';
import AppLayout from './layouts/app-layout';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/landing';
import ProtectedRought from './components/protected-route';
import Onboarding from './pages/onboarding';
import JobListing from './pages/job-listing';
import JobPage from './pages/job';
import PostJob from './pages/post-job';
import SavedJobs from './pages/saved-jobs';
import MyJobs from './pages/my-jobs';
import { ThemeProvider } from './components/theme-provider';
import AdminDashboard from './pages/admin-dashboard';

const total = 0;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/onboarding",
        element: (
          <ProtectedRought>
            <Onboarding />
          </ProtectedRought>
        ),
      },
      {
        path: "/jobs",
        element: (
          <ProtectedRought>
            <JobListing />
          </ProtectedRought>
        ),
      },
      {
        path: "/job/:id",
        element: (
          <ProtectedRought>
            <JobPage />
          </ProtectedRought>
        ),
      },
      {
        path: "/post-job",
        element: (
          <ProtectedRought>
            <PostJob />
          </ProtectedRought>
        ),
      },
      {
        path: "/saved-job",
        element: (
          <ProtectedRought>
            <SavedJobs />
          </ProtectedRought>
        ),
      },
      {
        path: "/my-jobs",
        element: (
          <ProtectedRought>
            <MyJobs />
          </ProtectedRought>
        ),
      },
      {
        path: "/email",
        element: (
          <ProtectedRought>
            <MyJobs />
          </ProtectedRought>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRought>
            <AdminDashboard total={total} />
          </ProtectedRought>
        ),
      },
    ],
  },
]);

function App() {
  const [data, setData] = useState(null);

 

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <Notifications/> */}
      <RouterProvider router={router} />
      <div>
        {/* <h1>React and Node.js Integration</h1> */}
        <p>{data}</p>
      </div>
    </ThemeProvider>
  );
}

export default App;
