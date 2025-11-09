'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Lock, Eye, Database, Globe, UserCheck, Mail, ArrowLeft, Cookie, FileText } from 'lucide-react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['introduction']));

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const sections = [
    {
      id: 'introduction',
      icon: <Shield className="w-5 h-5" />,
      title: 'Introduction',
      content: 'Shrnk ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service.'
    },
    {
      id: 'collection',
      icon: <Database className="w-5 h-5" />,
      title: 'Information We Collect',
      subsections: [
        {
          title: '1. Information You Provide',
          subtitle: 'Account Information:',
          items: [
            'Email address (via OAuth)',
            'Name (via OAuth)',
            'Profile picture (via OAuth)'
          ],
          subtitle2: 'Link Data:',
          items2: [
            'URLs you shorten',
            'Custom passwords for links',
            'Link expiration preferences'
          ]
        },
        {
          title: '2. Automatically Collected Information',
          subtitle: 'Usage Data:',
          items: [
            'IP address',
            'Browser type and version',
            'Device type (desktop/mobile)',
            'Operating system',
            'Geographic location (city and country)',
            'Click timestamps',
            'Referrer URLs'
          ],
          subtitle2: 'Cookies and Tracking:',
          items2: [
            'Session cookies for authentication',
            'Analytics cookies',
            'Preference cookies',
            'Security cookies'
          ]
        },
        {
          title: '3. Third-Party Data',
          subtitle: 'OAuth Authentication:',
          items: [
            'Google account information (name, email, profile picture)'
          ]
        }
      ]
    },
    {
      id: 'usage',
      icon: <Eye className="w-5 h-5" />,
      title: 'How We Use Your Information',
      subsections: [
        {
          title: 'Service Provision',
          items: [
            'Create and manage shortened URLs',
            'Process redirects',
            'Authenticate users',
            'Maintain account security'
          ]
        },
        {
          title: 'Analytics and Improvements',
          items: [
            'Track link performance and clicks',
            'Analyze usage patterns',
            'Improve service functionality',
            'Develop new features'
          ]
        },
        {
          title: 'Communication',
          items: [
            'Send service updates',
            'Respond to inquiries',
            'Send security alerts',
            'Deliver subscription confirmations'
          ]
        },
        {
          title: 'Security',
          items: [
            'Detect and prevent fraud',
            'Protect against malicious activity',
            'Enforce Terms of Service',
            'Comply with legal obligations'
          ]
        }
      ]
    },
    {
      id: 'storage',
      icon: <Lock className="w-5 h-5" />,
      title: 'Data Storage and Security',
      subsections: [
        {
          title: 'Storage',
          items: [
            'Data stored on secure servers',
            'Database: PostgreSQL with encryption',
            'Hosting: Vercel (global infrastructure)',
            'Backups: Regular automated backups'
          ]
        },
        {
          title: 'Security Measures',
          items: [
            'Industry-standard encryption (SSL/TLS)',
            'Password hashing (bcrypt)',
            'Secure session management',
            'Regular security audits',
            'Access controls and authentication'
          ]
        },
        {
          title: 'Data Retention',
          items: [
            'Active accounts: Data retained indefinitely',
            'Inactive accounts (2+ years): Subject to deletion after notice',
            'Deleted accounts: Data removed within 30 days',
            'Link analytics: Retained for statistical purposes',
            'Expired links: Deleted automatically'
          ]
        }
      ]
    },
    {
      id: 'sharing',
      icon: <Globe className="w-5 h-5" />,
      title: 'Data Sharing and Disclosure',
      weDoNot: [
        'Sell your personal information',
        'Share data with advertisers',
        'Rent user lists',
        'Disclose data for marketing purposes'
      ],
      weMayShare: [
        {
          title: 'Service Providers:',
          items: [
            'Cloud hosting providers (Vercel)',
            'Database providers',
            'Analytics services (aggregate data only)',
            'Payment processors (for premium subscriptions)'
          ]
        },
        {
          title: 'Business Transfers:',
          items: [
            'In case of merger, acquisition, or sale of assets',
            'Users will be notified in advance'
          ]
        }
      ]
    },
    {
      id: 'rights',
      icon: <UserCheck className="w-5 h-5" />,
      title: 'Your Rights and Choices',
      subsections: [
        {
          title: 'Access and Control',
          items: [
            'View your personal data',
            'Download your data',
            'Update account information',
            'Delete your account'
          ]
        },
        {
          title: 'Cookie Preferences',
          items: [
            'Manage cookie settings in your browser',
            'Opt-out of analytics cookies',
            'Essential cookies cannot be disabled'
          ]
        },
        {
          title: 'Marketing Communications',
          items: [
            'Unsubscribe from emails',
            'Manage notification preferences',
            'Opt-out of promotional content'
          ]
        },
        {
          title: 'Data Deletion',
          items: [
            'Request account deletion',
            'Remove specific links',
            'Export your data before deletion'
          ]
        }
      ]
    },
    {
      id: 'children',
      icon: <Shield className="w-5 h-5" />,
      title: 'Children\'s Privacy',
      items: [
        'Our service is not intended for users under 18',
        'We do not knowingly collect data from minors',
        'Parents may contact us to remove minor\'s data'
      ]
    },
    {
      id: 'international',
      icon: <Globe className="w-5 h-5" />,
      title: 'International Data Transfers',
      items: [
        'Data may be transferred globally',
        'We ensure adequate protection measures',
        'Compliance with applicable data protection laws'
      ]
    },
    {
      id: 'analytics',
      icon: <Eye className="w-5 h-5" />,
      title: 'Analytics and Tracking',
      weTrack: [
        'Click counts',
        'Geographic data (city/country level)',
        'Device types',
        'Referrer information',
        'Time and date of clicks'
      ],
      weUse: [
        'First-party analytics',
        'No third-party advertising trackers',
        'Aggregate data for insights'
      ]
    },
    {
      id: 'changes',
      icon: <FileText className="w-5 h-5" />,
      title: 'Changes to Privacy Policy',
      items: [
        'We may update this policy periodically',
        'Changes effective upon posting',
        'Significant changes notified via email',
        'Continued use implies acceptance'
      ]
    }
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
            <div className="p-3 bg-red-300 border-2 border-black rounded-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-2xl font-black mb-2">Privacy Policy</h1>
              <p className="text-gray-600 text-sm font-medium">Last Updated: November 2, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Important Notice */}
        <div className="mb-8 p-4 bg-red-300 border-2 border-black rounded-lg">
          <p className="font-semibold">
            Your privacy is important to us. This policy explains how we handle your data with transparency and care.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = openSections.has(section.id);
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-black rounded-lg overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 bg-red-300 border-2 border-black rounded-lg flex-shrink-0">
                      {section.icon}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-left">
                      {section.title}
                    </h2>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-6 h-6 flex-shrink-0" />
                  </motion.div>
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t-2 border-black"
                  >
                    <div className="p-4 sm:p-6 bg-red-50">
                      {section.content && (
                        <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                      )}
                      
                      {section.intro && (
                        <p className="font-semibold text-gray-900 mb-3">{section.intro}</p>
                      )}

                      {section.items && (
                        <ul className="space-y-2">
                          {section.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-red-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.weDoNot && (
                        <div className="mb-4">
                          <p className="font-bold text-red-600 mb-3">❌ We DO NOT:</p>
                          <ul className="space-y-2 ml-4">
                            {section.weDoNot.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="text-red-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.weMayShare && (
                        <div>
                          <p className="font-bold text-green-600 mb-3">✅ We MAY Share Data With:</p>
                          <div className="space-y-3">
                            {section.weMayShare.map((category, idx) => (
                              <div key={idx} className="border-2 border-black rounded-lg p-4 bg-white">
                                <h4 className="font-bold text-gray-900 mb-2">{category.title}</h4>
                                <ul className="space-y-1">
                                  {category.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-2">
                                      <span className="text-green-500 text-sm">→</span>
                                      <span className="text-sm text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.weTrack && (
                        <div className="mb-4">
                          <p className="font-semibold text-gray-900 mb-2">We Track:</p>
                          <ul className="space-y-2 ml-4">
                            {section.weTrack.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="text-red-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.weUse && (
                        <div>
                          <p className="font-semibold text-gray-900 mb-2">We Use:</p>
                          <ul className="space-y-2 ml-4">
                            {section.weUse.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="text-red-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {section.subsections && (
                        <div className="space-y-4">
                          {section.subsections.map((subsection, idx) => (
                            <div key={idx} className="border-2 border-black rounded-lg p-4 bg-white">
                              <h3 className="font-bold text-gray-900 mb-3">{subsection.title}</h3>
                              
                              {subsection.subtitle && (
                                <p className="font-semibold text-gray-800 mb-2 text-sm">{subsection.subtitle}</p>
                              )}
                              
                              {subsection.items && (
                                <ul className="space-y-2 mb-3">
                                  {subsection.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-3">
                                      <span className="text-red-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {subsection.subtitle2 && (
                                <p className="font-semibold text-gray-800 mb-2 text-sm mt-3">{subsection.subtitle2}</p>
                              )}

                              {subsection.items2 && (
                                <ul className="space-y-2">
                                  {subsection.items2.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-3">
                                      <span className="text-red-500 font-bold text-lg flex-shrink-0 mt-0.5">•</span>
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-red-300 text-black border-2 border-black rounded-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6" />
            <h3 className="font-bold text-xl">Privacy Inquiries</h3>
          </div>
          <div className="space-y-2">
            <p className="">
              Email: <a href="mailto:shrnk.contact@gmail.com" className=" font-bold underline">shrnk.contact@gmail.com</a>
            </p>
            <p className="">Response Time: Within 30 days</p>
          </div>
        </motion.div>

        {/* Consent Notice */}
        <div className="mt-4 p-4 bg-red-300 border-2 border-black rounded-lg">
          <p className="text-sm font-medium">
            By using Shrnk, you consent to this Privacy Policy and our collection and use of information as described.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;