'use client'
import axios from 'axios'
import { useState } from 'react'

export default function Subscribe({ userId }) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        if (!email || !userId) {
            setMessage('Please provide email')
            return
        }
        setLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/subscribeToNewsletter`, {
                email,
                userId
            })
            if (res.status === 200) {
                setMessage('Thanks for subscribing!')
                setEmail('')
            }
        } catch (err) {
            setMessage(err.response.data.message)
        }
        finally {
            setLoading(false)
            setTimeout(() => {
                setMessage('')
            }, 3000)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mt-10 px-6 py-8 bg-white rounded-xl shadow-lg space-y-4"
        >
            <h2 className="text-2xl font-bold text-gray-800 text-center">Subscribe for Blog Updates</h2>

            <p className="text-center text-gray-600 text-sm">
                Join our mailing list and get notified when we publish new travel blogs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    disabled={loading}
                    type="submit"
                    className={`px-6 py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-md hover:bg-blue-700 transition-colors`}
                >
                    Subscribe
                </button>
            </div>

            {message && (
                <p
                    className={`text-sm text-center mt-2 transition-opacity duration-300 text-red-500`}
                >
                    {message}
                </p>
            )}
        </form>
    )
}
