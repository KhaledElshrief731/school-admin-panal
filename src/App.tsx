import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDirection } from './hooks/useDirection';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import Users from './pages/Users/Users';
import Agents from './pages/Agents';
import Subscriptions from './pages/Subscriptions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Drivers from './pages/Drivers';
import Notifications from './pages/Notifications';
import Ads from './pages/Ads';
import Login from './pages/Login';
import SystemSettings from './pages/SystemSettings';
import Content from './pages/Content';
import SubscriptionPlans from './pages/subscriptionPlans';
import DriverDetailsPage from './components/drivers/drivers-approvals/DriverDetailsPage';
import School from './pages/School/School';
import City from './pages/City/City';
import Country from './pages/Country';
import SchoolDetails from './pages/School/SchoolDetails';
import CityDetails from './pages/City/CityDetails';
import Groups from './pages/Groups/Groups';
import GroupsDetails from './pages/Groups/GroupsDetails';
import Trips from './pages/Trips/Trips';
import TripDetails from './pages/Trips/TripDetails';
import { isTokenExpired } from './utils/dateUtils';
import AddUser from './pages/Users/AddUser';
import UsersDetails from './pages/Users/UsersDetails';
import ContactUs from './pages/ContactUs';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  useDirection(); // Initialize direction handling
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}> 
        <Route path="/*" element={<MainLayout />}> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schools" element={<Schools />} />
          <Route path="school" element={<School />} />
          <Route path="school/:id" element={<SchoolDetails />} />
          <Route path="city" element={<City />} />
          <Route path="city/:id" element={<CityDetails />} />
          <Route path="country" element={<Country />} />
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/:id" element={<UsersDetails />} />
          <Route path="agents" element={<Agents />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupsDetails />} />
          <Route path="trips" element={<Trips />} />
          <Route path="trips/:id" element={<TripDetails />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="ads" element={<Ads />} />
          <Route path="content" element={<Content />} />
          <Route path="system-settings" element={<SystemSettings />} />
          <Route path="drivers/:id" element={<DriverDetailsPage />} />
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;