// components/VastuChatbotToggle.jsx
import React, { useState } from 'react';
import VastuChatbot from '../pages/VastuChatbot';
const VastuChatbotToggle = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isPremium, setIsPremium] = useState(false); 

  return (
    <>
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 bg-[#191970] text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center z-40"
      >
        {showChatbot ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
      {showChatbot && <VastuChatbot onClose={() => setShowChatbot(false)} />}
    </>
  );
};

export default VastuChatbotToggle;