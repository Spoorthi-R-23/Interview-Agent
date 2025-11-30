import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer.jsx';
import NavigationBar from './NavigationBar.jsx';
import useAuthStore from '../hooks/useAuthStore.js';
import { AuthAPI } from '../services/apiClient.js';

function Layout({ children }) {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      AuthAPI.me().catch(() => {
        useAuthStore.getState().logout();
      });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <NavigationBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
