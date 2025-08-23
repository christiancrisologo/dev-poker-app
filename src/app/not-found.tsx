import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-600">404 - Page Not Found</h1>
        <p className="mb-8 text-gray-600">Sorry, the page you are looking for does not exist or the session was not found.</p>
                <Link href="/" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Go Home</Link>
      </div>
    </div>
  );
}
