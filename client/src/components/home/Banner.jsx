import React, { useState, useEffect } from 'react'

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after 2 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Hide banner after 9 seconds (2s delay + 7s display)
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {/* Spacer div that pushes content down */}
      <div
        className={`transition-all duration-500 ${
          isVisible ? 'h-12' : 'h-0'
        }`}
      />
      
      {/* Banner */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 w-full py-2.5 font-medium text-sm text-purple-800 text-center bg-gradient-to-r from-[#cc60ec] to-[#dcf3ee] transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <p>
          <span className="px-3 py-1 rounded-lg text-white bg-purple-600 mr-2">
            New
          </span>
          specially curated DSA sheet
        </p>
      </div>
    </>
  )
}

export default Banner