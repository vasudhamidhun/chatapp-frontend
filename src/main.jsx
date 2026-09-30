// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import { GoogleOAuthProvider } from "@react-oauth/google";

// console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//     <App />
//   </GoogleOAuthProvider>
// );


//for authcontext

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";

console.log(
  "Google Client ID:",
  import.meta.env.VITE_GOOGLE_CLIENT_ID
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);