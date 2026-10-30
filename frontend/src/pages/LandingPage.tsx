
import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, BookOpen, Users, MessageSquare } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-primary-600">GrowBro</div>
        <div className="space-x-6">
          <Link to="/login" className="hover:text-primary-600 transition">
            Login
          </Link>
          <Link to="/signup" className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
          Level Up Your Student Life
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The all-in-one AI platform for studying, collaboration, and personal growth. Built for the modern student.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to="/signup" className="bg-primary-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-200">
            Get Started for Free
          </Link>

          <button className="px-10 py-4 rounded-xl text-lg font-semibold border-2 border-gray-200 hover:border-primary-600 hover:text-primary-600 transition">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

          <Link
            to="/preview/ai-assistant"
            className="block p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <BookOpen className="text-primary-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">AI Study Assistant</h3>
            <p className="text-gray-600">
              Get instant answers and simple explanations for any topic.
            </p>
          </Link>

          <Link
            to="/preview/discussions"
            className="block p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <Users className="text-primary-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Discussion Hub</h3>
            <p className="text-gray-600">
              Collaborate with peers on coding, DSA, and core subjects.
            </p>
          </Link>

          <Link
            to="/preview/practice"
            className="block p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <MessageSquare className="text-primary-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
            <p className="text-gray-600">
              Submit answers and get AI feedback to improve your thinking.
            </p>
          </Link>

          <Link
            to="/preview/missions"
            className="block p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <Rocket className="text-primary-600 mb-4 w-10 h-10" />
            <h3 className="text-xl font-bold mb-2">Real-World Missions</h3>
            <p className="text-gray-600">
              Growth beyond academics with community and eco missions.
            </p>
          </Link>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
