import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Info,
  MousePointerClick,
  Mail,
  UserPlus,
  Phone,
  MapPin,
  CreditCard,
  Menu,
  X,
  User,
  MessageCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
  Zap,
  Award,
  Shield,
} from "lucide-react";
import { Mic, Send } from "lucide-react";
import logo from "../assets/logo-home.png";
import action from "../assets/action.mp4";
import thumbnail from "../assets/thumbail.png";
import { useNavigate } from "react-router-dom";
import ContactSection from "../components/ContactSection";
import VastuChatbotToggle from "../components/VastuChatbotToggle";

const testimonialsData = [
  {
    name: "Jessica Brown",
    feedback:
      "ArchitechX transformed how I design homes. The 3D modeling and interactive features made everything so simple and enjoyable!",
    role: "Interior Designer",
    rating: 5,
  },
  {
    name: "Michael Lee",
    feedback:
      "The perfect tool for architects and home enthusiasts alike. The subscription plans offer great value with advanced options.",
    role: "Architect",
    rating: 5,
  },
  {
    name: "Samantha Smith",
    feedback:
      "Customer support was fantastic and the platform's ease of use helped me create my dream layout in no time.",
    role: "Homeowner",
    rating: 4,
  },
];

const features = [
  {
    title: "Intuitive Design",
    description:
      "User-friendly interface that makes home design accessible to everyone",
    icon: <MousePointerClick className="text-blue-600" size={24} />,
  },
  {
    title: "3D Visualization",
    description: "See your designs come to life with realistic 3D rendering",
    icon: <Zap className="text-blue-600" size={24} />,
  },
  // {
  //   title: "Collaboration Tools",
  //   description: "Work with your team or family members in real-time",
  //   icon: <User className="text-blue-600" size={24} />,
  // },
  {
    title: "Professional Quality",
    description:
      "Export industry-standard files for contractors and architects",
    icon: <Award className="text-blue-600" size={24} />,
  },
];

