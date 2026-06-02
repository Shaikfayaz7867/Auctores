import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import { AppLayout } from './layouts/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public pages
import { Home } from './pages/Home';
import { Journals } from './pages/Journals';
import { Articles } from './pages/Articles';
import { EditorialBoard } from './pages/EditorialBoard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Dashboard pages
import { AuthorDashboard } from './components/dashboards/AuthorDashboard';
import { ReviewerDashboard } from './components/dashboards/ReviewerDashboard';
import { EditorDashboard } from './components/dashboards/EditorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

// Initialize TanStack query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

console.log('[App] Starting application mount...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Main App Scaffolding */}
            <Route path="/" element={<AppLayout />}>
              {/* Public Pages */}
              <Route index element={<Home />} />
              <Route path="journals" element={<Journals />} />
              <Route path="articles" element={<Articles />} />
              <Route path="editorial-board" element={<EditorialBoard />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Auth UI */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Dashboard Routing */}
              <Route path="dashboard">
                <Route path="author" element={<AuthorDashboard />} />
                <Route path="reviewer" element={<ReviewerDashboard />} />
                <Route path="editor" element={<EditorDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                {/* Fallback to root */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
            
            {/* Global Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('[App] Application mounted successfully');
