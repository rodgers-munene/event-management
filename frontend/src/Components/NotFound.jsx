import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
  return (
    <div>
        <h2>404 | Page not Found</h2>
        <br />
        <button onClick={ () => navigate('/')}>Go To HomePage</button>
    </div>
  )
}

export default NotFound