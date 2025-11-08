import { AudioLinesIcon, ArrowRight } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);

    // 🔐 Check if user is logged in (customize this according to your auth logic)
    const isLoggedIn = Boolean(localStorage.getItem('user')); // or use context/auth state

    const logos = [
        'https://img.icons8.com/fluency/48/linkedin.png',
        'https://img.icons8.com/fluency/48/facebook-new.png',
        'https://img.icons8.com/ios/50/ibm.png',
        'https://img.icons8.com/color/48/microsoft.png',
        'https://img.icons8.com/color/48/walmart.png',
        'https://img.icons8.com/color/48/google-logo.png',
    ];

    const handleSmoothScroll = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    // 🎯 Handle Start Interview click
    const handleStartInterview = () => {
        if (isLoggedIn) {
            navigate('app/create-interview');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <div className="min-h-screen pb-20">
                {/* Navbar */}
                <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm">
                    <a href="/">
                        <img src="/logo.svg" alt="logo" className="h-8 w-auto" />
                    </a>

                    <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800">
                        <a href="#" onClick={(e) => handleSmoothScroll(e, '#')} className="hover:text-purple-600 transition">Home</a>
                        <a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="hover:text-purple-600 transition">Features</a>
                        <a href="#testimonials" onClick={(e) => handleSmoothScroll(e, 'testimonials')} className="hover:text-purple-600 transition">Testimonials</a>
                        <a href="#cta" onClick={(e) => handleSmoothScroll(e, 'cta')} className="hover:text-purple-600 transition">Contact</a>
                    </div>

                    <div className="flex gap-2">
                        {/* 👇 Conditional buttons based on login state */}
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login?state=register"
                                    className="hidden md:block px-6 py-2 bg-purple-500 hover:bg-purple-700 active:scale-95 transition-all rounded-full text-white"
                                >
                                    Get started
                                </Link>

                                <Link
                                    to="/login?state=login"
                                    className="hidden md:block px-6 py-2 border active:scale-95 hover:bg-slate-50 transition-all rounded-full text-slate-700 hover:text-slate-900"
                                >
                                    Login
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/app"
                                className="hidden md:flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all rounded-full text-white"
                            >
                                Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Icon */}
                    <button onClick={() => setMenuOpen(true)} className="md:hidden active:scale-90 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="lucide lucide-menu"
                        >
                            <path d="M4 5h16M4 12h16M4 19h16" />
                        </svg>
                    </button>
                </nav>

                <hr className="border-slate-300 w-full" />

                {/* Mobile Menu */}
                <div
                    className={`fixed inset-0 z-[100] bg-black/40 text-black backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <a href="#" className="text-white">Home</a>
                    <a href="#features" className="text-white">Features</a>
                    <a href="#testimonials" className="text-white">Testimonials</a>
                    <a href="#contact" className="text-white">Contact</a>

                    {!isLoggedIn ? (
                        <Link to="/login?state=login" className="text-white">
                            Login / Register
                        </Link>
                    ) : (
                        <Link to="/dashboard" className="text-white">
                            Dashboard →
                        </Link>
                    )}

                    <button
                        onClick={() => setMenuOpen(false)}
                        className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-purple-600 hover:bg-purple-700 transition text-white rounded-md flex"
                    >
                        X
                    </button>
                </div>

                {/* Hero Section */}
                <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black">
                    <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-purple-300 blur-[100px] opacity-30"></div>

                    {/* Headline Section */}
                    <div className="flex items-center mt-24">
                        <div className="flex -space-x-3 pr-3">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user3" className="size-8 object-cover rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user1" className="size-8 object-cover rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user2" className="size-8 object-cover rounded-full border-2 border-white" />
                            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="user5" className="size-8 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <div className="flex">
                                {Array(5).fill(0).map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star text-transparent fill-purple-600" aria-hidden="true">
                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                    </svg>
                                ))}
                            </div>
                            <p className="text-sm text-gray-700">Used by 100+ users</p>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
                        Land your dream job with{' '}
                        <span className="bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
                            AI-powered
                        </span>{' '}
                        interview practices.
                    </h1>

                    <p className="max-w-md text-center text-base my-7">
                        Prepare, practice with real interview questions and instant feedbacks.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleStartInterview}
                            className="flex items-center gap-2 border border-slate-500 hover:border-purple-600 hover:bg-purple-600 hover:text-white cursor-pointer transition rounded-full px-7 h-12 text-slate-700"
                        >
                            <AudioLinesIcon className="size-4" />
                            <span className="font-medium">Start Interview</span>
                        </button>
                    </div>

                    <p className="py-6 text-slate-600 mt-14 mb-4">
                        Trusted by top companies, including
                    </p>

                    <div className="flex flex-wrap justify-between max-sm:justify-center gap-6 max-w-3xl w-full mx-auto py-4 opacity-80" id="logo-container">
                        {logos.map((logo, index) => (
                            <img key={index} src={logo} alt="logo" className="h-10 w-auto max-w-xs" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Font Import */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          * {
            font-family: 'Poppins', sans-serif;
          }
        `}
            </style>
        </>
    );
};

export default Hero;
