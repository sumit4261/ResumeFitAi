import React from 'react';
import Navbar from './Navbar';
import './Layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
