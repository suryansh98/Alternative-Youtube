import "./App.css";
import { Text } from "@/components/retroui/Text";
import { Button } from "./components/retroui/Button";
import { Card } from "./components/retroui/Card";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  // Check authentication status on app load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/status", {
        method: "GET",
        credentials: "include", //to include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setLoginStatus(data?.authenticated);
      } else {
        setLoginStatus(false);
      }
    } catch (error) {
      console.log("Auth Failed: ", error);
      setLoginStatus(false);
    }
  };
  const handleLogin = async () => {
  
    // const windowFeatures =
    //  ;

    // const handle = window.open(
    //   "http://localhost:3000/auth/google",
    //   "google-oauth",
    //    "popup=yes,width=500,height=600,top=100,left=100,resizable=yes,scrollbars=yes"
    // );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          loginStatus ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Card className="w-100 items-center justify-center flex flex-col mx-auto my-20">
              <Card.Header>
                <Card.Title>Minimalistic Youtube</Card.Title>
                <hr className="border-t border-gray-1000" />
                <Card.Description>
                  A simple and minimalistic YouTube clone built with React,
                  TypeScript, and Vite.
                </Card.Description>
              </Card.Header>
              <div className="flex items-center justify-center flex-col space-y-4 my-40 ">
                <Button onClick={() =>{
                  window.open(
                    "http://localhost:3000/auth/google",
                    "googleAuth",
                    "width=500,height=600,left=200,top=200,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
                  );
                }}>Login with Google</Button>
              </div>
              <Text as="h5">Made with ❤️ by Luci</Text>
            </Card>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          loginStatus ? (
            <Dashboard />
          ) : (
            // If user tries to access dashboard without login, redirect to login page
            <Navigate to="/" replace />
          )
        }
      />
      {/* Add a fallback route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
