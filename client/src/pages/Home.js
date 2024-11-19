import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logOut, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import logo from "../assets/Logo.png"
import io from 'socket.io-client';

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(user);
   const fetchUserDetails= async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;

      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      dispatch(setUser(response.data.data));
      if (response.data.data.logOut) {
        dispatch(logOut());
        navigate("/password");
      }
      console.log("Current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  /* Socket connection */
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth:{
        token: localStorage.getItem('token')
      }
    })
    socketConnection.on('onlineUser',(data)=>{
      console.log(data);
      dispatch(setOnlineUser(data))
    })
    dispatch(setSocketConnection(socketConnection))
    return ()=>{
      socketConnection.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
 const basePath = location.pathname === '/'
  return (
    <div className="grid  lg:grid-cols-[300px,1fr] h-screen max-h-screen">
       <section className={`bg-white ${!basePath && 'hidden'} lg:block`}>
        <Sidebar/>
      </section> 
      {/** message component **/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div className={` justify-center items-center flex-col hidden ${!basePath ? "hidden":"lg-flex"}`}>
        <div>
          <img src={logo} width={200} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
      </div>
    </div>
  );
}

export default Home;
