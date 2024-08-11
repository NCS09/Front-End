import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center text-gray-800">
      {/* Hero Section */}
      <header className="bg-purple-700 w-full py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to My Website</h1>
          <p className="text-lg mb-8">Your one-stop solution for all your needs.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Call to Action */}
        <section className="bg-yellow-400 text-purple-800 text-center py-8 px-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
          <p className="text-lg mb-6">Sign up now and take the first step towards a better experience.</p>
          <a
            href="/Login"
            className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
          >
            Sign Up
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-purple-700 text-white text-center py-4 w-full">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
