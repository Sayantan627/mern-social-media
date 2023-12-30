import { Link } from "react-router-dom";
import "./topbar.css";
import { Chat, Notifications, Person, Search } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Topbar = () => {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const {
    user: { user },
  } = useContext(AuthContext);
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Friendify</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search />
          <input
            type="text"
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">HomePage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? user.profilePicture
                : `${PF}person/noAvatar.png`
            }
            alt="person-img"
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
};
export default Topbar;
