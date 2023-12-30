import "./message.css";
import { format } from "timeago.js";

const Message = ({ message, own, user }) => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <div className={`message ${own && "own"}`}>
      <div className="messageTop">
        <img
          src={
            own && user.profilePicture
              ? user.profilePicture
              : `${PF}person/noAvatar.png`
          }
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};
export default Message;
