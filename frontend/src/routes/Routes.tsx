import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import BandRegister from '../views/auth/BandRegister';
import Presentation from '../views/Presentation';
import Videos from '../views/videos/Videos';
import Navbar from '../components/layout/Navbar';
import Photos from '../views/photos/Photos';
import Events from '../views/events/Events';
import Podcast from '../views/podcast/Podcast';
import AboutMe from '../views/about/AboutMe';
import MyVideos from '../views/my-content/MyVideos';
import MyEvents from '../views/my-content/MyEvents';
import MyProfile from '../views/profile/MyProfile';
import ResetPassword from '../views/auth/ResetPassword';
import ConfirmEmail from '../views/auth/ConfirmEmail';
import ChooseUserAvatar from '../views/profile/ChooseUserAvatar';
import { AuthProvider } from '../contexts/AuthContext';
import Request from '../views/admin/Request';
import MyPhotos from '../views/my-content/MyPhotos';
import PartnerStore from '../views/store/PartnerStore';
import IssueReport from '../views/support/IssueReport';
import NotFound from '../views/error/NotFound';
import Profile from '../views/profile/Profile';
import EventDetail from '../views/events/EventDetail';
import Feed from '../views/feed/Feed';
import PostDetail from '../views/feed/PostDetail';

const Routes = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bandRegister" element={<BandRegister />} />
          <Route path="/welcome" element={<Presentation />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/feed/:postId" element={<PostDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/podcasts" element={<Podcast />} />
          <Route path="/aboutMe" element={<AboutMe />} />
          <Route path="/myVideos" element={<MyVideos />} />
          <Route path="/myPhotos" element={<MyPhotos />} />
          <Route path="/myEvents" element={<MyEvents />} />
          <Route path="/myAccount" element={<MyProfile />} />
          <Route path="/profile/:nickname/:id" element={<Profile />} />
          <Route path="/security/resetPassword" element={<ResetPassword />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/newAvatar" element={<ChooseUserAvatar />} />
          <Route path="/acceptContent" element={<Request />} />
          <Route path="/partnerStore" element={<PartnerStore />} />
          <Route path="/issueReport" element={<IssueReport />} />
          <Route path="*" element={<NotFound />} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default Routes;
