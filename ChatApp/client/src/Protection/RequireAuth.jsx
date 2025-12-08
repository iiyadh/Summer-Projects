import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import { useEffect , useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";


const RequireAuth = ({ children }) => {
    const [loading , setLoading] = useState(false);
    const { verifAuth , token } = useAuthStore();
    const isAuthenticated = !!token;

    const verify = async () => {
        setLoading(true);
        await verifAuth();
        setLoading(false);
    }

    useEffect(()=>{
        verify();
    },[]);

    if(loading) {
        return <LoadingOutlined style={{fontSize: 72,fontWeight:'bolder',color: "#fff" }} spin />
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default RequireAuth;