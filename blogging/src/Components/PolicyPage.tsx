"use client";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

const PolicyPage = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`${isDark ? "bg-[#111111] text-gray-200" : "bg-gray-50 text-gray-900"
                } pt-28 pb-20 px-4`}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        Privacy Policy
                    </h1>
                </div>

                {/* Content Container */}
                <div
                    className={`${isDark ? "bg-[#1A1A1A]/60" : "bg-white"
                        } shadow-md rounded-xl p-8 md:p-12 space-y-10 border border-gray-200/20`}
                >
                    {/* Intro */}
                    <p className="text-lg leading-relaxed">
                        At <strong>PotatoTrails</strong> (https://www.potatotrail.life/), we are
                        committed to protecting your personal data. This Privacy Policy explains
                        how we collect, use, store, and share your information in compliance with
                        GDPR, CCPA, and applicable laws.
                    </p>

                    {/* Sections */}
                    {/* 1 */}
                    <section id="info-we-collect" className="space-y-4">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            1. Information We Collect
                        </h2>
                        <p>
                            We collect and process data to enhance user experience and improve
                            our travel blog services.
                        </p>

                        <h3 className="text-xl font-semibold mt-4">1.1 Personal Information</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Contact information (phone, address)</li>
                            <li>Travel preferences</li>
                            <li>Comments & feedback</li>
                            <li>Information submitted via forms</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-4">
                            1.2 Automatically Collected Data
                        </h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>IP address</li>
                            <li>Browser & device type</li>
                            <li>Geolocation (if enabled)</li>
                            <li>Referral source</li>
                            <li>Page interactions & time spent</li>
                            <li>Stories viewed</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-4">
                            1.3 Cookies & Tracking
                        </h3>
                        <p>
                            We use cookies to improve performance, personalize content, and
                            analyze usage. You may disable cookies in your browser settings.
                        </p>
                    </section>

                    <hr className="border-gray-300/20" />

                    {/* 2 */}
                    <section id="use-of-info" className="space-y-4">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            2. How We Use Your Information
                        </h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Deliver and personalize content</li>
                            <li>Improve website and reader experience</li>
                            <li>Send newsletters and updates</li>
                            <li>Enable collaborations</li>
                            <li>Ensure website security</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <p className="font-medium mt-3">
                            We do <u>not</u> sell or rent your personal data.
                        </p>
                    </section>

                    <hr className="border-gray-300/20" />

                    {/* 3 */}
                    <section id="gdpr" className="space-y-4">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            3. Legal Basis for Processing (GDPR)
                        </h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Consent</li>
                            <li>Legitimate Interest</li>
                            <li>Legal Obligation</li>
                        </ul>
                    </section>

                    <hr className="border-gray-300/20" />

                    {/* 4 */}
                    <section id="data-sharing" className="space-y-4">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            4. Data Sharing & Third-Party Services
                        </h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Email services (Mailchimp, SendGrid)</li>
                            <li>Analytics tools (Google Analytics)</li>
                            <li>Advertising partners (Raptive)</li>
                            <li>Hosting & infrastructure providers</li>
                            <li>Legal authorities (when required)</li>
                        </ul>
                    </section>

                    <hr className="border-gray-300/20" />

                    {/* 5 */}
                    <section id="data-security" className="space-y-4">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            5. Data Security & Retention
                        </h2>
                        <p>
                            We use SSL encryption and industry-standard security practices.
                            Personal data is retained only as long as necessary. You may request
                            deletion anytime.
                        </p>
                    </section>

                    <hr className="border-gray-300/20" />

                    {/* 6 */}
                    <section id="rights" className="space-y-4">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            6. Your Rights Under GDPR & CCPA
                        </h2>

                        <h3 className="text-xl font-semibold">6.1 GDPR Rights</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Access</li>
                            <li>Rectification</li>
                            <li>Erasure</li>
                            <li>Restriction</li>
                            <li>Data Portability</li>
                            <li>Objection</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-4">6.2 CCPA Rights</h3>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Right to know</li>
                            <li>Right to delete</li>
                            <li>Right to opt-out</li>
                            <li>Right to non-discrimination</li>
                        </ul>

                        <p className="mt-4">Contact: hello@potatotrail.life</p>
                    </section>

                    <hr className="border-gray-300/20" />

                    {/* Short Sections */}
                    <section id="links">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500">
                            7. Third-Party Links
                        </h2>
                        <p>
                            We are not responsible for external website privacy practices.
                        </p>
                    </section>

                    <section id="newsletter">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500 mt-6">
                            8. Newsletters
                        </h2>
                        <p>You may unsubscribe at any time via the email link.</p>
                    </section>

                    <section id="ads">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500 mt-6">
                            9. Advertising
                        </h2>
                        <p>
                            We work with Raptive. More info:
                            https://raptive.com/creator-advertising-privacy-statement/
                        </p>
                    </section>

                    <section id="analytics">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500 mt-6">
                            10. Analytics
                        </h2>
                        <p>
                            Google Analytics helps us understand traffic patterns.
                            https://policies.google.com/privacy
                        </p>
                    </section>

                    <section id="updates">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500 mt-6">
                            11. Updates to This Policy
                        </h2>
                        <p>We may update this policy. Changes will appear on this page.</p>
                    </section>

                    <section id="contact">
                        <h2 className="text-2xl font-semibold border-l-4 pl-3 border-blue-500 mt-6">
                            12. Contact Us
                        </h2>
                        <ul className="list-disc ml-6 space-y-1">
                            <li>Email: hello@potatotrail.life</li>
                            <li>Website: https://www.potatotrail.life</li>
                            <li>Location: Northern India</li>
                        </ul>
                    </section>

                    <p className="pt-6 text-center opacity-70">
                        Thank you for being part of the PotatoTrails community.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
