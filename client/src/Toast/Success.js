import { toast } from "react-toastify";
//import React from 'react'

function Success({show}) {
    return(
        toast.success(show, {
            position: "top-center",
            autoClose: 1000,
          })
    )
    
}

export default Success