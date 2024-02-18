import "../index.css";


function PostCard({ post }) {
    return (
        <div className="" style={{width: "100%"}}>
            <div className="flex justify-start gap-x-2">
                <img src={"http://localhost:3001/uploads/profilePictures/default.png"} alt="post" className="w-11" />
                <h1 className="flex items-center">{post.creator.name.split(' ')[0]}</h1>
            </div>
            <img src={"http://localhost:3001/uploads/postPictures/"+post.image} alt="post" className="w-full" />
        </div>
    );
}

export default PostCard;
