import  { useRef, useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBar from "./sidebar";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (fileInputRef.current?.files) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    try {
      const res = await axios.post("http://localhost:4000/add", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setTitle("");
        setDescription("");
        // Reset file input if needed
        navigate("/home");
      } else {
        console.log(res);
      }
    } catch (error) {
      console.error("Error during adding post :", error);
    }
  };

  return (
    <div className="flex justify-between">
      <SideBar />
      <div className="  m-auto w-1/2 mt-auto p-6 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-900">
          Create a New Post
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              placeholder="Subject"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              id="description"
              name="description"
              value={description}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's on your mind?"
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-between text-center  items-center" />
          <div className="flex items-center ">
            <label className="flex items-center mb-6 cursor-pointer text-blue-600 hover:text-blue-800">
              <span className="mr-2 text-indigo-900 font-600 ">
                Upload Image
              </span>
              <img src="images.png" alt="image" className="w-8 h-8" />
            
              <input
                type="file"
                className="hidden"
                ref={fileInputRef} // Use the ref here
                id="image"
                name="image"
              />
            </label>
          </div>
          <button
            type="submit"
            className={`px-4 w-full py-2 text-white rounded-lg ${description ? "bg-indigo-900 hover:bg-indigo-700" : "bg-gray-500"}`}
            disabled={!description}
          >
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;

