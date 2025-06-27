import React from 'react';

export default function AboutAuthor({ author }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100">
            <div className="container mx-auto px-6 py-16 max-w-4xl">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-block w-px h-12 bg-gradient-to-b from-transparent via-slate-400 to-transparent mb-8"></div>
                    <h1 className="text-4xl md:text-5xl font-light text-slate-800 tracking-wide">
                        About the Author
                    </h1>
                    <div className="inline-block w-px h-12 bg-gradient-to-b from-slate-400 via-transparent to-transparent mt-8"></div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-5 gap-12 items-start">

                    {/* Profile Image Section */}
                    <div className="md:col-span-2 flex flex-col items-center">
                        <div className="relative">
                            <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
                                <img
                                    src={author?.profilePicture}
                                    alt={author?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-light text-slate-800 mt-8 text-center tracking-wide">
                            {author?.name}
                        </h2>

                        <div className="flex items-center mt-4 text-teal-600">
                            <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                            <span className="text-sm font-medium tracking-wider uppercase">{author?.title}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-3 space-y-8">
                        {/* Bio */}
                        <div className="prose prose-lg max-w-none">
                            <p className="text-slate-700 leading-relaxed text-lg font-light">
                                {author?.about}
                            </p>
                        </div>

                        {/* Key Focus Areas */}
                        {/* <div className="space-y-6">
                            <h3 className="text-xl font-light text-slate-800 border-b border-slate-200 pb-3">
                                Areas of Focus
                            </h3>

                            <div className="grid gap-4">
                                {[
                                    'Traditional Architectural Approaches',
                                    'Sustainability in Modern Design',
                                    'Nature Integration',
                                    'Contemporary-Traditional Synthesis'
                                ].map((focus, index) => (
                                    <div key={index} className="flex items-center group">
                                        <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-slate-400 mr-4 group-hover:from-teal-600 transition-colors"></div>
                                        <span className="text-slate-700 font-light tracking-wide">{focus}</span>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* Institution */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                            <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-teal-600 rounded-full mr-3"></div>
                                <h3 className="text-lg font-medium text-slate-800">Education</h3>
                            </div>
                            <p className="text-slate-700 font-light">
                                German University in Cairo, Egypt
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Bachelor's in Architecture and Urban Design
                            </p>
                        </div>

                    </div>
                </div>

                {/* Bottom Accent */}
                <div className="flex justify-center mt-20">
                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                </div>
            </div>
        </div>
    );
}