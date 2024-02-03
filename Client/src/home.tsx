import { useState, useEffect, useContext } from "react";
import axios from "axios";
// import { useNavigate} from "react-router-dom";
import Card from "./card";
import SideBar from "./sidebar";
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

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { userInfo, fetchUserInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/posts", {
          withCredentials: true,
        });

        if (res.status === 200 && res.data.posts) {
          if (res.data.posts.length > 0) {
            setPosts(res.data.posts);
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
  }, [posts, fetchUserInfo]);

  const formatDate = (dateString:string)  => {
    return format(new Date(dateString), "MMMM dd 'at' p");
  };

  

  return (
    <>
      <div className="flex justify-between">
        <div className="fixed  h-screen  ">
          <SideBar />
        </div>
        <div className="flex m-auto relative left-16   justify-between w-1/2 mt-28">
          {/* {message && <p className="border bg-red-400">{message}</p>} */}
          <div className="  gap-10 m  grid ">
            {posts.map((post) => (
              <div key={post._id} className="post-container">
                <Card
                  title={post.title}
                  description={post.description}
                  imageUrl={`http://localhost:4000/uploads/${post.image}`}
                  creator_name={post.creator.username}
                  post={post}
                  CurrentuserId={userInfo.userId}
                  creatorId={post.creator._id}
                  avatarUrl={`http://localhost:4000/uploads/${post.creator.avatar}`}
                  created_at={formatDate(
                    post.createdAt ? post.createdAt : "yyyy-MM-dd"
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

export default Home;
