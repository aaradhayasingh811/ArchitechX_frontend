// // components/VastuChatbot.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// const VastuChatbot = ({ onClose, isPremium }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [messageCount, setMessageCount] = useState(0);
//   const messagesEndRef = useRef(null);

//   // Initial message
//   useEffect(() => {
//     setMessages([{
//       id: 1,
//       text: "Namaste! I'm your ArchitechX Vastu consultant. How can I help you today? You can ask about directions, room placements, or any Vastu-related questions.",
//       sender: 'bot'
//     }]);
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     // Check message limit for non-premium users
//     if (!isPremium && messageCount >= 2) {
//       setMessages(prev => [...prev, {
//         id: messages.length + 1,
//         text: "You've reached your message limit. Please upgrade to premium to continue chatting with our Vastu consultant.",
//         sender: 'bot'
//       }]);
//       setInput('');
//       return;
//     }

//     const userMessage = {
//       id: messages.length + 1,
//       text: input,
//       sender: 'user'
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);
//     setMessageCount(prev => prev + 1);

//     try {
//       const chatHistory = messages
//         .filter(msg => msg.text)
//         .map(msg => ({
//           role: msg.sender === 'user' ? 'user' : 'assistant',
//           content: msg.text
//         }));
      
//       const response = await axios.post('http://localhost:3006/api/chat', {
//         message: input,
//         chatHistory
//       });

//       // Gemini responses sometimes include markdown formatting
//       const formattedResponse = response.data.reply
//         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
//         .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics

//       const botMessage = {
//         id: messages.length + 2,
//         text: formattedResponse,
//         sender: 'bot'
//       };

//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, {
//         id: messages.length + 2,
//         text: "Sorry, I encountered an error. Please try again.",
//         sender: 'bot'
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden z-50">
//       {/* Chat header */}
//       <div className="bg-[#191970] text-white p-4 flex justify-between items-center">
//         <h3 className="font-semibold text-lg">ArchitechX Vastu Consultant</h3>
//         <button 
//           onClick={onClose} 
//           className="text-white hover:text-blue-200 focus:outline-none"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>
      
//       {/* Chat messages */}
//       <div className="flex-1 p-4 overflow-y-auto bg-blue-50">
//         {messages.map((message) => (
//           <div 
//             key={message.id} 
//             className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div 
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user' 
//                 ? 'bg-blue-600 text-white rounded-br-none' 
//                 : 'bg-white text-gray-800 rounded-bl-none shadow'}`}
//               dangerouslySetInnerHTML={{ __html: message.text }}
//             />
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start mb-4">
//             <div className="bg-white text-gray-800 px-4 py-2 rounded-lg rounded-bl-none shadow">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
//               </div>
//             </div>
//           </div>
//         )}
//         {!isPremium && messageCount >= 2 && (
//           <div className="flex justify-center mb-4">
//             <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">
//               Upgrade to premium for unlimited Vastu consultations and then Login to the Dashboard.
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
      
//       {/* Chat input */}
//       <div className="p-4 border-t border-gray-200 bg-white">
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Ask your Vastu question..."
//             className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             disabled={!isPremium && messageCount >= 2}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={isLoading || !input.trim() || (!isPremium && messageCount >= 2)}
//             className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//               isLoading || !input.trim() || (!isPremium && messageCount >= 2) ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
//             </svg>
//           </button>
//         </div>
//         {!isPremium && (
//           <div className="text-xs text-gray-500 mt-2 text-center">
//             Messages remaining: {2 - messageCount}/2 (Free tier)
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VastuChatbot;

// components/VastuChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import {toast} from "react-toastify"

const VastuChatbot = ({ onClose, isPremium }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestedQuestions = [
    "What is the best direction for the main entrance?",
    "How should I place my bed according to Vastu?",
    "Which colors are good for the living room?",
    "Where should the kitchen be located in a house?"
  ];

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialize messages and voice recognition
  useEffect(() => {
    const savedMessages = localStorage.getItem('vastuChatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{
        id: 1,
        text: "Namaste! I'm your ArchitechX Vastu consultant. How can I help you today?",
        sender: 'bot'
      }]);
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
         toast.error("Speech recognition error");
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
    toast.success('Voice recognition not supported in your browser');
    //   alert('Voice recognition not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!isPremium && messageCount >= 2) {
      setMessages(prev => [...prev, {
        id: messages.length + 1,
        text: "You've reached your message limit. Please upgrade to premium to continue chatting with our Vastu consultant.",
        sender: 'bot'
      }]);
      setInput('');
      return;
    }

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const chatHistory = messages
        .filter(msg => msg.text)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chatbot/api/v1/chat`, {
        message: input,
        chatHistory
      });

      const formattedResponse = response.data.reply
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

      const botMessage = {
        id: Date.now() + 1,
        text: formattedResponse,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
      localStorage.setItem('vastuChatMessages', JSON.stringify([...messages, userMessage, botMessage]));
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (message) => {
    return <div dangerouslySetInnerHTML={{ __html: message.text }} />;
  };

  return (
    <div className={`fixed ${isMobile ? 'inset-0' : 'bottom-6 right-6 max-w-full'} w-full ${isMobile ? '' : 'md:w-96'} h-[${isMobile ? '100vh' : '500px'}] bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 overflow-hidden z-50 animate-fade-in-up`}>
      {/* Chat header */}
      <div className="bg-[#191970] text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold text-lg">ArchitechX Vastu Consultant</h3>
        <button 
          onClick={onClose} 
          className="text-white hover:text-blue-200 focus:outline-none transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-blue-50">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{
              transition: 'all 0.3s ease',
              transform: 'translateY(10px)',
              opacity: 0,
              animation: 'fadeInUp 0.3s forwards',
              animationDelay: `${message.id % 10 * 0.05}s`
            }}
          >
            <div 
              className={`max-w-[80%] md:max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none shadow'}`}
            >
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white text-gray-800 px-4 py-2 rounded-lg rounded-bl-none shadow flex items-center">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {messages.length <= 1 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Try asking:</h4>
            <div className="grid grid-cols-1 gap-2">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => setInput(question)}
                  className="text-left text-sm p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {!isPremium && messageCount >= 2 && (
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">
              Upgrade to premium for unlimited Vastu consultations and then Login to the Dashboard.
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button
            onClick={toggleListening}
            className={`p-2 mr-2 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700'} transition`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your Vastu question or click mic..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={!isPremium && messageCount >= 2}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim() || (!isPremium && messageCount >= 2)}
            className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
              isLoading || !input.trim() || (!isPremium && messageCount >= 2) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {!isPremium && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            Messages remaining: {2 - messageCount}/2 (Free tier)
          </div>
        )}
      </div>
    </div>
  );
};

export default VastuChatbot;