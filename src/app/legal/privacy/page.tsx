'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, Lock, Eye, Database, Globe, UserCheck, Mail, ArrowLeft, Cookie, FileText, DollarSign, RefreshCw, XCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Subsection {
  title: string;
  subtitle?: string;
  items?: string[];
  subtitle2?: string;
  items2?: string[];
}

interface ShareCategory {
  title: string;
  items: string[];
}

interface Section {
  id: string;
  icon: React.ReactNode;
  title: string;
  content?: string;
  intro?: string;
  items?: string[];
  weDoNot?: string[];
  weMayShare?: ShareCategory[];
  weTrack?: string[];
  weUse?: string[];
  subsections?: Subsection[];
}

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

  const sections: Section[] = [
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
    },
    {
      id: 'return-refund',
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Return & Refund Policy',
      content: 'This section outlines our policy regarding returns and refunds for premium subscriptions and services.',
      subsections: [
        {
          title: 'Refund Eligibility & Duration',
          subtitle: 'Eligible for Refund (Within 7 Days):',
          items: [
            'First-time subscribers: Full refund within 7 days of initial purchase',
            'Service outage exceeding 48 consecutive hours',
            'Technical issues preventing use of paid features for more than 7 days',
            'Accidental duplicate charges',
            'Billing errors on our part'
          ],
          subtitle2: 'Not Eligible for Refund:',
          items2: [
            'Change of mind after the 7-day period',
            'Failure to use the service',
            'Violation of Terms of Service leading to account suspension',
            'Partial month refunds after cancellation',
            'Third-party payment processing fees'
          ]
        },
        {
          title: 'Refund Processing Duration',
          subtitle: 'Processing Timeline:',
          items: [
            'Refund request review: 3-5 business days',
            'Approved refund processing: 7-10 business days',
            'Bank processing time: Additional 5-10 business days',
            'Total estimated time: 15-25 business days from request to receipt'
          ]
        },
        {
          title: 'Refund Modes',
          subtitle: 'Refund Methods:',
          items: [
            'Original payment method: Refunds issued to the same payment method used for purchase',
            'Credit/Debit cards: Refunded to original card (appears in 5-10 business days)',
            'Digital wallets: Refunded to original wallet account',
            'Bank transfers: Processed via original payment gateway',
            'Note: Refunds cannot be transferred to different payment methods'
          ]
        },
        {
          title: 'How to Request a Refund',
          subtitle: 'Refund Request Process:',
          items: [
            'Email your request to shrnk.contact@gmail.com',
            'Subject line: "Refund Request - [Your Email]"',
            'Include: Account email, Transaction ID, Reason for refund, Date of purchase',
            'Response time: 24-48 hours for initial acknowledgment',
            'Processing begins after approval'
          ]
        },
        {
          title: 'Free Plan',
          subtitle: 'No Refunds:',
          items: [
            'Free plan users: No refunds applicable as service is free',
            'Credits are non-transferable and have no monetary value',
            'Free credits cannot be refunded or exchanged'
          ]
        }
      ]
    },
    {
      id: 'cancellation',
      icon: <XCircle className="w-5 h-5" />,
      title: 'Cancellation Policy',
      content: 'This section explains how you can cancel your subscription and what happens when you do.',
      subsections: [
        {
          title: 'Cancellation Duration & Process',
          subtitle: 'Cancellation Timeline:',
          items: [
            'Cancellation request processing: Immediate (within 24 hours)',
            'Access duration: Premium features remain active until end of current billing period',
            'Effective cancellation: Takes effect at the end of the current billing cycle',
            'No immediate termination: Service continues until paid period expires'
          ]
        },
        {
          title: 'How to Cancel',
          subtitle: 'Cancellation Methods:',
          items: [
            'Account Dashboard: Cancel anytime from your account settings',
            'Email Request: Send cancellation request to shrnk.contact@gmail.com',
            'Include: Account email and reason for cancellation (optional)',
            'Confirmation: You will receive email confirmation within 24 hours'
          ]
        },
        {
          title: 'Cancellation Duration Details',
          subtitle: 'Monthly Subscriptions:',
          items: [
            'Cancellation before renewal: Prevents next billing cycle',
            'Remaining access: Full access until end of current month',
            'Example: Cancel on day 15, access continues until day 30/31',
            'No prorated refunds: Partial month refunds not available'
          ],
          subtitle2: 'Annual Subscriptions:',
          items2: [
            'Cancellation anytime: Can cancel at any point during annual period',
            'Remaining access: Full access until end of annual billing period',
            'Example: Cancel after 6 months, access continues for remaining 6 months',
            'No prorated refunds: Partial year refunds not available'
          ]
        },
        {
          title: 'What Happens After Cancellation',
          subtitle: 'Post-Cancellation:',
          items: [
            'Premium features: Access continues until billing period ends',
            'Link expiration: Premium links remain active until their set expiration',
            'Data retention: Your data and links are retained for 30 days',
            'Account status: Account downgrades to free plan after billing period',
            'Credits: Unused premium credits expire at end of subscription period'
          ]
        },
        {
          title: 'Reactivation',
          subtitle: 'Resubscribing:',
          items: [
            'Reactivation: Can resubscribe anytime from account dashboard',
            'Immediate access: Premium features restored immediately upon payment',
            'Previous data: All your previous links and data remain intact',
            'Billing: New billing cycle starts from reactivation date'
          ]
        },
        {
          title: 'Cancellation by Shrnk',
          subtitle: 'We May Cancel Your Subscription If:',
          items: [
            'Violation of Terms of Service: Immediate cancellation without refund',
            'Fraudulent activity: Account suspended and subscription cancelled',
            'Payment failure: Subscription cancelled after 3 failed payment attempts',
            'Notice period: 7 days notice for non-payment related cancellations'
          ]
        }
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
              <h1 className="text-4xl sm:text-2xl font-black mb-2">Privacy, Refund & Cancellation Policy</h1>
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
            This comprehensive policy covers Data Privacy, Return & Refund Policy (with duration and refund modes), and Cancellation Policy (with duration). Your privacy and satisfaction are important to us.
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