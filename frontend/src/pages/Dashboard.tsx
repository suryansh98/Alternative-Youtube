import "../App.css";
import { Text } from "@/components/retroui/Text";
import { ToggleGroup, ToggleGroupItem } from "@/components/retroui/ToggleGroup";
import { Button } from "@/components/retroui/Button";
import { useState, useEffect } from "react";
import { Card } from "@/components/retroui/Card";
import YouTube from 'react-youtube';
import ReactPlayer from "react-player";

interface SubscriptionItem {
  snippet: {
    title: string;
    resourceId: {
      channelId: string;
    };
    thumbnails: {
      default: { url: string };
    };
  };
}

interface VideoItem {
  id:{
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    thumbnails: {
      default: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [latest10Videos, setLatest10Videos] = useState<VideoItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check authentication status on component mount
  useEffect(() => {  
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // ✅ ADDED: Load videos when switching to home tab
useEffect(() => {
  if (activeTab === "home" && isAuthenticated && !error) {
    get10LatestVideos();
  }
}, [activeTab, isAuthenticated, error]);


  const testBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:3000/", {
        method: "GET",
      });
      if (response.ok) {
        console.log("✅ Backend is running");
        return true;
      } else {
        console.log("❌ Backend responded with error:", response.status);
        return false;
      }
    } catch (error) {
      console.log("❌ Backend connection failed:", error);
      return false;
    }
  };

  const checkAuthStatus = async () => {
    try {
      // First test if backend is running
      const backendRunning = await testBackendConnection();
      if (!backendRunning) {
        setError(
          "Backend server is not running. Please start the backend server."
        );
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/auth/status", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (!data.authenticated) {
          setError("Please log in to continue");
          // Don't auto-redirect, let user choose
        }
      } else {
        setIsAuthenticated(false);
        setError("Please log in to continue");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setError(
        "Cannot connect to backend server. Please ensure it's running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to login or home page
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:3000/api/youtube/subscriptions",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Subscriptions:", data);
        setSubscriptions(data.items || []);
      } else if (response.status === 401) {
        setError("Please log in to view subscriptions");
        // Redirect to login
        window.location.href = "http://localhost:3000/auth/google";
      } else {
        setError("Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };


   const get10LatestVideos = async () => {
     try {
       setLoading(true);
       setError("");
      console.log(latest10Videos);
    if (latest10Videos.length === 0){
      const response = await fetch(
        "http://localhost:3000/api/youtube/latest-videos",
        {
          method: "GET",
          credentials: "include",
        }
      );

       if (response.ok) {
         const data = await response.json();
         console.log("Top 10 Videos:", data);
         setLatest10Videos(data.items || []);
       } else if (response.status === 401) {
         setError("Please log in to view your Random 10 videos");
         // Redirect to login
         window.location.href = "http://localhost:3000/auth/google";
       } else {
         setError("Failed to fetch Random 10 Videos");
       }
    }
     } catch (error) {
       console.error("Error fetching subscriptions:", error);
       setError("Network error occurred");
     } finally {
       setLoading(false);
     }
   };
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        {/* Left side - Logo and Navigation */}
        <div className="navbar-left">
          <Text as="h4" className="text-xl font-bold">
            Minimalistic YouTube
          </Text>

          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={setActiveTab}
            className="navbar-nav"
          >
            <ToggleGroupItem value="home" className="px-4 py-2">
              Home
            </ToggleGroupItem>
            <ToggleGroupItem
              value="subscriptions"
              className="px-4 py-2"
              onClick={getSubscriptions}
            >
              Subscriptions
            </ToggleGroupItem>
            <ToggleGroupItem value="liked" className="px-4 py-2">
              Liked Videos
            </ToggleGroupItem>
            <ToggleGroupItem value="playlists" className="px-4 py-2">
              Playlists
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Right side - User actions */}
        <div className="navbar-right">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="px-4 py-2"
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Main content area */}
      <div className="container mx-auto p-4">
        {/* Show loading state */}
        {loading && (
          <div className="text-center py-8">
            <Text as="h3">Loading...</Text>
          </div>
        )}

        {/* Show error state with backend connection issues */}
        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <Text as="h3" className="font-bold mb-2">
              Connection Error
            </Text>
            <Text as="p" className="mb-4">
              {error}
            </Text>

            {!isAuthenticated && (
              <Button
                onClick={() =>
                  (window.location.href = "http://localhost:3000/auth/google")
                }
                className="mr-2"
              >
                Login with Google
              </Button>
            )}

            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Main content - only show when not loading and no errors */}
        {!loading && !error && (
          <>
            {activeTab === "home" && (
              <div>
                <Text as="h3" className="mb-4">
                  Latest Videos from Your Subscriptions
                </Text>

                {loading && <Text as="p">Loading latest videos...</Text>}

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <Text as="p">Error: {error}</Text>
                    <Button
                      onClick={get10LatestVideos}
                      className="mt-2"
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {!loading && !error && latest10Videos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {latest10Videos.map((video, index) => (
                      <Card
                        key={`video-${index}`}
                        className="overflow-hidden"
                      >
                        <Card.Header className="p-0">
                          {/* Video Thumbnail */}

                          <ReactPlayer
                            src={`https://www.youtube.com/watch?v=${video?.id?.videoId}`}
                            style={{
                              width: "100%",
                              height: "auto",
                              aspectRatio: "16/9",
                            }}
                          />
                        </Card.Header>
                        <Card.Content className="p-4">
                          <Card.Title className="text-sm font-semibold line-clamp-2 mb-2">
                            {video.snippet.title}
                          </Card.Title>
                          {/* <Card.Description className="text-xs text-gray-600 mb-2">
                            Channel:
                            
                          </Card.Description> */}
                          {/* <Card.Description className="text-xs text-gray-500">
                            Published:{" "}
                            {new Date(
                              video.snippet.publishedAt
                            ).toLocaleDateString()}
                          </Card.Description> */}
                        </Card.Content>
                      </Card>
                    ))}
                  </div>
                ) : !loading && !error ? (
                  <div className="text-center py-8">
                    <Text as="p" className="mb-4">
                      No latest videos found.
                    </Text>
                    <Button
                      onClick={get10LatestVideos}
                      className="mt-2"
                      variant="outline"
                    >
                      Load Latest Videos
                    </Button>
                  </div>
                ) : null}
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div>
                <Text as="h3" className="mb-4">
                  Subscriptions
                </Text>

                {loading && <Text as="p">Loading subscriptions...</Text>}

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <Text as="p">Error: {error}</Text>
                    <Button
                      onClick={getSubscriptions}
                      className="mt-2"
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {!loading && !error && subscriptions.length > 0 ? (
                  <ul>
                    {subscriptions.map((sub) => (
                      <li
                        key={sub.snippet.resourceId.channelId}
                        className="mb-2 p-2 border rounded"
                      >
                        <Text as="p" className="font-semibold">
                          {sub.snippet.title}
                        </Text>
                      </li>
                    ))}
                  </ul>
                ) : !loading && !error ? (
                  <div>
                    <Text as="p">No subscriptions found.</Text>
                    <Button
                      onClick={getSubscriptions}
                      className="mt-2"
                      variant="outline"
                    >
                      Load Subscriptions
                    </Button>
                  </div>
                ) : null}
              </div>
            )}

            {activeTab === "liked" && (
              <div>
                <Text as="h3" className="mb-4">
                  Liked Videos
                </Text>
                {/* Add liked videos content here */}
              </div>
            )}

            {activeTab === "playlists" && (
              <div>
                <Text as="h3" className="mb-4">
                  Playlists
                </Text>
                {/* Add playlists content here */}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
