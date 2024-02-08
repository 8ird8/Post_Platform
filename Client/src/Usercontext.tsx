import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

interface Props {
  children: React.ReactNode;
}

interface UserInfo {
  userId: string;
  avatar: string;
  username: string;
  email: string;
  bio: string;
}

interface UserContextType {
  userInfo: UserInfo;
  currentUserInfo: UserInfo;
  fetchUserInfo: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  userInfo: { userId: '', avatar: '', username: '', email: '', bio: '' },
  currentUserInfo : { userId: '', avatar: '', username: '', email: '', bio: '' },
  fetchUserInfo: async () => {},
  fetchCurrentUser: async () => {},
});

export const UserProvider = ({ children }: Props) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ userId: '', avatar: '', username: '', email: '', bio: '' });
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo>({ userId: '', avatar: '', username: '', email: '', bio: '' });
  const token = localStorage.getItem('token');

  const fetchUserInfo = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.get("https://platform-posts.onrender.com/api/userId", {
          withCredentials: true,
        });
  
        if (res.status === 200) {
          setUserInfo(res.data.userInfo);
  
          // Now that userInfo is set, fetch the currentUserInfo
          await fetchCurrentUser();
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }
  }, [token]);

  const fetchCurrentUser = useCallback(async () => {
    if (userInfo.userId) {
      try {
        const res = await axios.get(`https://platform-posts.onrender.com/api/userInfo/${userInfo.userId}`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setCurrentUserInfo(res.data.currentUserInfo);
        } else {
          console.error("An error occurred while fetching user with that id");
        }
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    }
  }, [ userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, currentUserInfo, fetchUserInfo, fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};



