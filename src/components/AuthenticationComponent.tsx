import {auth, provider} from "../config/firebase";
import {signInWithPopup} from "firebase/auth";
import { useNavigate} from "react-router-dom";

export const AuthenticationComponent = () => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        navigate("/item");
    }
    return (
        <div className="login-page">
            Authentication Component
            <button className="login-button" onClick={signInWithGoogle}>Login</button>
        </div>
    )
}