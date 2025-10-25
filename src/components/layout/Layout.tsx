import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;