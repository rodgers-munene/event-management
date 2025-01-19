import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'

const Error = () => {
    const Error = useRouteError()
    const navigate = useNavigate()
  return (
    <div className='job-details'>
        <h3>An Error Occurred</h3>
<p>{Error.message}</p>
<button onClick={ () => navigate('/')}>Go To HomePage</button>
    </div>
  )
}

export default Error