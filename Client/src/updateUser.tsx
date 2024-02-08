import axios from "axios";
import {useRef, useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebar";
import { useContext } from "react";
import { UserContext } from "./Usercontext";

interface UpdateProp {
  userId: string;
  CurrentUsername: string;
}

const UpdateUser = ({ userId, CurrentUsername }: UpdateProp) => {
  const [username, setUsername] = useState(CurrentUsername);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [Confirmpass, setCpassword] = useState("");
  const [bio, setBio] = useState("");
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const Navigate = useNavigate();
  const { fetchUserInfo } = useContext(UserContext);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    // formData.append('Confirmpass', Confirmpass);
    formData.append("bio", bio);
    if (fileInputRef.current?.files) {
      formData.append("avatar", fileInputRef.current.files[0]);
    }

    try {
      const res = await axios.put(
        `https://platform-posts.onrender.com/update/${userId}`,
        formData,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage("User updated successfully");
        fetchUserInfo();
        Navigate("/home");
      } else {
        setMessage("Error updating user");
      }
    } catch (error) {
      console.error("Error during user update:", error);
      setMessage("Error during user update");
    }
  };

  
  
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
    <>
      <div className="flex justify-between">
        <SideBar />
        <div className="m-auto w-2/3">
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label>Bio:</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            
            <label className="flex items-center mb-6 cursor-pointer text-blue-600 hover:text-blue-800">
              <span className="mr-2 text-indigo-900 font-600 ">
                 Avatar
              </span>
              <img src={`${AssetsUrl}/images.png`} alt="image" className="w-8 h-8" />
              <input
                type="file"
                className="hidden"
                id="image"
                name="imageUrl"
                ref={fileInputRef}
              />
            </label>
            <button
              className={`px-4 w-full py-2 text-white rounded-lg ${
                bio ? "bg-indigo-900 hover:bg-indigo-700" : "bg-gray-500"
              }`}
              disabled={!bio}
              type="submit"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
