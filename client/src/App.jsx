import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DsaProblems from './components/DsaProblems';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <AuthProvider>
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />


        <Route
          path='/app'
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
          <Route index element={<Dashboard />} />
          <Route path='dsaprep' element={<DsaProblems />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
};

export default App;