import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import SubmitPaper from "./pages/author/SubmitPaper";
import MyPapers from "./pages/author/MyPapers";
import UploadRevision from "./pages/author/UploadRevision";

import AssignedPapers from "./pages/reviewer/AssignedPapers";

import Submissions from "./pages/organizer/Submissions";
import Conferences from "./pages/organizer/Conferences.jsx";
import ReviewerPool from "./pages/organizer/ReviewerPool.jsx";
import PaperDetails from "./pages/organizer/PaperDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="author/submit"
            element={
              <ProtectedRoute roles={["AUTHOR"]}>
                <SubmitPaper />
              </ProtectedRoute>
            }
          />
          <Route
            path="author/papers"
            element={
              <ProtectedRoute roles={["AUTHOR"]}>
                <MyPapers />
              </ProtectedRoute>
            }
          />
          <Route
            path="author/revision/:id"
            element={
              <ProtectedRoute roles={["AUTHOR"]}>
                <UploadRevision />
              </ProtectedRoute>
            }
          />

          <Route
            path="reviewer/assigned"
            element={
              <ProtectedRoute roles={["REVIEWER"]}>
                <AssignedPapers />
              </ProtectedRoute>
            }
          />

          <Route
            path="organizer/conferences"
            element={
              <ProtectedRoute roles={["ORGANIZER"]}>
                <Conferences />
              </ProtectedRoute>
            }
          />

          <Route
            path="organizer/conferences/:id/reviewers"
            element={
              <ProtectedRoute roles={["ORGANIZER"]}>
                <ReviewerPool />
              </ProtectedRoute>
            }
          />

          <Route
            path="organizer/submissions"
            element={
              <ProtectedRoute roles={["ORGANIZER"]}>
                <Submissions />
              </ProtectedRoute>
            }
          />

          <Route
            path="organizer/submissions/:id"
            element={
              <ProtectedRoute roles={["ORGANIZER"]}>
                <PaperDetails />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
