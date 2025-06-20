import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Potato trails. All rights reserved.</p>

        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a href="/" className="hover:underline">About</a>
          <a href="/" className="hover:underline">Contact</a>
          <a href="/" className="hover:underline">Privacy</a>

          {/* Social Icons */}
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xl hover:text-pink-500">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="mailto:example@example.com" className="text-gray-500 text-xl hover:text-blue-500">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 text-xl hover:text-red-500">
            <FontAwesomeIcon icon={faPinterest} />
          </a>
        </div>
      </div>
    </footer>
  )
}
