import axios from "axios";
import "./assets/like.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SideBar from "./sidebar";
import Card from "./card";
import { UserContext } from "./Usercontext";
import { format } from "date-fns";
import CardSkeleton from "./skeleton";

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
  const [loading, setLoading] = useState(true);
  
  const baseUrl = import.meta.env.VITE_BASE_URL;
  

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
            setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    fetchUserInfo();
  }, [posts,userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return format(date, "MMMM dd 'at' p");
  };

  

  return (
    <div className="flex justify-start">
      <div className="fixed h-screen">
        <SideBar />
      </div>
      <div className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center">
            <CardSkeleton /> 
          </div>
        ) : (
          <div className="m-auto justify-center relative left-16  w-1/2 mt-28">
            {message ? (
              <div>
                <p className="text-5xl text-center font-semibold">{message}</p>
                <Link to="/add">
                  <button className="bg-indigo-500 text-white rounded-lg px-4 py-2 mt-4">
                    Create Your First Post
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-10">
                {posts.map((post) => (
                  <Card
                    key={post._id}
                    post={post}
                    title={post.title}
                    description={post.description}
                    imageUrl={`${baseUrl}/uploads/${post.image}`}
                    creator_name={post.creator.username}
                    CurrentuserId={userInfo.userId}
                    creatorId={post.creator._id}
                    avatarUrl={`${baseUrl}/uploads/${post.creator.avatar}`}
                    created_at={formatDate(post.createdAt)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;


/////// 
// if (loading) {
  //   return (
  //     <div className="flex justify-start">
  //       <div className="fixed  h-screen  ">
  //         <SideBar />
  //       </div>
  //       <div className="loader-container m-auto flex justify-center items-center h-screen">
  //         <div className="loader">
  //           <img src="../public/shape.png" alt="dd" className="w-16 h-16"/>

  //         </div>
  //       </div>
  //       ;
  //     </div>
  //   );
  // }

  // return (
  //   <div className="flex justify-start">
  //     <div className="flex  ">
  //       <div className="fixed  h-screen  ">
  //         <SideBar />
  //       </div>
  //       {loading ? (
  //         <CardSkeleton />
  //       ) : 
  //         {posts.length > 0 && (
  //           <div className="flex-grow m-auto justify-center w-1/2 mt-8">
  //             <div className="grid gap-10">
  //               {posts.map((post) => (
  //                 <div
  //                   key={post._id}
  //                   className="post-container relative mb-8 left-16 mt-20 w-1/2 m-auto"
  //                 >
  //                   <Card
  //                     title={post.title}
  //                     description={post.description}
  //                     imageUrl={`http://localhost:4000/uploads/${post.image}`}
  //                     creator_name={post.creator.username}
  //                     post={post}
  //                     CurrentuserId={userInfo.userId}
  //                     creatorId={post.creator._id}
  //                     avatarUrl={`http://localhost:4000/uploads/${post.creator.avatar}`}
  //                     created_at={formatDate(post.createdAt)}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //       <div className="mx-auto ">
  //         {message && (
  //           <div>
  //             <p className="flex-grow mt-16 w-full text-5xl text-center font-600">
  //               {message}
  //             </p>
  //             <Link to="/add">
  //               <button className="bg-indigo-900 mt-4 text-white  hover:bg-indigo-700 font-semibold py-2 px-4 border border-indigo-500  rounded-xl">
  //                 Create Your First Post
  //               </button>
  //             </Link>
  //           </div>
  //         )}
  //       }
  //     </div>
  //   </div>
  // );