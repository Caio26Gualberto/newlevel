import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/loginAndRegister/Login';
import Register from '../views/loginAndRegister/Register';
import Apresentation from '../views/apresentation/Apresentation';
import Videos from '../views/videos/Videos';
import Navbar from '../components/layouts/Navbar';
import Photos from '../views/photos/Photos';
import Podcast from '../views/podcast/Podcast';
import AboutMe from '../views/aboutMe/AboutMe';
import MyVideos from '../views/myVideos/MyVideos';
import MyProfile from '../views/myProfile/MyProfile';
import ResetPassword from '../views/resetPassword/ResetPassword';
import ChooseUserAvatar from '../views/chooseUserAvatar/ChooseUserAvatar';
import { AuthProvider } from '../AuthContext';
import Request from '../views/requests/Request';
import MyPhotos from '../views/myPhotos/MyPhotos';
import PartnerStore from '../views/partnerStore/PartnerStore';
import { MobileProvider } from '../MobileContext';
import IssueReport from '../views/issueReport/IssueReport';
import BandRegister from '../views/loginAndRegister/BandRegister';
import NotFound from '../views/notFound/NotFound';
import Profile from '../views/profile/Profile';

const Rotas = () => {
  return (
    <AuthProvider>
      <MobileProvider>
        <Router>
          <Navbar />
          <Switch>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bandRegister" element={<BandRegister />} />
            <Route path="/welcome" element={<Apresentation />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/podcasts" element={<Podcast />} />
            <Route path="/aboutMe" element={<AboutMe />} />
            <Route path="/myVideos" element={<MyVideos />} />
            <Route path="/myPhotos" element={<MyPhotos />} />
            <Route path="/myAccount" element={<MyProfile />} />
            <Route path="/profile/:nickname/:id" element={<Profile />} />
            <Route path="/security/resetPassword" element={<ResetPassword />} />
            <Route path="/newAvatar" element={<ChooseUserAvatar />} />
            <Route path="/acceptContent" element={<Request />} />
            <Route path="/partnerStore" element={<PartnerStore />} />
            <Route path="/issueReport" element={<IssueReport />} />
            <Route path="*" element={<NotFound />} />
          </Switch>
        </Router>
      </MobileProvider>
    </AuthProvider>
  )
}

export default Rotas;
