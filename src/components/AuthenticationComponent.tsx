import {auth, provider} from "../config/firebase";
import {signInWithPopup} from "firebase/auth";
import { useNavigate} from "react-router-dom";
import '../styles/auth.css';
export const AuthenticationComponent = () => {
    const navigate = useNavigate();
    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, provider);
        const authInfo = {
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            userId: result.user.uid,
            isAuth: true
        }
        localStorage.setItem("auth", JSON.stringify(authInfo));
        console.log(result);
        navigate("/item");
    }
    return (
        <div className="login-page">
            <p>Sign In With Google to Continue</p>
            <button className="login-google-button" onClick={signInWithGoogle}>Login</button>
        </div>
    )
}