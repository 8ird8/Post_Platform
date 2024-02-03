import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from './sidebar';
import { UserContext } from './Usercontext';

const UpdatePost = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { fetchUserInfo } = useContext(UserContext);
  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/posts/${postId}`, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.post) {
          setTitle(response.data.post.title);
          setDescription(response.data.post.description);
        } else {
          console.error("Error fetching post");
        }
      } catch (error) {
        console.error("Error during post fetch:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
    fetchUserInfo();
  }, [postId, fetchUserInfo]);

  const handleImageChange = (e:any) => {
    setImage(e.target.files[0]);
  };

  

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.put(`http://localhost:4000/updatePost/${postId}`, formData, {
        withCredentials: true,
      });
      if (res.status === 200) {
        
        fetchUserInfo();
        navigate("/home");
        setMessage("Post updated successfully");
      } else {
        setMessage("Error updating post");
      }
    } catch (error) {
      console.error("Error during post update:", error);
      setMessage("Error during post update");
    }
  };

  return (
    <>
      <div className="flex justify-between">
      <SideBar />
      <div className="m-auto w-1/2 mt-auto p-6 bg-white rounded-md shadow-md">
        {message && <p>{message}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              placeholder="Subject"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-900 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              id="description"
              name="description"
              value={description}
              className="w-full p-2 overflow-hidden  h-56 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-900"
              placeholder="What's on your mind?"
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center">
            <label className="flex items-center mb-6 cursor-pointer text-blue-600 hover:text-blue-800">
              <span className="mr-2 text-indigo-900 font-600">
                Upload Image
              </span>
              <img src="../public/images.png" alt="image" className="w-8 h-8" />
              <input
                type="file"
                className="hidden"
                id="image"
                name="image"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <button
            type="submit"
            className={`px-4 w-full py-2 text-white rounded-lg ${description ? "bg-indigo-900 hover:bg-indigo-700" : "bg-gray-500"}`}
            disabled={!description}
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default UpdatePost;
