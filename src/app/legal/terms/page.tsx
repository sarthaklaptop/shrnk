'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, Shield, Users, AlertCircle, FileText, Lock, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24 w-full bg-white"></div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-white to-red-50/50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 text-red-500 rounded-3xl mb-6 shadow-sm">
            <Scale className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-gray-900">
            Terms & Conditions
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        
        {/* Quick Navigation */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  toggleSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-left p-3 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all hover:shadow-md flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                {/* Clone icon with distinct class if needed, or just render */}
                <span className="text-red-500">{section.icon}</span>
                <span className="line-clamp-1">{section.title.split('. ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              className={`bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300 ${openSection === section.id ? 'shadow-md ring-1 ring-red-100' : 'shadow-sm hover:shadow-md'}`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${openSection === section.id ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-left text-gray-900">{section.title}</h2>
                </div>
                {openSection === section.id ? (
                  <ChevronUp className="w-6 h-6 flex-shrink-0 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 flex-shrink-0 text-gray-400" />
                )}
              </button>

              {openSection === section.id && (
                <div className="px-6 pb-8 pt-2">
                  <div className="h-px w-full bg-gray-100 mb-6"></div>
                  
                  {section.content && (
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">{section.content}</p>
                  )}
                  
                  {section.intro && (
                    <p className="font-bold text-gray-900 mb-4">{section.intro}</p>
                  )}

                  {section.items && (
                    <ul className="space-y-3 ml-2 mb-6">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-red-500 font-bold mt-1.5">•</span>
                          <span className="text-gray-600 flex-1 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subsections && (
                    <div className="space-y-6">
                      {section.subsections.map((subsection, idx) => (
                        <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6">
                          <h3 className="font-bold text-gray-900 mb-4 text-lg">{subsection.title}</h3>
                          <ul className="space-y-3">
                            {subsection.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-3">
                                <span className="text-red-400 font-bold mt-1.5">•</span>
                                <span className="text-gray-600 flex-1 leading-relaxed">{item}</span>
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

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* Limitation of Liability */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-red-500">
               <Shield className="w-6 h-6" />
               <h3 className="font-bold text-xl text-gray-900">Limitation of Liability</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-2"><span className="text-red-300">•</span> Service provided &quot;AS IS&quot;</li>
              <li className="flex gap-2"><span className="text-red-300">•</span> Not liable for indirect damages</li>
              <li className="flex gap-2"><span className="text-red-300">•</span> Liability capped at 12 months fees</li>
            </ul>
          </div>

          {/* Changes to Terms */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4 text-red-500">
               <AlertCircle className="w-6 h-6" />
               <h3 className="font-bold text-xl text-gray-900">Changes to Terms</h3>
            </div>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-2"><span className="text-red-300">•</span> Updates may occur anytime</li>
              <li className="flex gap-2"><span className="text-red-300">•</span> Continued use = acceptance</li>
              <li className="flex gap-2"><span className="text-red-300">•</span> Major changes notified via email</li>
            </ul>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-red-400" />
            <h3 className="font-bold text-xl">Questions About These Terms?</h3>
          </div>
          <p className="text-gray-300 mb-6 font-medium">
            If you have any questions or concerns about these Terms and Conditions, please contact us:
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:shrnk.contact@gmail.com"
              className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              shrnk.contact@gmail.com
            </a>
            <div className="px-6 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-700 flex items-center gap-2">
              <span>📍</span> Pune, Maharashtra, India
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;