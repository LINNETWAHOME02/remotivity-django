import axios from 'axios'

// Get the urls for all the apis we are calling from the backend
const BASE_URL = 'http://127.0.0.1:8000/api/'
const LOGIN_URL = `${BASE_URL}signin/`
const TASKS_URLS = `${BASE_URL}getTasks/` // Get tasks
const REFRESH_URL = `${BASE_URL}token/refresh/`
const LOGOUT_URL = `${BASE_URL}logout/`
const AUTH_URL = `${BASE_URL}is_authenticated/`
const REGISTER_URL = `${BASE_URL}signup/`
const CREATE_TASK_URL = `${BASE_URL}create_tasks/`

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const accessToken = await JSON.parse(localStorage.getItem('token'));
        const response = await axios.delete(`${TASKS_URLS}${taskId}/delete/`,
            {withCredentials: true,
                headers: {
                'Authorization': `Token ${accessToken}`
            }});
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error.response.data);
        throw error;
    }
};

// Edit the task
export const editTask = async (taskId, taskData) => {
    try {
        const accessToken = JSON.parse(localStorage.getItem('token'));
        const response = await axios.put(
            `${TASKS_URLS}${taskId}/update/`,
            taskData, // Pass the actual task data to update
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Token ${accessToken}`,
                    'Content-Type': 'application/json', // Ensure content type is JSON
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error editing task:', error.response?.data || error.message);
        throw error;
    }
};

// Get specific task to be updated
export const getTaskById = async (taskId) => {
    try {
        const accessToken = JSON.parse(localStorage.getItem('token'));
        const response = await axios.get(`${TASKS_URLS}${taskId}/`, {
            withCredentials: true,
            headers: {
                'Authorization': `Token ${accessToken}`,
            },
        });
        return response;
    } catch (error) {
        console.error('Error fetching task:', error.response?.data || error.message);
        throw error;
    }
};

export const login = async (username, password) => {
        const response = await axios.post(
        LOGIN_URL,
        // Send the username, password along with this post request
        {username: username, password: password},
        // Send with credentials, cookies, as well
        {withCredentials: true}
        )
        return response

}

export const refresh_token = async () => {
    try{
        // Call the refresh token api to get a new access token
        await axios.post(REFRESH_URL,
        // Anybody can get one
        {},
        {withCredentials : true}
        )
        return true
    } catch(error){
        return error
    }
}

export const get_task = async () => {
    try{
        const accessToken = await JSON.parse(localStorage.getItem('token'));
        const response = await axios.get(TASKS_URLS,
            {withCredentials: true,
                headers: {
                'Authorization': `Token ${accessToken}`
            }}
            )

        return response
    } catch (error){
        return call_refresh(error, axios.get(TASKS_URLS, {withCredentials: true}))
    }
}

// local function to call the refresh function
const call_refresh = async (error, func) => {
    // If there's an error, an 401 unauthorized error
    if (error.response && error.response.status === 401){
        // Check if the token was successfully refreshed or not
        const refreshedToken = await refresh_token()

        // If it was refreshed
        if(refreshedToken){
            // retry response
            const retryResponse = await func()
            return retryResponse.data
        }
    }
    // If it's not a 401 error
    return false
}

export const logout = async () => {
    try{
        await axios.post(LOGOUT_URL,{},{withCredentials: true})
        return true
    } catch (error){
        return error
    }
}

export const is_authenticated = async () => {
    try{
        const accessToken = await JSON.parse(localStorage.getItem('token'));
        return await axios.post(AUTH_URL, {},
            {withCredentials: true,
                headers: {
                    'Authorization': `Token ${accessToken}`
                }})
    } catch(error){
        console.log(error)
        return error
    }
}

// Create a new user
export const register_user = async (username, email, password) => {
    try{
        const accessToken = await JSON.parse(localStorage.getItem('token'));
        const response = await axios.post(REGISTER_URL,
            {username: username,
                email: email,
                password: password},
            {withCredentials: true,
                headers: {
                    'Authorization': `Token ${accessToken}`
                }
            })
        return response
    } catch (error){
        return error
    }
}

// Create a new task
export const create_task = async (name, description, start_time, end_time) => {
    try{
        const accessToken = await JSON.parse(localStorage.getItem('token'));
        const response = await axios.post(CREATE_TASK_URL,
            {name: name,
                description: description,
                start_time: start_time,
                end_time: end_time
                },
            {withCredentials: true,
            headers: {
                'Authorization': `Token ${accessToken}`
            }})
        return response.data
    } catch (error){
        return error
    }
}