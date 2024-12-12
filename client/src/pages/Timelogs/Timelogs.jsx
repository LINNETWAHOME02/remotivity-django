/* Timelogs page:
  Shows a list of tasks you’ve worked on, with details like the day, date, task name, and times you started and finished.
  Lets you delete a task if you don’t want it anymore
*/

import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import "./Timelogs.css";
import {useAuth} from "../../contexts/useAuth.jsx";
import {deleteTask, editTask} from "../../endpoints/api.js";

const TimeLogs = () => {
  const [timeLogs, setTimeLogs] = useState([]); // time logs - list of all the tasks added
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const {getAllTasks} = useAuth();

  // Fetching the tasks
  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await getAllTasks()
        const tasks = response.data
        console.log(tasks)

        // Transform the tasks
        const transformedLogs = tasks.map(task => ({
          id: task.id,
          day: new Date(task.start_time).toLocaleDateString('en-US', { weekday: 'long' }), // What day of the week it was
          date: new Date(task.start_time).toLocaleDateString(), // Full date
          task: task.description, // The name of the task
          timeLoggedIn: new Date(task.start_time).toLocaleTimeString(), // When the task started
          timeCompleted: new Date(task.end_time).toLocaleTimeString(), // When the task ended
        }));

       setTimeLogs(transformedLogs); // setTimeLogs stores the list of tasks
      } catch (error) {
        setError(error.message); // If there’s a problem, we put the error message in setError
      } finally {
        setLoading(false);
      }
    };

    fetchTimeLogs();
  }, []);

  
  // handleDelete: When you click "Delete," it sends a message to the server to remove the task
  const handleDelete = async (taskId) => {
    try {
     await deleteTask(taskId);
      // Remove from the list: After deleting, we take that task out of the displayed list (setTimeLogs)
      setTimeLogs(timeLogs.filter(log => log.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);  // Logs the full error object for debugging
      setError(error.message);
    }
  };

  //Redirect to the Edit page
  const handleUpdate = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  if (loading) return <div>Loading...</div>; // If we’re still getting the tasks, show "Loading...", if not display tasks
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="time-logs-container">
      <h2>Time Logs</h2>
      <table className="time-logs-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Tasks</th>
            <th>Time Logged In</th>
            <th>Time Completed</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {timeLogs.map(log => (
              <tr key={log.id}>
                <td>{log.day}</td>
                <td>{log.date}</td>
                <td>{log.task}</td>
                <td>{log.timeLoggedIn}</td>
                <td>{log.timeCompleted}</td>
                <td>
                  <button onClick={() => handleDelete(log.id)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleUpdate(log.id)}>Edit</button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeLogs;
