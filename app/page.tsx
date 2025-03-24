import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the DevOps Dashboard</h1>
        <Link href="/dashboard">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}