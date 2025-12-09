import React from "react";

export default function AboutAuthor({ author, theme }) {
    return (
        <section className="max-w-6xl flex flex-col items-center mx-auto px-4 py-10">

            <h2 className={`text-xl font-semibold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                About the Author
            </h2>

            <div className="flex items-start gap-5 p-5 ">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <img
                        src={author?.profilePicture}
                        alt={author?.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {author?.name}
                    </h3>

                    {author?.title && (
                        <p className={`text-sm mb-2 ${theme === "dark" ? "text-white" : "text-gray-600"}`}>{author.title}</p>
                    )}

                    {/* Short bio */}
                    <p className={`text-sm leading-relaxed line-clamp-3 ${theme === "dark" ? "text-white" : "text-gray-700"}`}>
                        {author?.about || "This author has not added their bio yet."}
                    </p>

                    {/* Education small and clean */}
                    {author?.education?.length > 0 && (
                        <div className="mt-3">
                            <h4 className={`text-xs font-semibold uppercase tracking-wide mb-1 ${theme === "dark" ? "text-white" : "text-gray-500"}`}>
                                Education
                            </h4>

                            <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-white" : "text-gray-600"}`}>
                                {author.education.map((item, i) => (
                                    <li key={i} className="leading-snug">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
