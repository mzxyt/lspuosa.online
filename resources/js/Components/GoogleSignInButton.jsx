import React from 'react'

const GoogleSignInButton = ({onClick,className=''}) => {
  
  return (
    <div className={`google-signin-btn ${className}`}>
        <div className="icon">
            <img
                src="/images/google.png"
            />
        </div>
        <button type='button' onClick={onClick}>
            Sign In Google Account
        </button>
    </div>
  )
}

export default GoogleSignInButton