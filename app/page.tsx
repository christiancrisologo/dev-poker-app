import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
                <h1 className="text-3xl font-bold mb-6">Agile Poker Card Estimation</h1>
                <p className="mb-8 text-gray-600">Collaborative story point estimation for agile teams.</p>
                <div className="flex flex-col gap-4">
                    <Link href="/auth/register" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</Link>
                    <Link href="/auth/login" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</Link>
                    <Link href="/auth/guest" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Join as Guest</Link>
                    <Link href="/session/create" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Create Session</Link>
                    <Link href="/session/join" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Join Session</Link>
                </div>
            </div>
        </div>
    );
}
