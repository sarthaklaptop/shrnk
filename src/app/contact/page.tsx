'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, DollarSign, Shield, AlertTriangle, Bug, Lightbulb, Newspaper, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ContactUsPage = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'General Inquiries',
      email: 'shrnk.contact@gmail.com',
      response: 'Within 24 hours',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Customer Support',
      email: 'shrnk.contact@gmail.com',
      response: 'Within 12-24 hours',
      description: 'Priority support for premium users',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Refunds & Billing',
      email: 'shrnk.contact@gmail.com',
      response: 'Within 24-48 hours',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Report Abuse',
      email: 'shrnk.contact@gmail.com',
      description: 'Report malicious links or ToS violations',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: <Bug className="w-6 h-6" />,
      title: 'Report a Bug',
      email: 'shrnk.contact@gmail.com',
      description: 'Include screenshots and steps to reproduce',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Feature Requests',
      email: 'shrnk.contact@gmail.com',
      description: 'Share your ideas to improve Shrnk',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: <Newspaper className="w-6 h-6" />,
      title: 'Press & Media',
      email: 'shrnk.contact@gmail.com',
      description: 'For press inquiries and media kits',
      color: 'text-red-500',
      bg: 'bg-red-50'
    }
  ];

  const supportHours = [
    { type: 'Email Support', hours: '24/7', response: 'Responses within 24 hours' },
    { type: 'Priority Support (Premium)', hours: '24/7', response: 'Responses within 6 hours' },
    { type: 'Business Hours', hours: 'Mon-Fri, 9:00 AM - 6:00 PM IST', response: '' }
  ];

  const responseTable = [
    { inquiry: 'General Support', time: '24 hours' },
    { inquiry: 'Premium Support', time: '6 hours' },
    { inquiry: 'Security Issues', time: '48 hours' },
    { inquiry: 'Billing/Refunds', time: '24-48 hours' },
    { inquiry: 'Privacy Requests', time: '30 days (as per law)' },
    { inquiry: 'Press Inquiries', time: '48 hours' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24 w-full bg-white"></div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-white to-red-50/50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-red-100 text-red-500 rounded-2xl shadow-sm">
              <Mail className="w-10 h-10" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-gray-900">Contact Us</h1>
              <p className="text-lg text-gray-600 font-medium">Were here to help! Get in touch with us.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Contact Methods Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Get In Touch</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactMethods.map((method, idx) => (
              <motion.a
                key={idx}
                href={`mailto:${method.email}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className={`p-3 ${method.bg} ${method.color} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{method.title}</h3>
                <p className="text-sm font-medium text-red-500 hover:text-red-700 break-all mb-2">
                  {method.email}
                </p>
                {method.response && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {method.response}
                  </p>
                )}
                {method.description && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{method.description}</p>
                )}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Contact & Info Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* Quick Contact Options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white shadow-sm"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Quick Support</h2>
            <div className="grid gap-4">
              <a
                href="mailto:shrnk.contact@gmail.com"
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-3 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-100 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-500">shrnk.contact@gmail.com</p>
                </div>
              </a>
              <a
                href="mailto:shrnk.contact@gmail.com"
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-3 bg-green-50 text-green-500 rounded-xl group-hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">General Inquiries</p>
                  <p className="text-sm text-gray-500">shrnk.contact@gmail.com</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Office Location */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Location</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-bold text-xl text-gray-900">Shrnk</p>
                <p className="text-gray-600">Pune, Maharashtra</p>
                <p className="text-gray-600">India</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 leading-relaxed italic">
                  Note: We operate remotely with team members across multiple time zones to provide better support coverage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Grid 2 */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Expected Response Times */}
          <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white shadow-sm overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Response Times</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Inquiry Type</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Time</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {responseTable.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 text-gray-600">{row.inquiry}</td>
                      <td className="py-3 px-2 text-gray-900 font-medium text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Support Hours */}
          <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-yellow-50/50 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Support Hours</h2>
            </div>
            <div className="space-y-4">
              {supportHours.map((hour, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-bold text-gray-900">{hour.type}</p>
                      {hour.response && <p className="text-xs text-gray-500 mt-1">{hour.response}</p>}
                    </div>
                    <span className="px-3 py-1 bg-gray-50 rounded-full text-xs font-medium text-gray-700">{hour.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Before You Contact */}
          <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-purple-50/30">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Before You Contact Us</h3>
            <p className="text-sm text-gray-600 mb-4">To help us serve you better, please have ready:</p>
            <ul className="space-y-3">
              {[
                'Your account email address',
                'Description of your issue',
                'Relevant screenshots or error messages',
                'Browser and device information'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold text-lg flex-shrink-0 leading-none mt-0.5">•</span>
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Language Support */}
          <div className="border border-gray-100 rounded-2xl p-6 md:p-8 bg-white h-full">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Language Support</h3>
            <p className="text-sm text-gray-600 mb-6">Currently, we provide support in:</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-semibold text-sm">English</span>
              <span className="px-5 py-2.5 bg-orange-50 text-orange-700 rounded-xl font-semibold text-sm">Hindi (हिंदी)</span>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-6 md:p-10 border border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50 via-white to-gray-50 shadow-sm"
        >
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Thank You for Choosing Shrnk!</h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            We appreciate your interest and look forward to assisting you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:shrnk.contact@gmail.com"
              className="px-8 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Email Support
            </a>
            <Link
              href="/"
              className="flex items-center px-8 py-3 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};

export default ContactUsPage;