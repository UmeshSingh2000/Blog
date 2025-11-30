"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to send message");
    }
  };

  return (
    <div className="mt-20 max-w-7xl mx-auto">
      <h1 className="text-3xl text-center font-semibold mb-8">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap items-center ">

        {/* LEFT IMAGE SECTION */}
        <div className="w-full h-[450px] bg-red-400 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?q=80&w=710&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="contact"
            className="w-full h-full object-cover border-gray-100"
          />
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-full">


          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 space-y-6"
          >
            <div className="space-y-1">
              <label className="text-sm text-gray-600">Your Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-600">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                className="mt-1 w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-50 text-sm font-medium tracking-wide"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <p className="text-green-600 text-sm mt-2">Message sent successfully!</p>
            )}

            {status === "error" && (
              <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
