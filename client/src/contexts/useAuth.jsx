// Only allow authenticated user to create tasks, view time logs and charts
import {createContext, useContext, useEffect, useState} from "react";
import {is_authenticated, login, register_user, create_task} from "../endpoints/api.js";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext()

// To be used to wrap the whole App so we can use our useAuth
// eslint-disable-next-line react/prop-types
export const AuthProvider = ({children}) => {
    //Global variable
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    // Function to check if user is authenticated by calling and checking the api
    const getAuthenticated = async () => {
        try{
            // Call the api
            const success = await is_authenticated()
            setIsAuthenticated(success)
        } catch{
            setIsAuthenticated(false)
        } finally {
            // When we receive a response from either try(success) or catch(error)
            setIsLoading(false)
        }
    }

    // Log in the user when their details are validated
    const login_user = async(username, password) => {
        const success = await login(username, password)
        if (success){
            setIsAuthenticated(true)
            navigate('/tasks')
        }
    }

    // Register the user when their details are validated
    const register = async (username, email, password) => {
        const response = await register_user(username, email, password)
        return response.data
    }

    // Create a task
    const createTask = async (name, description, start_time, end_time) => {
        try{
            const response = await create_task(name, description, start_time, end_time)
            return response.data
        } catch (error) {
            return error
        }
    }

    //Check if user is authenticated everytime a page loads in a new url
    useEffect(() => {
        getAuthenticated()
    }, []);
    return(
        // Pass the values w to be used in the components/private_route.js
        <AuthContext.Provider value={{isAuthenticated, isLoading, login_user, register, createTask}}>
            {children}
        </AuthContext.Provider>
    )
}


// To be used to access all our values ie IsAuthenticated, isLoading
export const useAuth = () => useContext(AuthContext)