import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // This helps draw the chart
import {get_task} from "../../endpoints/api.js";

// This is like the brain that knows how to draw chart
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// tell the brain what kind of chart we want (a bar chart in this case)
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartsPage = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Productivity Hours',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    // This goes to the server (axios.get(...)) and brings back tasks (work sessions)
    const fetchTimeLogs = async () => {
      try {
        const response = get_task()
        const tasks = response.data;

        // Process tasks data to generate chart labels and data
        const labels = tasks.map((task) => new Date(task.startTime).toLocaleDateString());
        // Calculate work hours: For each task, it calculates how many hours were worked by looking at the start and end times
        const data = tasks.map((task) => {
          const startTime = new Date(task.startTime);
          const endTime = new Date(task.endTime);
          const hours = (endTime - startTime) / (1000 * 60 * 60); 
          return hours > 0 ? hours : 0;
        });

        // Update chart data state
        // setChartData: We tell the chart what to show
        setChartData({
          labels: labels, // 
          datasets: [
            {
              // The labels (dates) and data (hours) are put into the chart
              label: 'Productivity Hours',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching time logs:', error);
      }
    };

    fetchTimeLogs();
  }, []);

  return (
    <div style={{ width: '70%', margin: 'auto' }}>
      <h2>Productivity Chart</h2>
      <Bar // Bar: This is the tool that draws the bar chart
        data={chartData}
        // Chart options: We make the chart look nice with titles and legends
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'User Productivity Over Time',
            },
          },
        }}
      />
    </div>
  );
};

export default ChartsPage;
