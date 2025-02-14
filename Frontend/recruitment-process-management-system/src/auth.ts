import {jwtDecode} from "jwt-decode";

export  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if token exists, false otherwise
  };



  export const isRoleAllowed = (allowedRoles:any) => {
    // Get the token from local storage
    const token = localStorage.getItem("token");
  
    if (!token) {
      return false; // No token means user is not authenticated
    }
  
    try {
      // Decode the token to get the user's role
      const decodedToken:any = jwtDecode(token);
      const userRole =decodedToken.role ;
      console.log(decodedToken)
  
      // Check if the user's role is included in the allowed roles
      return allowedRoles.includes(userRole);
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // Invalid token
    }
  };


  export const loggedinUser = () => {
    // Get the token from local storage
    const token = localStorage.getItem("token");
  
    if (!token) {
      return null; // No token means user is not authenticated
    }
  
    try {
      // Decode the token to get the user's role
      const decodedToken:any = jwtDecode(token);
  
      // Check if the user's role is included in the allowed roles
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // Invalid token
    }
  };