import React from 'react'
import { Lock, Mail, User2Icon, Users2Icon } from 'lucide-react'

const Login = () => {

  const query = new URLSearchParams(window.location.search) /* window.location.search gives the query string part of the URL — that’s the part after the ?, new URLSearchParams(...) 
  turns that query string into an object that makes it easy to extract values.creates an object where you can do query.get('query') to get "register". */
  const urlState = query.get('state') /* This extracts the value of the query parameter from the URL, If the URL was ...?query=login, it would return "login".
  urlState holds whatever was in the URL (like "login" or "register") — or null if it wasn’t provided. */

  const [state, setState] = React.useState(urlState || "login") /* The initial value of the state is: urlState (if it exists) otherwise "login" (as a default) */

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

  }

  const handleChange = (e) => {  /* when any input field gets changed then this function will executed */
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
        <p className="text-gray-500 text-sm mt-2">Please {state} in to continue</p>
        
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color='#6B7280'/>
            <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
          </div>
        
        )}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color='#6B7280' />
          <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
        </div>
        
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color='#6B7280' />
          <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
        </div>
        
        <div className="mt-4 text-left text-purple-500">
          <button className="text-sm" type="reset">Forget password?</button>
        </div>
        
        <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-purple-500 hover:opacity-90 transition-opacity">
          {state === "login" ? "Login" : "Sign up"}
        </button>
        
        <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-purple-500 hover:underline">click here</a></p>
      </form>
    </div>
  )
}

export default Login