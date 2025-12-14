'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Heart, TrendingUp, Users, Target, CheckCircle, Mail, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';
import { signIn } from "next-auth/react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24 w-full bg-white"></div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-white to-red-50/50 py-12 md:py-16 text-center md:text-left">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="p-5 bg-red-100 text-red-500 rounded-3xl shadow-sm rotate-3 hover:rotate-6 transition-transform">
              <Sparkles className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">About Shrnk</h1>
              <p className="text-xl text-gray-600 font-medium max-w-2xl">Making link sharing simple, secure, and powerful for everyone.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10 md:space-y-16">
        {/* What We Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-600 text-lg max-w-3xl">
              Shrnk is a modern URL shortening service that transforms long, unwieldy links into short, manageable URLs. We provide individuals, businesses, and developers with tools to:
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: 'Shorten URLs', sub: 'Convert long links into clean, short URLs' },
              { text: 'Track Analytics', sub: 'Monitor clicks, locations, and device types' },
              { text: 'Secure Links', sub: 'Protect sensitive links with passwords' },
              { text: 'Manage Links', sub: 'Organize all your URLs from one dashboard' },
              { text: 'Generate QR Codes', sub: 'Create scannable codes for your links' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-xl leading-none">✓</span>
                  <div>
                    <strong className="block text-gray-900 mb-1">{item.text}</strong>
                    <span className="text-sm text-gray-500">{item.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Our Values */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Features */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100 text-gray-900">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-red-400 text-sm mt-1">→</span>
                      <span className="text-sm text-gray-600 font-medium">{item}</span>
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
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
           className="border border-gray-100 rounded-3xl p-6 md:p-8 bg-gradient-to-br from-green-50/50 to-blue-50/50"
        >
          <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center md:text-left">Why Choose Shrnk?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg flex-shrink-0">
                  {reason.icon}
                </div>
                <span className="font-medium text-gray-700">{reason.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8"
        >
          <div className="bg-red-50 p-6 rounded-full flex-shrink-0">
             <MapPin className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Based in India, Serving the World</h2>
            <p className="text-gray-600 mb-4 max-w-xl">
              Headquartered in <strong>Pune, Maharashtra</strong>, we serve users globally with our cloud-based infrastructure ensuring fast access from anywhere.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium">
              <span>📍</span> Pune, Maharashtra, India
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-6 md:p-10 bg-gradient-to-r from-red-500 to-pink-600 text-white text-center shadow-lg transform hover:scale-[1.01] transition-transform duration-300"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-4">Join Our Growing Community</h2>
          <p className="text-red-100 mb-8 text-lg max-w-2xl mx-auto">
            Start shortening links today and experience the difference!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn("google", { callbackUrl: "/x" })}
              className="px-8 py-3 bg-white text-red-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </motion.button>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent text-white font-bold rounded-full border-2 border-white/30 hover:bg-white/10 transition-colors"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

// Need access to MapPin, so update imports
export default AboutUsPage;