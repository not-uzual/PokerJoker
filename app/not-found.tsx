import Link from 'next/link'

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h2 className="text-4xl font-bold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="px-4 py-2 bg-white text-black rounded hover:bg-white transition">
        Return Home
      </Link>
    </div>
  )
}