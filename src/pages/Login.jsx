import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


 const API_URL = import.meta.env.VITE_API_URL;
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
         `${API_URL}/api/auth/google`,
        {
          credential: credentialResponse.credential,
        }
      );

      login(
        response.data.user,
        response.data.token
      );

      navigate("/chat");
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.log("Google Login Failed");
        }}
      />
    </div>
  );
}

export default Login;