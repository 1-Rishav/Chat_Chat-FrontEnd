import React from 'react'
import Logo from '../assets/Logo.png'
function AuthLayouts({children}) {
  return (
    <>
    <header className='flex justify-center items-center py-1 h-21 bg-white shadow-md'>
        <img src={Logo} alt="logo" width={160} height={50} />
        </header>
        {children}
        </>
  )
}

export default AuthLayouts