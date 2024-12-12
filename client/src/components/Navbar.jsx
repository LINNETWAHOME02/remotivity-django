// Navbar.jsx
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import {logout} from "../endpoints/api.js";

function Navbar() {
  const navigate = useNavigate();

  // Check if user data exists in localStorage
  const isUserLoggedIn = localStorage.getItem("dataUser") !== null;

  const logoutUser = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      try {
        const response = await logout()
        console.log("Logged out:", response);

        // Clear the user data from localStorage
        localStorage.removeItem("dataUser");

        // Navigate to the login page
        navigate("/log-in");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  };

  return (
    <nav className="navbar">
      <h1>
        <a href="/">Remotivity</a>
      </h1>
      <div className="nav-items">
        <a href="/tasks">Tasks</a>
        <a href="/timelogs">Time Logs</a>
        <a href="/charts">Charts</a>
        {isUserLoggedIn ? (
          <a onClick={logoutUser} style={{ cursor: "pointer" }}>
            Log-Out
          </a>
        ) : (
          <>
            <a href="/sign-up">Sign-Up</a>
            <a href="/log-in">Log-In</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
