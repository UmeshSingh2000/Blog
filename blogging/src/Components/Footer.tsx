// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Potato trails. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/" className="hover:underline">About</a>
          <a href="/" className="hover:underline">Contact</a>
          <a href="/" className="hover:underline">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
