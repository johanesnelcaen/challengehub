import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// ── Pages ChallengeHub ──────────────────────────────────────────────────────
import Dashboard from "./pages/Dashboard/Home";
import Challenges from "./pages/Challenges/Challenges";
import ChallengeDetail from "./pages/Challenges/ChallengeDetail";
import CreerChallenge from "./pages/Challenges/CreerChallenge";
import MesParticipations from "./pages/Participations/MesParticipations";
import MesChallenges from "./pages/Challenges/MesChallenges";
import EspaceJury from "./pages/Jury/EspaceJury";
import Notifications from "./pages/Notifications/Notifications";
import Wallet from "./pages/Wallet/Wallet";
import UserProfile from "./pages/UserProfiles";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ── Layout principal ── */}
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route index path="/" element={<Dashboard />} />

          {/* Challenges */}
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/challenges/:id" element={<ChallengeDetail />} />
          <Route path="/challenges/creer" element={<CreerChallenge />} />
          <Route path="/mes-challenges" element={<MesChallenges />} />

          {/* Participations */}
          <Route path="/participations" element={<MesParticipations />} />

          {/* Jury */}
          <Route path="/jury" element={<EspaceJury />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Wallet */}
          <Route path="/wallet" element={<Wallet />} />

          {/* Profil */}
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* ── Auth ── */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}