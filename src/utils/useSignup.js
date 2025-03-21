import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "./url";

const useSignup = ()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
  
    const signup = async (userData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      console.log(userData);
      
      try {
        const response = await axios.post(`${BACKEND_URL}/user/signup`, userData);
        setSuccess(true);
        // You can also return response data or handle it as needed
      } catch (err) {
        console.log(err);
        setError(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };
  
    return { signup, loading, error, success, setSuccess, setError};
}
export default useSignup;