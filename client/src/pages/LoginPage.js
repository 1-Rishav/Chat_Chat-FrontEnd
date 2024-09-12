import React, {  useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

function CheckEmail() {
  const [data, setData] = useState({
    email:"",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
   /* useEffect(() => {
    if (!location.state?.data?.name) {
      navigate("/email");
    }
  }, []); */  
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
    try {
      const response = await axios({
        method: "post",
        url:URL,
        data:{
        email:data.email,
          password:data.password
        },
        withCredentials:true
      });
      
      toast.success("Welcome to CHAT_CHAT!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
     
      if (response.data.success) {
          dispatch(setToken(response?.data?.token))
      localStorage.setItem('token',response?.data?.token)  
        setData({
          email:"",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error)
       toast.error(error.response.data.message , {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }); 
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full  max-w-md rounded overflow-hidden p-3 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.data?.name}
            imageUrl={location?.state?.data?.profile_pic}
          />
          <h2 className="font-semibold text-lg m-1">
            {location?.state?.data?.name}
          </h2>
        </div>

        <h3 className="text-green-600 font-bold"> Welcome to CHAT_CHAT!</h3>
        <form className="grid gap-3 m-2 " onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="p-1">
              Email :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-3 py-1 focus:outline-primary"
              autoComplete="off"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div> 

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="p-1">
              Password :
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-3 py-1 focus:outline-primary"
              autoComplete="off"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <p className="text-red-700 text-right">
          <Link
            to={"/forgot-password"}
            className="hover:text-secondary font-semibold"
          >      
            Forgot password
          </Link>
          </p>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-4 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        
           <p className="m-3 text-center">
          Create Account ?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        
        </p> 
      </div>
    </div>
  );
}

export default CheckEmail;
