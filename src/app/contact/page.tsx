'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, DollarSign, Shield, AlertTriangle, Bug, Lightbulb, Newspaper, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ContactUsPage = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'General Inquiries',
      email: 'shrnk.contact@gmail.com',
      response: 'Within 24 hours',
      color: 'blue'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Customer Support',
      email: 'shrnk.contact@gmail.com',
      response: 'Within 12-24 hours',
      description: 'Priority support for premium users',
      color: 'green'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Refunds & Billing',
      email: 'shrnk.contact@gmail.com',
      response: 'Within 24-48 hours',
      color: 'yellow'
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Report Abuse',
      email: 'shrnk.contact@gmail.com',
      description: 'Report malicious links or ToS violations',
      color: 'red'
    },
    {
      icon: <Bug className="w-6 h-6" />,
      title: 'Report a Bug',
      email: 'shrnk.contact@gmail.com',
      description: 'Include screenshots and steps to reproduce',
      color: 'orange'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Feature Requests',
      email: 'shrnk.contact@gmail.com',
      description: 'Share your ideas to improve Shrnk',
      color: 'yellow'
    },
    {
      icon: <Newspaper className="w-6 h-6" />,
      title: 'Press & Media',
      email: 'shrnk.contact@gmail.com',
      description: 'For press inquiries and media kits',
      color: 'indigo'
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
            <div className="p-3 bg-green-50 border-2 border-black rounded-lg">
              <Mail className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-black mb-2">Contact Us</h1>
              <p className="text-gray-600 font-medium">Were here to help! Get in touch with us.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Quick Note */}
        <div className="mb-8 p-4 bg-blue-50 border-2 border-black rounded-lg">
          <p className="font-semibold">
            💬 We value your feedback and are committed to providing excellent customer service!
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactMethods.map((method, idx) => (
              <motion.a
                key={idx}
                href={`mailto:${method.email}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`block border-2 border-black rounded-lg p-5 bg-${method.color}-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200`}
              >
                <div className="p-2 bg-white border-2 border-black rounded-lg w-fit mb-3">
                  {method.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                <p className="text-sm font-mono text-blue-600 hover:underline break-all">
                  {method.email}
                </p>
                {method.response && (
                  <p className="text-xs text-gray-600 mt-2">⏱️ {method.response}</p>
                )}
                {method.description && (
                  <p className="text-sm text-gray-700 mt-2">{method.description}</p>
                )}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:supportshrnk.contact@gmail.com"
              className="flex items-center gap-4 bg-white border-2 border-black rounded-lg p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
            >
              <div className="p-3 bg-green-100 border-2 border-black rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">Email Support</p>
                <p className="text-sm text-gray-600">shrnk.contact@gmail.com</p>
              </div>
            </a>
            <a
              href="mailto:shrnk.contact@gmail.com"
              className="flex items-center gap-4 bg-white border-2 border-black rounded-lg p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
            >
              <div className="p-3 bg-blue-100 border-2 border-black rounded-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold">General Inquiries</p>
                <p className="text-sm text-gray-600">shrnk.contact@gmail.com</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Expected Response Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-white mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Expected Response Times</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left p-3 font-bold">Inquiry Type</th>
                  <th className="text-left p-3 font-bold">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {responseTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 text-gray-700">{row.inquiry}</td>
                    <td className="p-3 text-gray-700 font-mono text-sm">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Support Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-yellow-50 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Support Hours</h2>
          </div>
          <div className="space-y-3">
            {supportHours.map((hour, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 bg-white border-2 border-black rounded-lg p-4">
                <div>
                  <p className="font-bold text-gray-900">{hour.type}</p>
                  {hour.response && <p className="text-sm text-gray-600 mt-1">{hour.response}</p>}
                </div>
                <p className="text-sm font-mono text-gray-700 text-right whitespace-nowrap">{hour.hours}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Office Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-white mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Office Location</h2>
          </div>
          <div className="bg-gray-50 border-2 border-black rounded-lg p-4">
            <p className="font-bold text-lg mb-2">Shrnk</p>
            <p className="text-gray-700">Pune, Maharashtra</p>
            <p className="text-gray-700">India</p>
            <p className="text-sm text-gray-600 mt-3 italic">
              Note: We operate remotely with team members across multiple time zones to provide better support coverage.
            </p>
          </div>
        </motion.div>

        {/* Before You Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-purple-50 mb-8"
        >
          <h3 className="font-bold text-lg mb-4">Before You Contact Us</h3>
          <p className="text-gray-700 mb-3">To help us serve you better, please have ready:</p>
          <ul className="space-y-2">
            {[
              'Your account email address',
              'Description of your issue',
              'Relevant screenshots or error messages',
              'Browser and device information (for technical issues)'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Language Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-black rounded-lg p-6 bg-white mb-8"
        >
          <h3 className="font-bold text-lg mb-4">Language Support</h3>
          <p className="text-gray-700 mb-3">Currently, we provide support in:</p>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-blue-50 border-2 border-black rounded-lg font-medium">English</span>
            <span className="px-4 py-2 bg-orange-50 border-2 border-black rounded-lg font-medium">Hindi (हिंदी)</span>
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 border-2 border-black rounded-lg bg-gradient-to-r from-green-50 to-blue-50"
        >
          <h3 className="text-xl font-bold mb-2">Thank You for Choosing Shrnk!</h3>
          <p className="text-gray-700 mb-4">
            We appreciate your interest and look forward to assisting you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:supportshrnk.contact@gmail.com"
              className="px-6 py-2 bg-black text-white font-bold rounded-lg border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
            >
              Email Support
            </a>
            <Link
              href="/"
              className="px-6 py-2 bg-white text-black font-bold rounded-lg border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUsPage;