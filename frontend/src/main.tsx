import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar.tsx'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext.tsx'
import Footer from './components/Footer.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DialogBoxProvider } from './context/DialogBoxContext.tsx'
import { PostProvider } from './context/PostContext.tsx'
import { CultureProvider } from './context/CultureContext.tsx'
import { EventProvider } from './context/EventContext.tsx'

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
    <ScrollToTop />
    <AuthProvider>
     <CultureProvider>
      <PostProvider>
        <EventProvider>
         <DialogBoxProvider>
          <Navbar />
          <LoadingProvider>
           <App />
          </LoadingProvider>
          <Footer />
         </DialogBoxProvider>
        </EventProvider>
      </PostProvider>
     </CultureProvider>
    </AuthProvider>
   </BrowserRouter>
  </StrictMode>
)
