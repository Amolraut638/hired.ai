import React from 'react';
import { Lock, Mail, User2Icon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlState = searchParams.get('state');

  const [state, setState] = React.useState(urlState || "login");
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  // If already logged in, redirect to dashboard
/*   React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]); */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state === "login") {
      // Mock login - in real app, validate credentials
      login({
        name: formData.email.split('@')[0], // Use email username as name
        email: formData.email
      });
    } else {
      // Mock signup
      signup({
        name: formData.name,
        email: formData.email
      });
    }

    // Reset form
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
        
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Please {state === "login" ? "login" : "sign up"} to continue
        </p>
        
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color='#6B7280'/>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              className="border-none outline-none ring-0 w-full" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
        )}
        
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={13} color='#6B7280' />
          <input 
            type="email" 
            name="email" 
            placeholder="Email id" 
            className="border-none outline-none ring-0 w-full" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color='#6B7280' />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className="border-none outline-none ring-0 w-full" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        {state === "login" && (
          <div className="mt-4 text-left text-purple-500">
            <button className="text-sm" type="button">Forget password?</button>
          </div>
        )}
        
        <button type="submit" className="mt-4 w-full h-11 rounded-full text-white bg-purple-500 hover:opacity-90 transition-opacity">
          {state === "login" ? "Login" : "Sign up"}
        </button>
        
        <p className="text-gray-500 text-sm mt-3 mb-11">
          {state === "login" ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            type="button"
            onClick={() => setState(prev => prev === "login" ? "register" : "login")} 
            className="text-purple-500 hover:underline"
          >
            click here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;