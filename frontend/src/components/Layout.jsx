import Navbar from './Navbar';

// Layout wraps all protected pages with the Navbar
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;