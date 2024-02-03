import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext, useEffect} from 'react';
import Login from './login';
import SignUp from './register';
import { UserProvider, UserContext } from './Usercontext';
import AddPost from './add';
import UpdateUser from './updateUser';
import Home from './home';
import ProfilePage from './profile';
import UpdatePost from './updatePost';
import MyPosts from './myPosts';


interface TokenProps {
  children: React.ReactNode;
}


function CheckToken({ children }: TokenProps) {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const App: React.FC = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { userInfo ,currentUserInfo,fetchCurrentUser, fetchUserInfo } = useContext(UserContext);
  
  useEffect(() => {
    
    
    fetchUserInfo();
    fetchCurrentUser();

    
    
  }, [ userInfo.userId]);


  return (
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<CheckToken><Home /></CheckToken>} />
      <Route path="/add" element={<CheckToken><AddPost /></CheckToken>} />
      <Route path="/UpdateUser" element={
        <CheckToken>
          <UpdateUser userId={userInfo.userId} CurrentUsername={currentUserInfo.username} />
        </CheckToken>
      } />
      <Route path="/Profile" element={<CheckToken><ProfilePage /></CheckToken>} />
      <Route path="/updatePost/:postId" element={<CheckToken><UpdatePost /></CheckToken>} />
      <Route path="/myposts/:userId" element={<CheckToken><MyPosts /></CheckToken>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;

