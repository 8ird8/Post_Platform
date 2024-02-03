import { useContext, useEffect, useRef } from "react";
import SideBar from "./sidebar";
import { UserContext } from "./Usercontext";
import axios from "axios";

const ProfilePage = () => {
  const { userInfo, currentUserInfo,fetchCurrentUser, fetchUserInfo } = useContext(UserContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    fetchUserInfo();
    fetchCurrentUser();

    
    
  }, [userInfo.userId]);

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if (file) {
      formData.append("avatar", file);

      try {
        const userId = userInfo?.userId; 
        const res = await axios.put(
          `http://localhost:4000/update/${userId}`,
          formData,
          { withCredentials: true }
        );

        if (res.status === 200) {
          fetchCurrentUser(); 
        } else {
          console.error("Error updating user");
        }
      } catch (error) {
        console.error("Error during user update:", error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-start gap-2">
      <SideBar />
      <div className="flex m-auto justify-center items-center h-screen">
        <div className="px-5 py-20 shadow-lg items-center w-cus bg-gray-100 rounded-lg">
          <div className="flex flex-col">
            <div className="flex justify-center relative">
              <img
                src={`http://localhost:4000/uploads/${currentUserInfo?.avatar}`}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
              <button
                onClick={triggerFileInput}
                className="absolute bottom-2 left-46 bg-blue-500 text-white p-2 rounded-full"
                style={{ transform: 'translate(50%, 50%)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.647a.5.5 0 0 0 0-.707l-2-2a.5.5 0 0 0-.707-.707l-.293.293ZM10 2.207 2 10.207v.586l-.5.5v2.5h2.5l.5-.5h.586L13.793 6l-3.793-3.793ZM1 13.5V11l.5-.5h2.5l.5.5v2.5H2l-.5-.5v-2.086l-.5.5v.586Z"/>
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <h2 className="mt-4 font-700 capitalize text-center text-3xl">
              {currentUserInfo?.username}
            </h2>
            <h2 className="mt-12 text-start text-md">
              <span className="font-600 text-start text-lg mb-6 text-gray-600">
                Email |
              </span> <br /> {currentUserInfo?.email}
            </h2>
            <p className="text-md mt-4 whitespace-pre-wrap">
              <span className="font-600 text-lg text-gray-600">Bio |</span> <br /> {currentUserInfo?.bio}
            </p>
            <h1 className="font-600 text-lg mt-4 text-start text-gray-600">
              Social Media | <br />
              <img src="linkedin.png" alt="" className="w-10 mt-4" />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
