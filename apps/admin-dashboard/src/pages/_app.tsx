import '../styles/base.css';
import type { AppProps } from 'next/app';

import Sidebar from '../components/Sidebar';
import '../components/Sidebar.css';
import { AuthProvider } from '../auth/AuthContext';
import { ToastProvider } from '../components/ToastContext';

  return (
    <ToastProvider>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, marginRight: 210, padding: 32 }}>
            <Component {...pageProps} />
          </main>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}
