import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { EditProfile } from '../routes/edit-profile';
import { ForgotPassword } from '../routes/forgot-password';
import { JobList } from '../routes/job-list';
import { AboutUs } from '../routes/about-us';
import { Message } from '../routes/message';
import { JobDetail as JobProviderJobDetail } from '../routes/_job-provider/job-detail';
import { PostedJobList } from '../routes/_job-provider/posted-job-list';
import { PostJob as JobProviderPostJob } from '../routes/_job-provider/post-job';
import { JobDetail as JobSeekerJobDetail } from '../routes/_job-seeker/job-detail';
import { JobPreference as JobSeekerJobPreference } from '../routes/_job-seeker/job-preference';
import { AppliedJobList as JobSeekerAppliedJobList } from '../routes/_job-seeker/applied-job-list';
import { Profile } from '../routes/profile';
import { SignIn } from '../routes/sign-in';
import { SignUp } from '../routes/sign-up';
import { Testimony } from '../routes/testimony';



/**
 * Komponen yang menangani routing dalam aplikasi berbasis React.
 * 
 * @returns {JSX.Element} Komponen React
 */
const Router = () => {
  const user = useSelector(state => state.user);



  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path='/job-list' element={<JobList />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/*' element={<Navigate to='/job-list' />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/job-list' element={<JobList />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/message/:message' element={<Message />} />
          <Route path='/testimony' element={<Testimony />} />

          {/* specific routes depending on user type */}
          {(user.role === 'jobSeeker') ? (
            <>
              <Route path='/job-detail/:id' element={<JobSeekerJobDetail />} />
              <Route path='/job-preference' element={<JobSeekerJobPreference />} />
              <Route path='/applied-job-list' element={<JobSeekerAppliedJobList />} />
            </>
          ) : (user.role === 'jobProvider') && (
            <>
              <Route path='/post-job' element={<JobProviderPostJob />} />
              <Route path='/posted-job-list' element={<PostedJobList />} />
              <Route path='/job-detail/:id' element={<JobProviderJobDetail />} />
            </>
          )}
          
          <Route path='/*' element={<Navigate to='/job-list' />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};



export { Router };

