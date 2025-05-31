import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader } from 'react-feather';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 px-6 md:px-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <Mail size={32} className="text-blue-300" /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
              Contact Us
            </span>
          </h2>
          
          <p className="text-blue-100 text-lg leading-relaxed">
            Have questions or need assistance? Our team is here to help you with any inquiries you might have.
          </p>

          <div className="space-y-6">
            <ContactInfoItem 
              icon={<Phone size={20} />}
              title="Phone"
              value="+91 98765 43210"
            />
            
            <ContactInfoItem 
              icon={<Mail size={20} />}
              title="Email"
              value="support@architechx.com"
            />
            
            <ContactInfoItem 
              icon={<MapPin size={20} />}
              title="Address"
              value="Gorakhpur, Uttar Pradesh 273010"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 transition-all hover:shadow-blue-900/30 hover:scale-[1.01]">
          {submitSuccess ? (
            <div className="text-center py-10">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-blue-100">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-6 px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-2">Send us a message</h3>
              
              <FloatingInput
                id="name"
                label="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              
              <FloatingInput
                id="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              
              <FloatingInput
                id="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              
              <div className="relative">
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="peer w-full p-4 pt-6 rounded-lg border border-white/30 bg-white/5 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/30 text-white placeholder-transparent"
                  placeholder=" "
                />
                <label 
                  htmlFor="message" 
                  className="absolute left-4 top-2 text-blue-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-blue-200 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-100"
                >
                  Message
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// Reusable components
const ContactInfoItem = ({ icon, title, value }) => (
  <div className="flex items-start gap-4 group">
    <div className="bg-blue-500/80 group-hover:bg-blue-400 p-3 rounded-lg transition-all">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-blue-100 group-hover:text-white transition">{value}</p>
    </div>
  </div>
);

const FloatingInput = ({ id, label, type = 'text', value, onChange, required }) => (
  <div className="relative">
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="peer w-full p-4 pt-6 rounded-lg border border-white/30 bg-white/5 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300/30 text-white placeholder-transparent"
      placeholder=" "
    />
    <label 
      htmlFor={id} 
      className="absolute left-4 top-2 text-blue-100 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-blue-200 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-100"
    >
      {label}
    </label>
  </div>
);

export default ContactSection;