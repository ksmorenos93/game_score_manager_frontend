// app/with-auth.js

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
      const token = sessionStorage.getItem("token");

      if (token) {
        try {
          // Decode the base64 token
          const decodedToken = JSON.parse(atob(token));
          
          // Check if the token has expired
          if (decodedToken.exp > new Date().getTime()) {
            // Token is valid
            setIsAuthenticated(true);
          } else {
            console.log(`Token has expired, redirecting to login.`);
            sessionStorage.removeItem("token");
            router.push("/login");
          }
        } catch (error) {
          console.log(`Failed to decode token, redirecting to login.`);
          sessionStorage.removeItem("token");
          router.push("/login");
        }
      } else {
        console.log(`Token does not exist, redirecting to login.`);
        router.push("/login");
      }
    }, [router]);
    
    if (!isAuthenticated) {
      return null; // Optionally show a loading indicator here
    }
    
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;