const FAQ = [
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, we offer a 14-day free trial with access to all basic features.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time with no cancellation fees.",
  },
  {
    question: "What file formats can I export?",
    answer:
      "We support PDF, PNG, GLTF, and DWG exports depending on your subscription level.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We use industry-standard encryption and security practices to protect your designs and data.",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Smooth scroll handler
  const scrollToSection = (id) => {
    setMenuOpen(false);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Enhanced Navbar with scroll effect */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          {/* Logo */}
          <div
            className="text-2xl font-extrabold text-blue-700 cursor-pointer select-none flex items-center"
            onClick={() => scrollToSection("landing")}
          >
            <img src={logo} alt="ArchitechX Logo" className="h-8 mr-2" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium items-center">
            {[
              { label: "Home", id: "landing" },
              // { label: "Features", id: "features" },
              { label: "About", id: "about" },
              { label: "Pricing", id: "subscription" },
              { label: "Testimonials", id: "testimonials" },
              { label: "FAQ", id: "faq" },
              { label: "Contact", id: "contact" },
            ].map(({ label, id }) => (
              <li
                key={id}
                className={`hover:text-blue-600 cursor-pointer transition ${
                  isScrolled ? "py-2" : "py-3"
                }`}
                onClick={() => scrollToSection(id)}
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className={`px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-blue-700 hover:bg-blue-100 rounded"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md border-t border-gray-200">
            <ul className="flex flex-col space-y-4 p-6 text-gray-700 font-semibold">
              {[
                { label: "Home", id: "landing" },
                { label: "Features", id: "features" },
                { label: "About", id: "about" },
                { label: "Pricing", id: "subscription" },
                { label: "Testimonials", id: "testimonials" },
                { label: "FAQ", id: "faq" },
                { label: "Contact", id: "contact" },
              ].map(({ label, id }) => (
                <li
                  key={id}
                  className="hover:text-blue-600 cursor-pointer text-lg"
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </li>
              ))}

              {/* Auth Buttons Mobile */}
              <li className="pt-4 border-t border-gray-300">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full mb-3 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <VastuChatbotToggle />

      {/* Add top padding so content isn't hidden under fixed navbar */}
      <div className="pt-24">
        {/* Landing / Hero */}
        <section
          id="landing"
          className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10 md:gap-20"
        >
          <div className="max-w-xl z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Design Your Dream Home{" "}
              <span className="text-blue-300">Effortlessly</span>
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Create stunning 2D & 3D home designs with our intuitive platform.
              Perfect for homeowners, architects, and interior designers alike.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-white text-blue-600 font-semibold rounded px-6 py-3 shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                <UserPlus size={20} /> Start Free Trial
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="bg-transparent border-2 border-white text-white font-semibold rounded px-6 py-3 hover:bg-white hover:text-blue-600 transition flex items-center justify-center gap-2"
              >
                <Info size={20} /> Learn More
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "women" : "men"
                    }/${i + 20}.jpg`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <div className="flex space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-blue-100">Trusted by 10+ persons</p>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-md hidden md:block">
            <img
              src="https://img.freepik.com/free-vector/home-design-illustration_1284-9033.jpg?uid=R156714607&ga=GA1.1.1646366203.1721816203&semt=ais_items_boosted&w=740"
              alt="Architect working on blueprint"
              className="w-full rounded-xl shadow-2xl z-10 relative"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 bg-blue-500 w-full h-full rounded-xl z-0"></div>
          </div>
        </section>

        {/* Trusted By Section */}
        {/* <section className="py-8 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-gray-500 mb-6">TRUSTED BY LEADING COMPANIES</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company, i) => (
                <div key={i} className="text-gray-400 font-bold text-xl opacity-70 hover:opacity-100 transition">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        <section id="features" className="py-16 px-6 md:px-20 bg-blue-50">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto text-gray-600">
              Everything you need to design, visualize, and share your
              architectural projects
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ title, description, icon }, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-16 px-6 md:px-20 bg-white text-gray-800"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <img
                src="https://img.freepik.com/free-vector/apartment-interior-plan-flat-isometric-profession-concept-site-indoor-walls-furniture-objects-flat-rooms-creative-architecture-design-collection_126523-2071.jpg?uid=R156714607&ga=GA1.1.1646366203.1721816203&semt=ais_items_boosted&w=740"
                alt="Architectural design"
                className="w-full rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold">About ArchitechX</h2>
              <p className="text-lg leading-relaxed text-gray-600">
                ArchitechX empowers you to create detailed 2D layouts and
                immersive 3D home models with ease. Our interactive platform
                brings your vision to life, letting you explore and customize
                every corner of your future home.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Intuitive drag-and-drop interface</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Real-time 3D rendering</span>
                </li>
                {/* <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Collaboration tools for teams</span>
                </li> */}
                <li className="flex items-start gap-3">
                  <Check className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Professional-grade export options</span>
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("try")}
                className="mt-4 bg-blue-600 text-white font-semibold rounded px-6 py-3 hover:bg-blue-700 transition flex items-center gap-2"
              >
                <MousePointerClick size={20} /> Try It Now
              </button>
            </div>
          </div>
        </section>

        {/* Vastu Chatbot Section */}
        <section
  id="vastu-chatbot"
  className="py-16 px-6 md:px-20 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white"
>
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
    <div className="md:w-1/2">
      <div className="bg-white/20 p-3 rounded-full w-max mb-6 backdrop-blur-sm">
        <Shield size={32} className="text-blue-200" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        AI-Powered Vastu Consultant
      </h2>
      <p className="text-lg mb-6 text-blue-100">
        Get personalized Vastu advice for your home instantly with our
        AI chatbot. Our expert-trained system provides recommendations
        based on ancient Vastu principles combined with modern
        architectural knowledge.
      </p>
      <ul className="space-y-3 mb-8">
        <li className="flex items-start gap-3">
          <Check className="text-blue-200 mt-1 flex-shrink-0" />
          <span>Instant analysis of your home layout</span>
        </li>
        <li className="flex items-start gap-3">
          <Check className="text-blue-200 mt-1 flex-shrink-0" />
          <span>Personalized recommendations for improvement</span>
        </li>
        <li className="flex items-start gap-3">
          <Check className="text-blue-200 mt-1 flex-shrink-0" />
          <span>24/7 availability with expert knowledge</span>
        </li>
        <li className="flex items-start gap-3">
          <Check className="text-blue-200 mt-1 flex-shrink-0" />
          <span>Free basic consultation</span>
        </li>
      </ul>
      
      {/* Suggested queries */}
      <div className="mb-6">
        <h3 className="text-blue-200 font-medium mb-2">Try asking:</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setQuery("Best direction for main entrance?")}
            className="text-sm bg-blue-500/30 hover:bg-blue-400/50 border border-blue-400/50 rounded-full px-3 py-1 transition backdrop-blur-sm"
          >
            Best direction for main entrance?
          </button>
          <button 
            onClick={() => setQuery("Vastu tips for kitchen?")}
            className="text-sm bg-blue-500/30 hover:bg-blue-400/50 border border-blue-400/50 rounded-full px-3 py-1 transition backdrop-blur-sm"
          >
            Vastu tips for kitchen?
          </button>
          <button 
            onClick={() => setQuery("Ideal bedroom colors?")}
            className="text-sm bg-blue-500/30 hover:bg-blue-400/50 border border-blue-400/50 rounded-full px-3 py-1 transition backdrop-blur-sm"
          >
            Ideal bedroom colors?
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setChatbotOpen(true)}
          className="bg-blue-400 text-blue-900 font-semibold rounded-lg px-6 py-3 shadow-lg hover:bg-blue-300 transition flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} /> Try Vastu Chatbot
        </button>
        <button
          onClick={() => scrollToSection("faq")}
          className="bg-transparent border-2 border-blue-300 text-blue-100 font-semibold rounded-lg px-6 py-3 hover:bg-blue-500/30 hover:text-white transition flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <Info size={20} /> Learn More
        </button>
      </div>
    </div>
    
    <div className="md:w-1/2 relative">
      <div className="bg-blue-700/50 backdrop-blur-md p-6 rounded-2xl border border-blue-400/30 shadow-xl glass-effect">
        {/* Chat interface */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="bg-blue-100/90 text-blue-900 p-3 rounded-lg max-w-xs">
            <p>What Vastu improvements for my living room?</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 justify-end mb-4">
          <div className="bg-blue-200/90 text-blue-900 p-3 rounded-lg max-w-xs">
            <p>Place sofa in northeast corner and add a green plant in southeast.</p>
          </div>
          <div className="bg-blue-300 w-10 h-10 rounded-full flex items-center justify-center">
            <Shield size={20} className="text-blue-800" />
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="bg-blue-100/90 text-blue-900 p-3 rounded-lg max-w-xs">
            <p>Best colors for bedroom according to Vastu?</p>
          </div>
        </div>
        
        {/* Voice search and input area */}
        <div className="mt-6 flex items-center gap-2 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <input 
            type="text" 
            placeholder="Ask your Vastu question..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-blue-200"
          />
          <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 transition">
            <Mic size={18} className="text-white" />
          </button>
          <button className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 transition">
            <Send size={18} className="text-white" />
          </button>
        </div>
        
        <div className="absolute -bottom-4 -right-4 bg-blue-400 text-blue-900 px-4 py-2 rounded-lg font-bold shadow-lg backdrop-blur-sm">
          AI Vastu Expert
        </div>
      </div>
    </div>
  </div>
  
  {/* Glass effect CSS */}
  <style jsx>{`
    .glass-effect {
      background: rgba(30, 58, 138, 0.4);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
  `}</style>
</section>

        {/* Demo Video Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">See It In Action</h2>
            <div className="relative">
              {/* Video container with thumbnail and play button - shown when not playing */}
              {!isPlaying && (
                <div
                  className="aspect-w-16 aspect-h-9 bg-gray-300 rounded-xl overflow-hidden shadow-lg relative cursor-pointer"
                  onClick={handlePlayClick}
                >
                  <img
                    src={thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition">
                    <button className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition transform hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Video element - shown when playing */}
              <video
                className={`w-full aspect-video rounded-xl ${
                  !isPlaying ? "hidden" : "block"
                }`}
                ref={videoRef}
                controls
                poster={thumbnail}
              >
                <source src={action} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Invitation to Try */}
        <section
          id="try"
          className="py-16 px-6 md:px-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white"
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="bg-white/20 p-4 rounded-full">
              <MousePointerClick size={48} className="flex-shrink-0" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-3">
                Ready to bring your dream home to life?
              </h2>
              <p className="mb-6 max-w-xl text-blue-100">
                Get started with ArchitechX today. Design, visualize, and
                interact — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-white text-blue-700 font-semibold rounded px-6 py-3 shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} /> Start Free Trial
                </button>
                <button
                  onClick={() => scrollToSection("subscription")}
                  className="bg-transparent border-2 border-white text-white font-semibold rounded px-6 py-3 hover:bg-white hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} /> View Plans
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Model */}
        <section
          id="subscription"
          className="py-16 px-6 md:px-20 bg-white text-gray-800"
        >
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
              <CreditCard size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-2xl mx-auto mb-12 text-lg text-gray-600">
              Choose a plan that suits your needs. No hidden fees, cancel
              anytime.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: "Starter",
                  price: "$9.99",
                  period: "per month",
                  features: [
                    "2D Layouts",
                    "5 3D Models/month",
                    "Basic Export Options",
                    "Community Support",
                    "1 Project",
                  ],
                  popular: false,
                },
                {
                  title: "Professional",
                  price: "$29.99",
                  period: "per month",
                  features: [
                    "Unlimited 2D & 3D Models",
                    "Advanced Export (GLTF, PDF)",
                    "Priority Support",
                    "100GB Cloud Storage",
                    "10 Projects",
                    "Team Collaboration",
                  ],
                  popular: true,
                },
                {
                  title: "Enterprise",
                  price: "Custom",
                  period: "tailored plan",
                  features: [
                    "All Professional features",
                    "Unlimited Projects",
                    "Dedicated Account Manager",
                    "Custom Integrations",
                    "Onsite Training",
                    "API Access",
                  ],
                  popular: false,
                },
              ].map(({ title, price, period, features, popular }) => (
                <div
                  key={title}
                  className={`p-6 rounded-xl border-2 ${
                    popular
                      ? "border-blue-600 shadow-lg transform md:-translate-y-4"
                      : "border-gray-200"
                  } flex flex-col`}
                >
                  {popular && (
                    <div className="bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded-full inline-block mx-auto -mt-8 mb-4">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{price}</span>
                    <span className="text-gray-600"> {period}</span>
                  </div>
                  <ul className="mb-6 space-y-3 text-left flex-grow">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check
                          className="text-green-500 mt-1 flex-shrink-0"
                          size={18}
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full rounded-lg py-3 font-semibold transition mt-auto ${
                      popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {popular ? "Get Started" : "Choose Plan"}
                  </button>
                </div>
              ))}
            </div>

            {/* Enterprise CTA */}
            <div className="mt-12 max-w-3xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-3">Need something more?</h3>
              <p className="text-gray-600 mb-6">
                Our enterprise solutions offer custom pricing and features
                tailored to your organization's needs.
              </p>
              <button className="bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-700 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-16 px-6 md:px-20 bg-blue-50 text-gray-900"
        >
          <div className="max-w-5xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
              <MessageCircle size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">What Our Users Say</h2>
            <p className="max-w-xl mx-auto text-gray-600">
              Don't just take our word for it. Here's what our users have to say
              about their experience.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
            {testimonialsData.map(({ name, feedback, role, rating }, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="flex space-x-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="mb-6 italic text-gray-800 flex-grow">
                  “{feedback}”
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://randomuser.me/api/portraits/${
                      idx % 2 === 0 ? "women" : "men"
                    }/${idx + 30}.jpg`}
                    alt={name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-600">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 px-6 md:px-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Info size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Have questions? We've got answers. If you can't find what you're
                looking for, feel free to contact us.
              </p>
            </div>

            <div className="space-y-4">
              {FAQ.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-6 text-left font-semibold hover:bg-gray-50 transition"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{item.question}</span>
                    {activeFAQ === index ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  <div
                    className={`px-6 pb-6 pt-0 ${
                      activeFAQ === index ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <ContactSection />
      </div>

      {/* Enhanced Footer */}
      {/* <footer className="w-full bg-blue-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-extrabold mb-4 flex items-center">
              <span className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                <Home size={20} />
              </span>
              ArchitechX
            </div>
            <p className="text-blue-200 mb-4">
              Empowering your architectural dreams with intuitive design tools.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="text-blue-200 hover:text-white transition"
                  aria-label={social}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.384 4.482A13.962 13.962 0 0 1 1.671 3.149a4.92 4.92 0 0 0 1.523 6.574 4.903 4.903 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.419A9.9 9.9 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0 0 24 4.557z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Templates', 'Integrations', 'Roadmap'].map((item, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-white transition"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.toLowerCase());
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Documentation', 'Tutorials', 'Blog', 'Webinars', 'Help Center'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-blue-200 hover:text-white transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Press', 'Contact', 'Partners'].map((item, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-blue-200 hover:text-white transition"
                    onClick={(e) => {
                      if (item === 'Contact') {
                        e.preventDefault();
                        scrollToSection('contact');
                      }
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-blue-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300 mb-4 md:mb-0">© 2025 ArchitechX. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-300 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-blue-300 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-blue-300 hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </footer> */}

      {/* Footer */}
      <footer className="w-full bg-blue-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2025 ArchitechX. All rights reserved.</p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Facebook"
            >
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22.675 0h-21.35C.596 0 0 .593 0 1.326v21.348C0 23.405.596 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.588l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.405 24 22.674V1.326C24 .593 23.404 0 22.675 0z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Twitter"
            >
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482A13.962 13.962 0 0 1 1.671 3.149a4.917 4.917 0 0 0 1.523 6.563 4.903 4.903 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.224.085c.626 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.9 13.9 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.012 0-.213-.005-.425-.014-.636A10.025 10.025 0 0 0 24 4.557z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-blue-400 transition"
              aria-label="Instagram"
            >
              <svg
                fill="currentColor"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5c0 3.3-2.45 5.75-5.75 5.75h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 2C5.68 4 4 5.68 4 7.75v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4.75-3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
