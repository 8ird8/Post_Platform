import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./assets/like.css";
import axios from "axios";

interface Props {
  postId: string;
  userLiked: boolean;
  TotalLikes : number;
}
const LikeButton = ({ postId, userLiked, TotalLikes }: Props) => {
  const [likes, setLikes] = useState(TotalLikes);
  const [liked, setLiked] = useState(userLiked);
  

  const toggleLike = async () => {

    try {
      const res = await axios.post(`http://localhost:4000/api/posts/${postId}/like`,  {
        
        
      },{withCredentials: true});

      if (res.status === 200) {
        if (!liked) {
          setLikes(res.data.likes);
          setLiked(true);
        } else {
          setLikes(res.data.likes);
          setLiked(false);
        }
        
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }
    

  return (
    <>
      <button
        className="heart-button flex justify-between gap-4"
        onClick={toggleLike}
      >
        <span className={liked ? "heart-icon liked" : "heart-icon"}>
          {liked ? <FaHeart /> : <FaRegHeart />}
        </span>{" "}
        {likes}
      </button>
    </>
  );
};

export default LikeButton;


