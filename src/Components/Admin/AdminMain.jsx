import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import MainSection from "./MainSection";
import AccessDenied from "./AccessDenied";

const AdminMain = ()=>{
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        if(user){
            console.log(user)
            setIsAdmin(user?.isAdmin);
        }
        
    },[])

    if(!isAdmin){
        return(
            <AccessDenied/>
        )
    }

    return(
        <div className="bg-[#FAFAFB] flex">
            {/* <Dashboard/> */}
            <MainSection />
        </div>
    )
}

export default AdminMain;