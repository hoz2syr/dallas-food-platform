import '../styles/base.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../components/Sidebar.css';
import { AuthProvider } from '../auth/AuthContext';
import { ToastProvider } from '../components/ToastContext';

// Define public routes where sidebar might not be needed
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
  
  // Handle sidebar state on route change
  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change
    
    // Handle scroll restoration
    window.scrollTo(0, 0);
  }, [router.pathname]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <div className="app-container">
          {/* Only show sidebar on non-public routes */}
          {!isPublicRoute && (
            <>
              {/* Mobile hamburger menu button */}
              <button 
                type="button"
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen ? "true" : "false"}
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
              
              {/* Sidebar component */}
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </>
          )}
          
          {/* Main content */}
          <main 
            className={`main-content ${!isPublicRoute ? 'with-sidebar' : 'full-width'}`}
            onClick={() => sidebarOpen && setSidebarOpen(false)}
          >
            <Component {...pageProps} />
          </main>
          
          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div 
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          )}
          
          <style jsx>{`
            .app-container {
              display: flex;
              min-height: 100vh;
              position: relative;
            }
            
            .sidebar-toggle {
              display: none;
              position: fixed;
              top: 16px;
              left: 16px;
              z-index: 1100;
              background: var(--primary-color);
              color: white;
              border: none;
              border-radius: 4px;
              padding: 8px;
              cursor: pointer;
              flex-direction: column;
              justify-content: space-between;
              height: 40px;
              width: 40px;
              transition: all 0.3s ease;
            }
            
            .sidebar-toggle:hover {
              background: var(--primary-dark);
            }
            
            .hamburger-line {
              display: block;
              width: 24px;
              height: 3px;
              background: white;
              border-radius: 2px;
              transition: all 0.3s ease;
            }
            
            .main-content {
              flex: 1;
              transition: margin-right 0.3s ease, padding 0.3s ease;
            }
            
            .main-content.with-sidebar {
              margin-right: 210px;
              padding: 32px;
            }
            
            .main-content.full-width {
              padding: 32px;
              margin-right: 0;
            }
            
            .sidebar-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              z-index: 999;
              display: none;
            }
            
            @media (max-width: 768px) {
              .sidebar-toggle {
                display: flex;
              }
              
              .main-content.with-sidebar {
                margin-right: 0;
                padding: 16px;
                padding-top: 64px; /* Make room for hamburger button */
              }
              
              .main-content.full-width {
                padding: 16px;
              }
              
              .sidebar-overlay {
                display: block;
              }
            }
            
            @media (max-width: 480px) {
              .main-content.with-sidebar {
                padding: 12px;
                padding-top: 56px;
              }
              
              .main-content.full-width {
                padding: 12px;
              }
            }
          `}</style>
          
          {/* Global styles for the app */}
          <style jsx global>{`
            :root {
              --primary-color: #1976d2;
              --primary-dark: #115293;
              --secondary-color: #dc004e;
              --text-primary: rgba(0, 0, 0, 0.87);
              --text-secondary: rgba(0, 0, 0, 0.6);
              --background-default: #f5f5f5;
              --background-paper: #ffffff;
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              background-color: var(--background-default);
              color: var(--text-primary);
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            a {
              color: inherit;
              text-decoration: none;
            }
            
            button {
              font-family: inherit;
            }
            
            /* Smooth scrolling for the whole app */
            html {
              scroll-behavior: smooth;
            }
            
            /* Focus styles for accessibility */
            :focus-visible {
              outline: 2px solid var(--primary-color);
              outline-offset: 2px;
            }
            
            /* Utility classes */
            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }
          `}</style>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;