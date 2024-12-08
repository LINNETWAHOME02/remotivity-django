/*
  TaskInput - Is a form that lets you add a new task by filling in details like the task name, description,
   start time, and end time
*/
import { useState } from "react";
import "./TaskInput.css";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../contexts/useAuth.jsx";

const TaskInput = () => {
  // useState here is used to keep track of what you type in the form fields
  const [name, setName] = useState(""); // task: The task's name
  const [description, setDescription] = useState(""); // description: What the task is about
  const [start_time, setStartTime] = useState(""); // startTime: When the task starts
  const [end_time, setEndTime] = useState(""); // endTime: When the task ends
  const [error, setError] = useState(""); // error: If something goes wrong, this will store the message
  const [successMessage, setSuccessMessage] = useState(""); // successMessage: Shows a message if the task is successfully added
  const [isLoading, setIsLoading] = useState(false); // isLoading: Shows a "Submitting..." button while saving the task
  const navigate = useNavigate();

  // Create task route
  const {createTask} = useAuth()

  // When you press the "Add Task" button, the handleSubmit function runs and submits your task
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop refreshing the page: e.preventDefault() stops the page from reloading
    setError("");

    // Check the times: If the end time is before the start time, show the error
    if (new Date(end_time) <= new Date(start_time)) {
      setError("End time must be after start time.");
      return;
    }
    try {
      // Prepare the task data: It gathers all the info you entered
      setIsLoading(true);

      // It sends the task details to the server using axios.post
      const response = createTask(name, description, start_time, end_time);

      console.log(response.data);
      setSuccessMessage("Task created successfully!");
      // Clear the form fields
      setName("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      // Navigate to the time logs page
      navigate('/timelogs')
    } catch (error) {
      console.error("Error creating task:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="task-input">
      <div className="log-your-task">Log Your Task</div>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter task name"
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            required
          />
        </label>
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={start_time}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={end_time}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskInput;
