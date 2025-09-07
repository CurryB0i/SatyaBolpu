import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Navbar from './components/Navbar.tsx'
import { BrowserRouter } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext.tsx'
import Footer from './components/Footer.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { DialogBoxProvider } from './context/DialogBoxContext.tsx'
import { PostProvider } from './context/PostContext.tsx'
import { CultureProvider } from './context/CultureContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
    <AuthProvider>
     <CultureProvider>
      <PostProvider>
       <DialogBoxProvider>
        <Navbar />
        <LoadingProvider>
         <App />
        </LoadingProvider>
        <Footer />
       </DialogBoxProvider>
      </PostProvider>
     </CultureProvider>
    </AuthProvider>
   </BrowserRouter>
  </StrictMode>
)
