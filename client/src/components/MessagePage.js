import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { IoMdVideocam } from "react-icons/io";
import uploadFile from "../helpers/uploadFiles";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Loading from "./Loading";
import bg from "../assets/whatsapp bg.png"
import { IoMdSend } from "react-icons/io";
import moment from "moment";


function MessagePage() {
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
const [loading , setLoading] = useState(false);
const [allMessage,setAllMessage] = useState([])
const currentMessage = useRef(null)
useEffect(()=>{
  if(currentMessage.current){
    currentMessage.current.scrollIntoView({behavior:'smooth',block:'end'})
  }
},[allMessage])
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);

    setMessage((prev) => {
      return { ...prev, imageUrl: uploadPhoto?.url };
    });
    setLoading(false);
    setOpenImageVideoUpload(false)
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);

    setMessage((prev) => {
      return { ...prev, videoUrl: uploadPhoto?.url };
    });
    setLoading(false);
    setOpenImageVideoUpload(false)
  };
  const handleClearUploadPhoto = () => {
    setMessage((prev) => {
      return { ...prev, imageUrl: "" };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return { ...prev, videoUrl: "" };
    });
  };
  const handleOnChange=(e)=>{
    const {name , value} = e.target
    setMessage((prev)=>{
      return{
        ...prev,text:value
      }
    });
  }
  const handleSendMessage=(e)=>{
    e.preventDefault();
    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit('new message',{
          sender:user?._id,
          receiver : params.userId,
          text:message.text,
          imageUrl:message.imageUrl,
          videoUrl:message.videoUrl,
          msgByUserId: user._id
        })
        setMessage({
          text: "",
    imageUrl: "",
    videoUrl: "",
        })
      }
    }
  }
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit('seen',params.userId)
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      socketConnection.on('message',(data)=>{
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  return (
    <div style={{backgroundImage:`url(${bg})`}} className="bg-no-repeat bg-cover z-20">
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4 ">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className=" -my-1  text-sm ">
              {dataUser.online ? (
                <span className="text-primary">Online</span>
              ) : (
                <span className="text-slate-400 ">Offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* Show all message */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-auto scrollbar relative bg-slate-200 bg-opacity-50'>
        
        {/* All message show */}
        <div className="flex flex-col gap-2 py-2 mx-2 " ref={currentMessage}>
          {
            allMessage.map((msg,index)=>{
              return(
                <div  className={` p-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md py-2 ${user._id===msg.msgByUserId? "ml-auto bg-teal-100":"bg-white"}` }>
                  <div className="w-full">
                    {
                      msg?.imageUrl &&(
                        <img src={msg?.imageUrl} alt="img" className="w-full h-full object-scale-down" />
                      )
                    }
                  
                    {
                      msg?.videoUrl &&(
                        <video src="{msg?.videoUrl}" className="w-full h-full object-scale-down" controls></video>
                      )
                    }
                  </div>

                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>

        {/* Upload image display */}
        {message.imageUrl && (
          <div className="w-full sticky bottom-0 h-full  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 top-0 right-0 absolute cursor-pointer hover: text-red-600"
              onClick={handleClearUploadPhoto}
            >
              <IoIosCloseCircleOutline size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                width={300}
                height={300}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className="w-full sticky bottom-0 h-full  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 top-0 right-0 absolute cursor-pointer hover: text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoIosCloseCircleOutline size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down "
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {
          loading && (
            <div className=" sticky bottom-50 -top-10">
<Loading/>
            </div>
            
          )
        }

              </section>
      {/* Send message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white"
          >
            <FaPlus size={20} />
          </button>
          {/* Video and image */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-12 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-100 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>

                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-100 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <IoMdVideocam size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadVideo}
                  className="center"
                />
              </form>
            </div>
          )}
        </div>
        {/* input box */}
        <form className="h-full w-full flex gap-2" >
        
          <input type="text" placeholder="Type your message" 
          className="py-1 px-4 outline-none w-full h-full"
          value={message.text}
          onChange={handleOnChange}/>
        <button onClick={handleSendMessage}>
          <IoMdSend size={28} className="text-primary hover:text-secondary"/>
        </button>
        </form>
        
      </section>
    </div>
  );
}

export default MessagePage;
