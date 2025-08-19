'use client'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">
          Built by{' '}
          <a 
            href="https://alexandermayo.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            alexandermayo.com
          </a>
        </p>
      </div>
    </footer>
  )
}