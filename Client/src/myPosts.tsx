import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./sidebar";
import Card from "./card";
import { UserContext } from "./Usercontext";
import { format } from "date-fns";

interface Post {
  _id: string;
  title: string;
  description: string;
  image: string;
  creator: {
    _id: string;
    avatar: string;
    username: string;
  };
  username: string;
  userInfo: {
    userId: string;
    avatar: string;
  };
  likes: string[];
  createdAt: string;
}

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { userInfo, fetchUserInfo } = useContext(UserContext);
  const { userId } = useParams();
  const [message, setMessage] = useState("");
  // const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/posts/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200 && res.data.posts) {
          if (res.data.posts.length > 0) {
            setPosts(res.data.posts);
            fetchPosts();
            
          } else {
            setMessage("No Posts Found");
          }
        } else {
          console.error(
            "An error occurred while fetching posts or no posts returned"
          );
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
    fetchUserInfo();
  }, [posts.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "MMMM dd 'at' p");
  };


  //   return (
  //     <div  className="flex justify-start">
  //         <SideBar />
  //         {message && <p className=" mt-6  w-full text-5xl text-center font-600 ">{message}</p>}
  //         <div className="flex m-auto justify-center w-1/2 mt-8">

  //         <div className=" grid  gap-10   " >

  //           {posts.map((post) => (
  //             <div key={post._id} className="post-container">
  //               <Card
  //                 title={post.title}
  //                 description={post.description}
  //                 imageUrl={`http://localhost:4000/uploads/${post.image}`}
  //                 creator_name={post.username}
  //                 post = {post}
  //                 CurrentuserId={userInfo.userId}
  //                 creatorId= {post.creator._id}
  //                 avatarUrl={`http://localhost:4000/uploads/${post.creator.avatar}`}
  //               />

  //             </div>
  //           ))}

  //         </div>
  //         </div>
  //     </div>

  //   )
  return (
    <div className="flex justify-start">
      <div className="flex  ">
      <div className="fixed  h-screen  ">
          <SideBar />
        </div>
        {posts.length > 0 && (
          <div className="flex-grow m-auto justify-center w-1/2 mt-8">
            <div className="grid gap-10">
              {posts.map((post) => (
                <div key={post._id} className="post-container relative left-16 mt-20 w-1/2 m-auto">
                  <Card
                    title={post.title}
                    description={post.description}
                    imageUrl={`http://localhost:4000/uploads/${post.image}`}
                    creator_name={post.creator.username}
                    post={post}
                    CurrentuserId={userInfo.userId}
                    creatorId={post.creator._id}
                    avatarUrl={`http://localhost:4000/uploads/${post.creator.avatar}`}
                    created_at={formatDate(post.createdAt)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mx-auto ">
        {message && (
          <p className="flex-grow mt-6 w-full text-5xl text-center font-600">
            {message}
          </p>
        )}
        {posts.length <= 0 && (
        <Link to="/add">
          <button
            className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 border border-blue-500 hover:border-blue-700 rounded"
          >
            Create Your First Post
          </button>
        </Link>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
