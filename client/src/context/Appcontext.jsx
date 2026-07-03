import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Result from "../pages/Result";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const [credit, setCredit] = useState(0);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();

    // This is for gallery images
    const [galleryImages, setGalleryImages] = useState([]);

 const loadCreditsData = async () => {
    try {
        // console.log("Fetching credits with token:", token); // Debug log 1
        const { data } = await axios.get(backendUrl + '/api/user/credits', { 
            headers: { token } 
        });

        // console.log("Full API Response:", data); // Debug log 2

        if (data.success) {
            // MATCH POSTMAN: Postman shows "credits", so use data.credits
            setCredit(data.credits); 
            setUser(data.user);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("API Error:", error); // Check for 401, 404, or 500 errors
        toast.error(error.message);
    }
}

const generateImage = async (prompt) => {
    try {
        const { data } = await axios.post(backendUrl + '/api/image/generate-image',
             { prompt }, { headers: { token } });
             console.log("Backend Raw Response:", data);
             if(data.success){
                loadCreditsData();
                return data.resultImage;
             }
             else{
                loadCreditsData();
                if(data.creditBalance===0){
                    navigate('/buy');
             }
            }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        return false;
}
    }


    // ... existing generateImage function ends here

const fetchGallery = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/image/gallery');
        if (data.success) {
            setGalleryImages(data.images);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error("Gallery Fetch Error:", error);
        toast.error(error.message);
    }
};

// ... existing logout function or useEffect goes below this


    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        toast.success("Logged out successfully!");
    }

    useEffect(() => {
        fetchGallery();
        // console.log("Current Token State:", token); // THIS WILL SHOW IN CONSOLE
        if (token) {
            loadCreditsData();
        } else {
            console.log("Token is missing, skipping fetch.");
        }
    }, [token]);

    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl,
        token, setToken, credit, setCredit, loadCreditsData, logout,
        generateImage,galleryImages, fetchGallery
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
export default AppContextProvider;
