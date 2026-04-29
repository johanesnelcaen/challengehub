// src/App.tsx — remplace l'existant
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Pages ChallengeHub
import Dashboard      from "./pages/Dashboard/Home";
import Challenges     from "./pages/Challenges/Challenges";
import ChallengeDetail from "./pages/Challenges/ChallengeDetail";
import CreerChallenge from "./pages/Challenges/CreerChallenge";
import MesChallenges  from "./pages/Challenges/MesChallenges";
import MesParticipations from "./pages/Participations/MesParticipations";
import EspaceJury     from "./pages/Jury/EspaceJury";
import Notifications  from "./pages/Notifications/Notifications";
import Wallet         from "./pages/Wallet/Wallet";
import UserProfile    from "./pages/UserProfiles";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Auth (public) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Layout protégé */}
          <Route element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index path="/"                    element={<Dashboard />} />
            <Route path="/challenges"                element={<Challenges />} />
            <Route path="/challenges/creer"          element={<CreerChallenge />} />
            <Route path="/challenges/:id"            element={<ChallengeDetail />} />
            <Route path="/mes-challenges"            element={<MesChallenges />} />
            <Route path="/participations"            element={<MesParticipations />} />
            <Route path="/jury"                      element={<EspaceJury />} />
            <Route path="/notifications"             element={<Notifications />} />
            <Route path="/wallet"                    element={<Wallet />} />
            <Route path="/profile"                   element={<UserProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
