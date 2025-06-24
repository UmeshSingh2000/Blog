'use client'
import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Thanks for reaching out!')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div id="contact" className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-gray-950 mb-4">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">
          Have a question or want to work together? Fill out the form below.
        </p>

        {/* Contact Info Row */}
        <div className="flex flex-col md:flex-row justify-around items-center text-sm text-gray-600 mb-10 gap-6">
          <div className="flex items-center gap-2">
            <Mail className="text-gray-950" size={18} />
            <a href="mailto:cityinstories@gmail.com"><span>cityinstories@gmail.com</span></a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-950" size={18} />
            <span>New Delhi, India</span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none transition-all"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none transition-all"
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none transition-all"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none "
          />

          <button
            type="submit"
            className="w-full bg-gray-950 text-white cursor-pointer py-4 px-6 rounded-lg transition-all font-semibold flex justify-center items-center gap-2 shadow-md"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs
