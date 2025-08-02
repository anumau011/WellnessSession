import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🧘</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">WellnessFlow</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Create & Share Your
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                  Wellness Journey
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Design personalized meditation, yoga, and mindfulness sessions. 
                Auto-save your progress, publish your flows, and help others find their inner peace.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  Start Creating Free
                </Link>
                <Link
                  to="/sessions"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-200 text-center"
                >
                  Explore Sessions
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Person meditating in serene mountain landscape"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides powerful tools to create, manage, and share your wellness sessions
              with auto-save technology that never loses your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Auto-Save Technology</h3>
              <p className="text-gray-600">
                Never lose your work again. Our smart auto-save system preserves your sessions 
                every 5 seconds and when you navigate away.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Session Builder</h3>
              <p className="text-gray-600">
                Create detailed meditation, yoga, and breathing sessions with custom durations, 
                difficulty levels, and guided instructions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share & Discover</h3>
              <p className="text-gray-600">
                Publish your sessions for others to enjoy and discover new wellness practices 
                from our community of creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-purple-200">Active Users</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-purple-200">Sessions Created</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-purple-200">Auto-Save Success</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-200">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Wellness Enthusiasts
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                "WellnessFlow has transformed how I create and share my meditation sessions. 
                The auto-save feature means I never lose my work, and the interface is so intuitive."
              </blockquote>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=150&h=150&fit=crop&crop=face"
                  alt="Sarah Chen"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">Sarah Chen</div>
                  <div className="text-gray-600">Certified Meditation Instructor</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Yoga session in progress"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who trust WellnessFlow to build and share their wellness sessions.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
          >
            Create Your First Session
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold">🧘</span>
                </div>
                <span className="text-lg font-bold">WellnessFlow</span>
              </div>
              <p className="text-gray-400">
                Create, save, and share your wellness journey with the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/sessions" className="hover:text-white transition-colors">Browse Sessions</Link></li>
                <li><Link to="/create" className="hover:text-white transition-colors">Create Session</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WellnessFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
