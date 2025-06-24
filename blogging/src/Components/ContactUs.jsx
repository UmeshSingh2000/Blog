'use client'
import React, { useState } from 'react'
import { Mail, MapPin, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contactMe`, formData)
      if (res.status === 200) {
        toast.success(res.data.message || 'Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="contact" className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-8 sm:p-12">
        <h2 className="text-4xl font-bold text-center text-gray-950 mb-4">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">
          Have a question or want to work together? Fill out the form below.
        </p>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-around items-center text-sm text-gray-600 mb-10 gap-6">
          <div className="flex items-center gap-2">
            <Mail className="text-gray-950" size={18} />
            <a href="mailto:cityinstories@gmail.com" className="hover:underline">cityinstories@gmail.com</a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-950" size={18} />
            <span>New Delhi, India</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="sr-only">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-gray-950 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-950 cursor-pointer text-white py-4 px-6 rounded-lg transition-all font-semibold flex justify-center items-center gap-2 shadow-md hover:bg-black"
          >
            <Send size={18} />
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs
