import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ content,theme }: { content: string, theme: string }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1 className={`text-2xl font-bold mt-6 mb-3 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className={`text-xl font-semibold mt-5 mb-2 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className={`text-2xl font-semibold mt-4 mb-2 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className={`text-base leading-relaxed mb-4 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className={`list-disc pl-5 mb-4 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className={`list-decimal pl-5 mb-4 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />
        ),
        li: ({ node, ...props }) => <li className={`mb-1 ${theme === "dark" ? "text-white" : "text-black"}`} {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-blue-600 underline" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 pl-4 italic text-gray-600" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
