// Wrapper for the routes so that user has to be signed in

import {useAuth} from "../contexts/useAuth.jsx";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export const PrivateRoute = ({children}) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate()

    if(isLoading){
        return <h2>Loading...</h2>
    }
    if(isAuthenticated){
        return children
    } else{
        navigate('/log-in')
    }
}
