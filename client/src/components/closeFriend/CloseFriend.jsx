import "./closeFriend.css";

const CloseFriend = ({ user }) => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <img
        src={PF + user.profilePicture}
        alt={user.username}
        className="sidebarFriendImg"
      />
      <span className="sidebarFriendName">{user.username}</span>
    </li>
  );
};
export default CloseFriend;
