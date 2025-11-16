'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Heart, TrendingUp, Users, Target, CheckCircle, Mail, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

const AboutUsPage = () => {
  const values = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Simplicity',
      description: 'We believe in making technology accessible. Our interface is clean, intuitive, and requires no technical expertise.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security',
      description: 'Your data and links are protected with industry-standard encryption and security measures. We take security seriously.'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Privacy',
      description: 'We respect your privacy. We collect only necessary data and never sell your information to third parties.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Reliability',
      description: 'With 99.9% uptime, we ensure your links work when you need them. Our infrastructure is built for scale and stability.'
    }
  ];

  const features = [
    {
      title: 'For Everyone',
      items: [
        'Quick link shortening without registration',
        'Mobile-friendly interface',
        'QR code generation',
        'Basic analytics'
      ]
    },
    {
      title: 'For Registered Users',
      items: [
        'Link management dashboard',
        'Extended link validity (1 year)',
        'Detailed click analytics',
        'Search and organize links',
        'Monthly credit renewal'
      ]
    },
    {
      title: 'For Premium Users',
      items: [
        'Password-protected links',
        'Custom link expiration',
        'Advanced analytics',
        'Priority support',
        'Unlimited link creation'
      ]
    }
  ];

  const reasons = [
    { icon: <Zap className="w-5 h-5" />, text: 'Fast: Links generated in milliseconds' },
    { icon: <Shield className="w-5 h-5" />, text: 'Secure: Password protection & encryption' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'Reliable: 99.9% uptime guarantee' },
    { icon: <Heart className="w-5 h-5" />, text: 'Private: We dont sell your data' },
    { icon: <TrendingUp className="w-5 h-5" />, text: 'Analytics: Comprehensive click tracking' },
    { icon: <Users className="w-5 h-5" />, text: 'Support: Responsive customer service' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b-2 border-black bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 border-2 border-black rounded-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black mb-2">About Shrnk</h1>
              <p className="text-gray-600 font-medium text-lg">Making link sharing simple, secure, and powerful</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50"
        >
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Our Story
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Shrnk was founded in 2025 with a simple mission: to make link sharing simple, secure, and powerful. In an era of lengthy URLs and complex link management, we saw an opportunity to create a service that prioritizes user experience, security, and reliability.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Were a dedicated team of developers, designers, and support specialists passionate about creating tools that make the internet more accessible and manageable.
          </p>
        </motion.div>

        {/* What We Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-black rounded-lg p-6 bg-white"
        >
          <h2 className="text-2xl font-black mb-4">What We Do</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Shrnk is a modern URL shortening service that transforms long, unwieldy links into short, manageable URLs. We provide individuals, businesses, and developers with tools to:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold text-lg mt-0.5">✓</span>
              <span className="text-gray-700"><strong>Shorten URLs:</strong> Convert long links into clean, short URLs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold text-lg mt-0.5">✓</span>
              <span className="text-gray-700"><strong>Track Analytics:</strong> Monitor clicks, locations, and device types</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold text-lg mt-0.5">✓</span>
              <span className="text-gray-700"><strong>Secure Links:</strong> Protect sensitive links with passwords</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold text-lg mt-0.5">✓</span>
              <span className="text-gray-700"><strong>Manage Links:</strong> Organize all your URLs from one dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold text-lg mt-0.5">✓</span>
              <span className="text-gray-700"><strong>Generate QR Codes:</strong> Create scannable codes for your links</span>
            </li>
          </ul>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-2 border-black rounded-lg p-6 bg-yellow-50"
        >
          <h2 className="text-2xl font-black mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-lg font-medium">
            To provide the most reliable, secure, and user-friendly URL shortening service while respecting user privacy and maintaining the highest standards of data protection.
          </p>
        </motion.div>

        {/* Our Values */}
        <div>
          <h2 className="text-2xl font-black mb-6">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border-2 border-black rounded-lg p-6 bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 border-2 border-black rounded-lg">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Features */}
        <div>
          <h2 className="text-2xl font-black mb-6">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="border-2 border-black rounded-lg p-6 bg-white"
              >
                <h3 className="text-lg font-bold mb-4 pb-2 border-b-2 border-black">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-500 text-sm mt-1">→</span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Shrnk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border-2 border-black rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50"
        >
          <h2 className="text-2xl font-black mb-6">Why Choose Shrnk?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-lg">
                <div className="p-2 bg-green-100 border-2 border-black rounded-lg flex-shrink-0">
                  {reason.icon}
                </div>
                <span className="font-medium text-gray-700">{reason.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="border-2 border-black rounded-lg p-6 bg-white"
        >
          <h2 className="text-2xl font-black mb-4">Our Technology</h2>
          <p className="text-gray-700 mb-4">Built with modern technologies:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
              <span className="font-bold text-purple-600">Next.js</span>
              <span className="text-gray-600">Lightning-fast performance</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
              <span className="font-bold text-purple-600">PostgreSQL</span>
              <span className="text-gray-600">Reliable data storage</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
              <span className="font-bold text-purple-600">Vercel</span>
              <span className="text-gray-600">Global edge network</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black rounded-lg">
              <span className="font-bold text-purple-600">Encryption</span>
              <span className="text-gray-600">Industry-standard security</span>
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="border-2 border-black rounded-lg p-6 bg-white"
        >
          <h2 className="text-2xl font-black mb-4">Location</h2>
          <p className="text-gray-700 mb-4">
            Based in <strong>Pune, Maharashtra, India</strong>, we serve users globally with our cloud-based infrastructure ensuring fast access from anywhere in the world.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-black rounded-lg">
            <span className="text-2xl">📍</span>
            <span className="font-bold">Pune, Maharashtra, India</span>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="border-2 border-black rounded-lg p-8 bg-black text-white text-center"
        >
          <h2 className="text-3xl font-black mb-4">Join Thousands of Users</h2>
          <p className="text-gray-300 mb-6 text-lg">
            Start shortening links today and experience the difference!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black font-bold rounded-lg border-2 border-white hover:bg-gray-100 transition-colors"
              >
                Get Started
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent text-white font-bold rounded-lg border-2 border-white hover:bg-white hover:text-black transition-colors"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUsPage;