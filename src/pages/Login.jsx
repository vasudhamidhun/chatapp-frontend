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
    console.log("1. Google credential received");

    const response = await axios.post(
      `${API_URL}/api/auth/google`,
      {
        credential: credentialResponse.credential,
      }
    );

    console.log("2. Backend response:", response.data);

    login(
      response.data.user,
      response.data.token
    );

    console.log(
      "3. Token after login:",
      localStorage.getItem("token")
    );

    console.log(
      "4. User after login:",
      localStorage.getItem("user")
    );

    navigate("/chat");

    console.log("5. Navigation called");
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