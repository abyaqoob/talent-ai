import { createBrowserRouter } from "react-router";
import { createElement } from "react";
import Landing from "../ui/pages/Landing";
import Login from "../ui/pages/Login";
import Register from "../ui/pages/Register";
import Dashboard from "../ui/pages/Dashboard";
import JobDiscovery from "../ui/pages/JobDiscovery";
import JobDetail from "../ui/pages/JobDetail";
import Applications from "../ui/pages/Applications";
import CVUpload from "../ui/pages/CVUpload";
import Messages from "../ui/pages/Messages";
import Notifications from "../ui/pages/Notifications";
import Settings from "../ui/pages/Settings";
import Profile from "../ui/pages/Profile";
import RecruiterDashboard from "../ui/pages/recruiter/RecruiterDashboard";
import PostJob from "../ui/pages/recruiter/PostJob";
import ManageJobs from "../ui/pages/recruiter/ManageJobs";
import CandidatePipeline from "../ui/pages/recruiter/CandidatePipeline";
import CandidateDetail from "../ui/pages/recruiter/CandidateDetail";
import Candidates from "../ui/pages/recruiter/Candidates";
import Analytics from "../ui/pages/recruiter/Analytics";
import RecruiterSettings from "../ui/pages/recruiter/RecruiterSettings";
import NotFound from "../ui/pages/NotFound";
import { ProtectedRoute } from "../ui/components/ProtectedRoute";

const protect = (component: JSX.Element, role?: 'candidate' | 'recruiter') =>
  createElement(ProtectedRoute, { requiredRole: role }, component);

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  // Candidate Routes (protected)
  { path: "/dashboard", element: protect(createElement(Dashboard), 'candidate') },
  { path: "/profile", element: protect(createElement(Profile), 'candidate') },
  { path: "/cv-upload", element: protect(createElement(CVUpload), 'candidate') },
  { path: "/jobs", element: protect(createElement(JobDiscovery)) },
  { path: "/jobs/:id", element: protect(createElement(JobDetail)) },
  { path: "/dashboard/job/:id", element: protect(createElement(JobDetail)) },
  { path: "/applications", element: protect(createElement(Applications), 'candidate') },
  { path: "/messages", element: protect(createElement(Messages)) },
  { path: "/notifications", element: protect(createElement(Notifications)) },
  { path: "/settings", element: protect(createElement(Settings)) },
  // Recruiter Routes (protected)
  { path: "/recruiter/dashboard", element: protect(createElement(RecruiterDashboard), 'recruiter') },
  { path: "/recruiter/post-job", element: protect(createElement(PostJob), 'recruiter') },
  { path: "/recruiter/jobs", element: protect(createElement(ManageJobs), 'recruiter') },
  { path: "/recruiter/jobs/:jobId/pipeline", element: protect(createElement(CandidatePipeline), 'recruiter') },
  { path: "/recruiter/candidates/:candidateId", element: protect(createElement(CandidateDetail), 'recruiter') },
  { path: "/recruiter/candidates", element: protect(createElement(Candidates), 'recruiter') },
  { path: "/recruiter/analytics", element: protect(createElement(Analytics), 'recruiter') },
  { path: "/recruiter/settings", element: protect(createElement(RecruiterSettings), 'recruiter') },
  // 404
  { path: "*", Component: NotFound },
]);