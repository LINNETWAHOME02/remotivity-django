import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { editTask, getTaskById } from '../endpoints/api.js';

const EditTask = () => {
    const { taskId } = useParams();
    const [taskData, setTaskData] = useState({ name: '', description: '', start_time: '', end_time: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch task details
    useEffect(() => {
    const fetchTask = async () => {
        try {
            const response = await getTaskById(taskId);
            const task = response.data;

            // Transform datetime fields to match `datetime-local` format
            const formattedStartTime = new Date(task.start_time).toISOString().slice(0, 16);
            const formattedEndTime = new Date(task.end_time).toISOString().slice(0, 16);

            setTaskData({
                ...task,
                start_time: formattedStartTime,
                end_time: formattedEndTime,
            });
        } catch (error) {
            console.error('Error fetching task:', error);
            setError(error.message);
        }
    };
    fetchTask();
}, [taskId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Ensure proper datetime formatting if needed
        const updatedTaskData = {
            ...taskData,
            start_time: new Date(taskData.start_time).toISOString(),
            end_time: new Date(taskData.end_time).toISOString(),
        };

        await editTask(taskId, updatedTaskData);
        navigate('/timelogs');
    } catch (error) {
        console.error('Error updating task:', error);
        setError(error.message);
    }
};

    if (error) return <div>Error: {error}</div>;

    return (
        <form onSubmit={handleSubmit} style={{marginTop: "25px"}}>
            <div>
                <label>Task Name:</label>
                <input
                    type="text"
                    name="name"
                    value={taskData.name}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Task Description:</label>
                <input
                    type="text"
                    name="description"
                    value={taskData.description}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Start Time:</label>
                <input
                    type="datetime-local"
                    name="start_time"
                    value={taskData.start_time}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>End Time:</label>
                <input
                    type="datetime-local"
                    name="end_time"
                    value={taskData.end_time}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <button type="submit">Update Task</button>
        </form>
    );
};

export default EditTask;