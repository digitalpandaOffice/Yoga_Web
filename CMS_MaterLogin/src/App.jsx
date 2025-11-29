import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginCard from './components/LoginCard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import HomeContent from './pages/HomeContent';
import FileManager from './pages/FileManager';
import SyllabusContent from './pages/SyllabusContent';
import ResultsContent from './pages/ResultsContent';
import ResourcesContent from './pages/ResourcesContent';
import Admissions from './pages/Admissions';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginCard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="home-content" element={<HomeContent />} />
          <Route path="file-manager" element={<FileManager />} />

          {/* Student Area */}
          <Route path="student-area/admissions" element={<Admissions />} />
          <Route path="student-area/syllabus" element={<SyllabusContent />} />
          <Route path="student-area/results" element={<ResultsContent />} />
          <Route path="student-area/resources" element={<ResourcesContent />} />
          <Route path="student-area/*" element={<PlaceholderPage />} />

          {/* Teacher Area */}
          <Route path="teacher-area" element={<PlaceholderPage />} />
          <Route path="teacher-area/*" element={<PlaceholderPage />} />

          {/* Diploma Exam */}
          <Route path="diploma-exam" element={<PlaceholderPage />} />
          <Route path="diploma-exam/*" element={<PlaceholderPage />} />

          {/* Franchise */}
          <Route path="franchise" element={<PlaceholderPage />} />
          <Route path="franchise/*" element={<PlaceholderPage />} />

          {/* Gallery & Events */}
          <Route path="gallery" element={<PlaceholderPage />} />
          <Route path="events" element={<PlaceholderPage />} />

          {/* Other */}
          <Route path="other" element={<PlaceholderPage />} />
          <Route path="other/*" element={<PlaceholderPage />} />

          <Route path="*" element={<div className="p-4">Page under construction</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
