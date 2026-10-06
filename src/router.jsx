import { createBrowserRouter, Navigate } from 'react-router'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import AudiencePage from './pages/AudiencePage.jsx'
import OpportunitiesPage from './pages/OpportunitiesPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import KnowledgePage from './pages/KnowledgePage.jsx'
import PageError from './pages/PageError.jsx'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/ar" replace /> },
  {
    path: '/:lang',
    element: <App />,
    children: [
      { index: true, element: <HomePage />, errorElement: <PageError /> },
      { path: 'franchisor', element: <AudiencePage audience="franchisor" />, errorElement: <PageError /> },
      { path: 'investor', element: <AudiencePage audience="investor" />, errorElement: <PageError /> },
      { path: 'opportunities', element: <OpportunitiesPage />, errorElement: <PageError /> },
      { path: 'knowledge', element: <KnowledgePage />, errorElement: <PageError /> },
      { path: 'contact', element: <ContactPage />, errorElement: <PageError /> },
      { path: '*', element: <PageError /> },
    ],
  },
])
