import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Tables from './pages/Tables';
import Settings from './pages/Settings';
import Chart from './pages/Chart';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import { JobMainContainer } from './pages/JobManagement/JobMainContainer';
import { ImportCandidateMainContainer } from './pages/ImportCandidate/ImportCandidateMainContainer';
import ScreeningMainContainer from './pages/Dashboard/ScreeningMainContainer';
import ReviewerMainContainer from './pages/Dashboard/ReviewerMainContainer';
import ShorlistedMainContainer from './pages/InterviewDashboard/ShorlistedMainContainer';
import RejectedPage from './pages/Dashboard/RejectedPage';
import Round1 from './pages/InterviewDashboard/Round1';
import Round2 from './pages/InterviewDashboard/Round2';
import FinalRound from './pages/InterviewDashboard/FinalRound';
import SelectedCandidates from './pages/Selection/SelectedCandidates';
import DocumentVerification from './pages/Hr dashboard/DocumentVerification';
import ReleaseOfferLetter from './pages/Hr dashboard/ReleaseOfferLetter';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


  const AppRoutes = () => {
    const location = useLocation();
    const authRoutes = ["/auth/signin", "/auth/signup"];

    const isAuthRoute = authRoutes.includes(location.pathname);





 



    return (
      <div>
        {isAuthRoute ? (
          <Routes>
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
          </Routes>
        ) : (
          <DefaultLayout>
            <Routes>
            <Route element={<ProtectedRoute />}>

              <Route index element={<ECommerce />} />
              <Route path="/screeningpage" element={<ScreeningMainContainer />} />
              <Route path="/reviewerpage" element={<ReviewerMainContainer />} />
              <Route path="/rejectedpage" element={<RejectedPage />} />

              <Route path="/schedule-interview" element={<ShorlistedMainContainer />} />
              <Route path="/round1Container" element={<Round1 />} />
              <Route path="/round2Container" element={<Round2 />} />
              <Route path="/finalRoundContainer" element={<FinalRound />} />

              <Route path="/selected" element={<SelectedCandidates />} />
              <Route path="/documentverification" element={<DocumentVerification />} />
              <Route path="/releaseofferletter" element={<ReleaseOfferLetter/>} />


              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/job" element={<JobMainContainer />} />
              <Route path="/candidate" element={<ImportCandidateMainContainer />} />

              <Route path="forms/form-elements" element={<FormElements />} />
              <Route path="forms/form-layout" element={<FormLayout />} />
              <Route path="tables" element={<Tables />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chart" element={<Chart />} />
              <Route path="ui/alerts" element={<Alerts />} />
              <Route path="ui/buttons" element={<Buttons />} />
              </Route>
            </Routes>
          </DefaultLayout>
        )}
      </div>
    );
  };

  return loading ? (
    <Loader />
  ) : (

    <AppRoutes />

  );
}

export default App;
