import React from 'react'

const ContactForm = () => {
  return (
    <div>
        <form>
            <input type="text"  placeholder='Name'/> <br />
            <input type="email"  placeholder='Email'/> <br />
            <textarea name="" id="" placeholder='Message'></textarea> <br />
            <button type='Submit'>Submit</button>
        </form>
    </div>
  )
}

export default ContactForm