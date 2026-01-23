import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 
import Footer from '../components/Footer'; 

const PartnerInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    messName: '',
    location: '', // City/Area
    fullAddress: '', // New Field: Google Maps Link or Full Address
    ownerPhone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    
    const { messName, location, fullAddress, ownerPhone, email } = formData;
    
    // ... (Keep your existing validation logic here: if (!messName) ...) ...
    const token = localStorage.getItem("token"); // 1. Get the Token

    if (!token) {
        alert("You must be logged in to register a mess!");
        return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/register-mess', { // Ensure URL matches backend
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // 2. Send Token to Backend
        },
        body: JSON.stringify({
          name: messName,
          location: location,
          fullAddress: fullAddress,
          ownerPhone: ownerPhone,
          email: email
        })
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Registration failed");
      }
      
      const data = await response.json();
      alert('Mess registered successfully!');
      navigate('/mess-owner');

    } catch (error) {
      console.error('Registration Error:', error);
      alert('Registration failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#3B1E00] bg-[#8B5A2B] bg-cover bg-center bg-fixed relative">
      <div className="absolute inset-0 bg-[#D8D4CF]/60 -z-10 pointer-events-none"></div>
      <Header />
      <div className="flex-1 p-12 relative z-10 flex flex-col items-center">
        
        <div className="text-center mb-10 max-w-3xl">
          <h2 className="text-4xl font-bold text-[#5C2E00] mb-4">Complete Your Profile</h2>
          <p className="text-lg leading-relaxed">Tell us where you are located so customers can find you easily.</p>
        </div>

        <div className="bg-white p-8 w-full max-w-md rounded-xl shadow-2xl">
          <h3 className="text-2xl font-bold text-[#5C2E00] mb-4">Mess Details</h3>
          
          <form onSubmit={validateAndSubmit}>
            <div className="mb-4 text-left">
              <label htmlFor="messName" className="block font-bold mb-1">Mess Name</label>
              <input type="text" id="messName" value={formData.messName} onChange={handleChange} placeholder="e.g. Annapurna Mess" className="w-full p-3 rounded-lg border border-[#D2691E]" />
            </div>

            <div className="mb-4 text-left">
              <label htmlFor="location" className="block font-bold mb-1">City / Area</label>
              <input type="text" id="location" value={formData.location} onChange={handleChange} placeholder="e.g. Kothrud, Pune" className="w-full p-3 rounded-lg border border-[#D2691E]" />
            </div>

            {/* NEW FIELD FOR GOOGLE MAPS / FULL ADDRESS */}
            <div className="mb-4 text-left">
              <label htmlFor="fullAddress" className="block font-bold mb-1">Full Address / Google Maps Link</label>
              <textarea 
                id="fullAddress" 
                value={formData.fullAddress} 
                onChange={handleChange} 
                placeholder="Paste Google Maps Link or type full address here..." 
                className="w-full p-3 rounded-lg border border-[#D2691E] h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20"
              ></textarea>
            </div>

            <div className="mb-4 text-left">
              <label htmlFor="ownerPhone" className="block font-bold mb-1">Owner's Phone</label>
              <input type="text" id="ownerPhone" value={formData.ownerPhone} onChange={handleChange} placeholder="10-digit Mobile" className="w-full p-3 rounded-lg border border-[#D2691E]" />
            </div>

            <div className="mb-4 text-left">
              <label htmlFor="email" className="block font-bold mb-1">Email</label>
              <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" className="w-full p-3 rounded-lg border border-[#D2691E]" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full p-3.5 mt-2 rounded-lg text-white font-bold bg-[#D2691E] hover:bg-[#8B4513] transition-all">
              {isSubmitting ? 'Registering...' : 'Create Mess Profile'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PartnerInfo;