import React from 'react'
import { RotatingLines } from 'react-loader-spinner'
function Loading() {
  return (
    <div className="loader-container"><RotatingLines    
    visible={true}
    height="45"
    width="45"
    color="grey"
    strokeWidth="5"
    animationDuration="0.75"
    ariaLabel="rotating-lines-loading"
    wrapperStyle={{}}
    wrapperClass=""
    /></div>
  )
}

export default Loading