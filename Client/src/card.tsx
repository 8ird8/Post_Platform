import { Link } from "react-router-dom";
import DeleteButton from "./deletepost";
import LikeButton from "./like";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  creator_name: string;
  CurrentuserId: string;

  creatorId: string;
  avatarUrl: string;
  post: {
    _id: string;
    likes: string[];
  };
  created_at: string;
}


const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  creator_name,
  post,
  CurrentuserId,
  avatarUrl,
  creatorId,
  created_at,
}) => {
  const showDellete = CurrentuserId === creatorId;
  const userHasLiked = post.likes.includes(CurrentuserId);
 

  return (
    <>
      <div className=" rounded-2xl m-auto  border-gray-200 border-2  shadow-lg">
        <div className="flex justify-start gap-4 ">
          <img
            className="w-16 h-16 p-2 object-contain  rounded-full"
            src={avatarUrl}
            alt="yo"
          />
          <div className="my-auto">
            <p className="my-auto font-500 text-gray-700 capitalize text-lg">
              {" "}
              {creator_name}
            </p>
            <p className="my-auto font-300 text-gray-500 capitalize text-sm">
              {created_at}
            </p>
          </div>
        </div>
        <div className="font-700 text-xl text-center mb-2">{title}</div>
        <div className="px-6 py-4">
          <img className="w-full rounded-xl " src={imageUrl} alt="title" />
          <p className="text-gray-700  p-6 text-base">{description}</p>

          <div
            className={`flex ${
              showDellete ? "justify-between" : "justify-start "
            } gap-4`}
          >
            <LikeButton
              postId={post._id}
              userLiked={userHasLiked}
              TotalLikes={post.likes.length}
            />
            {showDellete && (
              <div className=" flex justify-between gap-2 ">
                <Link
                  to={`/updatePost/${post._id}`}
                  key={post._id}
                  className="  rounded-xl "
                >
                  <img
                    src="../public/pencil.png"
                    alt="edit"
                    className="w-6 h-6"
                  />
                </Link>
                <div className="m-auto  rounded-xl ">
                  <DeleteButton postId={post._id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
