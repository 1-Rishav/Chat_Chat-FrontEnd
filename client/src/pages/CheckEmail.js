import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegCircleUser } from "react-icons/fa6";


function CheckEmail() {
  const [data, setData] = useState({
    email: "",
  });
  
  const navigate = useNavigate()
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
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;
    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      if(response.data.success){
        setData({   
          email: "",   
        })
         navigate('/password',{
          state:response?.data
        }) 
      }
      //console.log(response.data.data)
    } catch (error) {
      toast.error(error.response.data.message, {
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
      <div className="w-fit mx-auto mb-2"><FaRegCircleUser
      size={80}/></div>

        <h3>Near to chat app!</h3>
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
          
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-4 font-bold text-white leading-relaxed tracking-wide">
            Next
          </button>
        </form>
        
      </div>
    </div>
  )
}

export default CheckEmail
