import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import AdminLogin from './components/admin/AdminLogin.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import AdminGallery from './components/admin/AdminGallery.jsx'
import AdminMainPhotos from './components/admin/AdminMainPhotos.jsx'
import AdminEvents from './components/admin/AdminEvents.jsx'
import AdminTempleInfo from './components/admin/AdminTempleInfo.jsx'
import AdminDonation from './components/admin/AdminDonation.jsx'
import AdminContacts from './components/admin/AdminContacts.jsx'
import AdminReceipt from './components/admin/AdminReceipt.jsx'
import AdminAccounts from './components/admin/AdminAccounts.jsx'
import AdminSettings from './components/admin/AdminSettings.jsx'
import AdminLogs from './components/admin/AdminLogs.jsx'
import AdminCommittee from './components/admin/AdminCommittee.jsx'
import VirtualDarshan from './components/VirtualDarshan.jsx'
import { LanguageProvider } from './context/LanguageContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/virtual-darshan" element={<VirtualDarshan />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="main-photos" element={<AdminMainPhotos />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="committee" element={<AdminCommittee />} />
              <Route path="temple-info" element={<AdminTempleInfo />} />
              <Route path="donation" element={<AdminDonation />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="receipts" element={<AdminReceipt />} />
              <Route path="accounts" element={<AdminAccounts />} />
              <Route path="logs" element={<AdminLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>,
)
