'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Loader from '@/Components/Loader/Loader';

const UnsubscribedPage = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const handleUnsubscribe = async () => {
            if (!userId || !email) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/unsubscribeFromNewsletter?email=${email}&userId=${userId}`
                );
                setLoading(false);
            } catch (err) {
                console.error('Error during unsubscribe:', err);
                setError(true);
                setLoading(false);
            }
        };

        handleUnsubscribe();
    }, [userId, email]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800 text-center px-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-2xl font-semibold">Unsubscribe Failed</h1>
                    <p className="mt-2 text-sm">There was a problem unsubscribing. The link may be invalid.</p>
                    <a
                        href="/"
                        className="inline-block mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition"
                    >
                        Return to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="text-red-500 w-12 h-12" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">You've been unsubscribed</h1>
                <p className="text-gray-600 mb-6">
                    You’ve been successfully removed from our newsletter. We’re sad to see you go.
                </p>
                <a
                    href="/"
                    className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition"
                >
                    Return to Home
                </a>
            </div>
        </div>
    );
};

export default UnsubscribedPage;
