import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Verify from './pages/verify.jsx';
import Login from './pages/login.jsx';
import Home from './pages/home.jsx';
import Dashboard from './pages/dashboard.jsx';
import Addproperty from './pages/addproperty.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import { useAuthStore } from './store/AuthStore.js';

const App = () => {
  const {authUser } = useAuthStore();
  return (
      <Routes>
        <Route path="/" element={ <Home/>}/>
        <Route path='/login' element={!authUser?<Login />:<Navigate to="/dashboard" />} />
        <Route path="/signup" element={!authUser? <Signup/>:<Navigate to="/verify"/>}/>
        <Route path="/verify" element={!authUser?.isVerified? <Verify />:<Navigate to="/dashboard"/>} />
        <Route path="/dashboard" element={authUser? <Dashboard />:<Navigate to="/login" />} />
        <Route path='/addproperty' element={!authUser?<Navigate to="/login" />:<Addproperty/>} />
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Routes>
  );
};

export default App;
