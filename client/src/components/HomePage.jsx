// components/HomePage.js
import './HomePage.css';

function HomePage() {
  const userLoggedIn = false; //  Will change based on user status
  const welcomeMessage = userLoggedIn
    ? `Welcome! What do you want to do today?`
    : `Welcome to Remotivity! Join us for better remote work productivity.`;

  return (
    <div className="home-page">
      <h2>{welcomeMessage}</h2>
      <p className="subtitle">
        The best way for content creators to make money and connect with the audience
      </p>
      <div className="sections">
        <div className="section" id="tasks">
          <h3>Tasks</h3>
          <p>Manage your tasks and track progress here!</p>
        </div>

        <div className="section" id="time-logs">
          <h3>Time Logs</h3>
          <p>Log your work hours and view summaries.</p>
        </div>
        
        <div className="section" id="charts">
          <h3>Charts</h3>
          <p>Visualize productivity data with charts.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;