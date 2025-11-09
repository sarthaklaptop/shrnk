"use client"

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, Shield, Users, AlertCircle, FileText, Lock, Mail } from 'lucide-react';

const TermsPage = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: 'acceptance',
      icon: <Scale className="w-5 h-5" />,
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Shrnk ("Service"), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our Service.'
    },
    {
      id: 'description',
      icon: <FileText className="w-5 h-5" />,
      title: '2. Description of Service',
      content: 'Shrnk provides URL shortening services that allow users to create shortened links from long URLs. We offer both free and premium subscription plans with varying features and limitations.'
    },
    {
      id: 'accounts',
      icon: <Users className="w-5 h-5" />,
      title: '3. User Accounts',
      subsections: [
        {
          title: '3.1 Registration',
          items: [
            'You may use our Service without registration with limited features',
            'Registered users gain access to additional features including link management, analytics, and extended link expiration',
            'You must provide accurate and complete information during registration',
            'You are responsible for maintaining the confidentiality of your account credentials'
          ]
        },
        {
          title: '3.2 Account Types',
          items: [
            'Free Users: Limited to 10 credits with monthly renewal, 24-hour link expiration for non-registered users',
            'Premium Users: Enhanced features including password-protected links, custom analytics, and extended link validity'
          ]
        }
      ]
    },
    {
      id: 'acceptable-use',
      icon: <Shield className="w-5 h-5" />,
      title: '4. Acceptable Use Policy',
      intro: 'You agree NOT to use our Service to:',
      items: [
        'Create links to illegal content or content that violates any applicable laws',
        'Distribute malware, viruses, or harmful code',
        'Engage in phishing, fraud, or deceptive practices',
        'Harass, abuse, or harm others',
        'Violate intellectual property rights',
        'Spam or send unsolicited communications',
        'Create links to adult content without proper age verification',
        'Circumvent any security features of the Service'
      ]
    },
    {
      id: 'link-management',
      icon: <FileText className="w-5 h-5" />,
      title: '5. Link Management',
      subsections: [
        {
          title: '5.1 Link Expiration',
          items: [
            'Non-registered user links: Expire after 24 hours',
            'Registered free user links: Expire after 1 year',
            'Premium user links: Custom expiration settings available'
          ]
        },
        {
          title: '5.2 Link Deletion',
          items: [
            'We reserve the right to delete links that violate our terms',
            'Users can delete their own links at any time',
            'Expired links are automatically removed from our system'
          ]
        }
      ]
    },
    {
      id: 'premium',
      icon: <Lock className="w-5 h-5" />,
      title: '6. Premium Subscriptions',
      subsections: [
        {
          title: '6.1 Billing',
          items: [
            'Premium subscriptions are billed monthly or annually',
            'All fees are non-refundable except as required by law',
            'Prices are subject to change with 30 days notice'
          ]
        },
        {
          title: '6.2 Cancellation',
          items: [
            'You may cancel your subscription at any time',
            'Access to premium features continues until the end of the billing period',
            'No refunds for partial months'
          ]
        }
      ]
    },
    {
      id: 'prohibited',
      icon: <AlertCircle className="w-5 h-5" />,
      title: '12. Prohibited Content',
      intro: 'Links to the following are strictly prohibited:',
      items: [
        'Illegal drugs or controlled substances',
        'Weapons or explosives',
        'Child exploitation material',
        'Terrorist content',
        'Pirated content or copyright violations',
        'Explicit adult content (without age verification)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-300 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Terms & Conditions</h1>
              <p className="text-gray-600 mt-1">Last Updated: November 2, 2025</p>
            </div>
          </div>
          
          <div className="bg-yellow-100 border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
            <p className="text-sm font-medium">
              📋 By using Shrnk, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Links */}
        <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0)] mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  toggleSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 border-2 border-black rounded-lg transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] flex items-center gap-2 text-sm font-medium"
              >
                {section.icon}
                <span className="line-clamp-1">{section.title.split('. ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className="bg-white border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0)] overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 border-2 border-black rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-left">{section.title}</h2>
                </div>
                {openSection === section.id ? (
                  <ChevronUp className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 flex-shrink-0" />
                )}
              </button>

              {openSection === section.id && (
                <div className="px-6 pb-6 pt-2 border-t-2 border-black bg-gray-50">
                  {section.content && (
                    <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                  )}
                  
                  {section.intro && (
                    <p className="font-semibold text-gray-900 mb-3">{section.intro}</p>
                  )}

                  {section.items && (
                    <ul className="space-y-2 ml-4">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-red-500 font-bold mt-1">•</span>
                          <span className="text-gray-700 flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && (
                    <div className="space-y-4">
                      {section.subsections.map((subsection, idx) => (
                        <div key={idx} className="bg-white border-2 border-gray-300 rounded-lg p-4">
                          <h3 className="font-bold text-gray-900 mb-3">{subsection.title}</h3>
                          <ul className="space-y-2">
                            {subsection.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-3">
                                <span className="text-red-500 font-bold mt-1">•</span>
                                <span className="text-gray-700 flex-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Important Sections */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Limitation of Liability
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• The Service is provided &quot;AS IS&quot; without warranties</li>
              <li>• We are not liable for indirect or consequential damages</li>
              <li>• Our total liability shall not exceed amount paid in last 12 months</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Changes to Terms
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• We may update these terms at any time</li>
              <li>• Continued use after changes constitutes acceptance</li>
              <li>• Significant changes will be notified via email</li>
            </ul>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="bg-black text-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)] mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6" />
            <h3 className="font-bold text-xl">Questions About These Terms?</h3>
          </div>
          <p className="text-gray-300 mb-4">
            If you have any questions or concerns about these Terms and Conditions, please contact us:
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:shrnk.contact@gmail.com"
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg border-2 border-white hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              shrnk.contact@gmail.com
            </a>
            <div className="px-4 py-2 bg-gray-800 text-white rounded-lg border-2 border-gray-700">
              📍 Pune, Maharashtra, India
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-gradient-to-r from-yellow-100 to-red-100 border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0)] mt-4">
          <h3 className="font-bold text-lg mb-2">⚖️ Governing Law</h3>
          <p className="text-gray-700">
            These terms are governed by the laws of India. Disputes will be resolved in the courts of Pune, Maharashtra.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;