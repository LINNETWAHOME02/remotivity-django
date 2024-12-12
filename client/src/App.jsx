// App.js
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Timelogs from "./pages/Timelogs/Timelogs";
import ChartsPage from "./pages/Charts/ChartsPage";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import "./App.css";
import TaskInput from "./pages/Tasks/TaskInput";

import {AuthProvider} from "./contexts/useAuth.jsx";
import {PrivateRoute} from "./components/private_routes.jsx";
import EditTask from "./pages/EditTask.jsx";

function App() {
  const [timelogData, setTimelogData] = useState([]);

  useEffect(() => {
    // Fetch timelog data
    const fetchData = async () => {
      const data = [];
      setTimelogData(data);
    };
    fetchData();
  }, []);

  

  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="container">
          <AuthProvider>
            <div className="main-content">
              <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/tasks" element={<TaskInput/>}/>
                <Route path="/timelogs" element={<PrivateRoute><Timelogs/></PrivateRoute>}/>
                <Route path="/charts" element={
                  <PrivateRoute><ChartsPage timelogData={timelogData}/></PrivateRoute>
                }/>
                <Route path="/tasks/edit/:taskId" element={<EditTask />} />
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route path="/log-in" element={<LogIn/>}/>
              </Routes>
            </div>
          </AuthProvider>
        </div>
      </Router>
    </div>
  );
}

export default App;
