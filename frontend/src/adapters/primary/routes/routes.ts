import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  // Candidate Routes
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/cv-upload",
    Component: CVUpload,
  },
  {
    path: "/jobs",
    Component: JobDiscovery,
  },
  {
    path: "/jobs/:id",
    Component: JobDetail,
  },
  {
    path: "/applications",
    Component: Applications,
  },
  {
    path: "/messages",
    Component: Messages,
  },
  {
    path: "/notifications",
    Component: Notifications,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  // Recruiter Routes
  {
    path: "/recruiter/dashboard",
    Component: RecruiterDashboard,
  },
  {
    path: "/recruiter/post-job",
    Component: PostJob,
  },
  {
    path: "/recruiter/jobs",
    Component: ManageJobs,
  },
  {
    path: "/recruiter/jobs/:jobId/pipeline",
    Component: CandidatePipeline,
  },
  {
    path: "/recruiter/candidates/:candidateId",
    Component: CandidateDetail,
  },
  {
    path: "/recruiter/candidates",
    Component: Candidates,
  },
  {
    path: "/recruiter/analytics",
    Component: Analytics,
  },
  {
    path: "/recruiter/settings",
    Component: RecruiterSettings,
  },
  // 404
  {
    path: "*",
    Component: NotFound,
  },
]);