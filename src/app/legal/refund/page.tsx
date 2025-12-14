"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  DollarSign,
  CheckCircle,
  XCircle,
  Mail,
  ArrowLeft,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  FileText
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// === TYPES ===

type BaseSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

type SimpleSection = BaseSection & {
  content?: string;
  items?: string[];
  intro?: string;
  outro?: string;
  additionalItems?: string[];
};

type SubsectionWithItems = {
  title: string;
  icon: React.ReactNode;
  items: string[];
  highlight?: "green" | "red";
  steps?: never;
};

type Step = {
  label: string;
  detail: string;
  subItems?: string[];
};

type SubsectionWithSteps = {
  title: string;
  steps: Step[];
  icon?: React.ReactNode;
  items?: never;
  highlight?: never;
};

type Subsection = SubsectionWithItems | SubsectionWithSteps;

type SectionWithSubsections = BaseSection & {
  subsections: Subsection[];
};

type Section = SimpleSection | SectionWithSubsections;

// Type Guards
const hasSubsections = (section: Section): section is SectionWithSubsections =>
  "subsections" in section;

const hasItems = (subsection: Subsection): subsection is SubsectionWithItems =>
  "items" in subsection;

const hasSteps = (subsection: Subsection): subsection is SubsectionWithSteps =>
  "steps" in subsection;

const RefundPolicyPage = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["commitment"])
  );

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
      id: "commitment",
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Our Commitment",
      content:
        "At Shrnk, we strive to provide the best URL shortening service. We understand that circumstances may arise where you need a refund.",
    },
    {
      id: "eligibility",
      icon: <DollarSign className="w-5 h-5" />,
      title: "Refund Eligibility",
      subsections: [
        {
          title: "Eligible for Refund",
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          items: [
            "Service outage exceeding 48 consecutive hours",
            "Technical issues preventing use of paid features for more than 7 days",
            "Accidental duplicate charges",
            "Billing errors on our part",
            "Refund requests within 7 days of initial purchase (first-time subscribers only)",
          ],
          highlight: "green",
        },
        {
          title: "Not Eligible for Refund",
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          items: [
            "Change of mind after the 7-day period",
            "Failure to use the service",
            "Violation of Terms of Service leading to account suspension",
            "Partial month refunds after cancellation",
            "Third-party payment processing fees",
          ],
          highlight: "red",
        },
      ],
    },
    {
      id: "process",
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Refund Process",
      subsections: [
        {
          title: "How to Request a Refund",
          steps: [
            {
              label: "Email",
              detail: "Send a refund request to shrnk.contact@gmail.com",
            },
            {
              label: "Subject",
              detail: 'Include "Refund Request - [Your Email]"',
            },
            {
              label: "Details",
              detail: "Include:",
              subItems: [
                "Account email address",
                "Transaction ID or payment reference",
                "Reason for refund request",
                "Date of purchase",
              ],
            },
          ],
        },
        {
          title: "Processing Time",
          icon: <RefreshCw className="w-4 h-4 text-blue-600" />,
          items: [
            "Refund requests are reviewed within 3-5 business days",
            "Approved refunds are processed within 7-10 business days",
            "Refunds are issued to the original payment method",
            "Bank processing may take an additional 5-10 business days",
          ],
        },
      ],
    },
    {
      id: "free-plan",
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Free Plan",
      items: [
        "No refunds are applicable as the service is free",
        "Credits are non-transferable and have no monetary value",
      ],
    },
    {
      id: "cancellation",
      icon: <XCircle className="w-5 h-5" />,
      title: "Subscription Cancellation",
      items: [
        "Cancel anytime from your account dashboard",
        "Access continues until the end of the billing period",
        "No automatic refund upon cancellation",
        "Credits expire at the end of the subscription period",
      ],
    },
    {
      id: "partial",
      icon: <DollarSign className="w-5 h-5" />,
      title: "Partial Refunds",
      intro: "We do not offer partial refunds for:",
      items: [
        "Unused time on subscriptions",
        "Unused credits or features",
        "Downgrade from Premium to Free",
      ],
    },
    {
      id: "exceptional",
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Exceptional Circumstances",
      intro:
        "Refunds outside our standard policy may be considered on a case-by-case basis for:",
      items: [
        "Extended service disruptions",
        "Major feature failures",
        "Documented technical issues",
      ],
    },
    {
      id: "credits",
      icon: <CreditCard className="w-5 h-5" />,
      title: "Service Credits",
      intro: "Instead of refunds, we may offer:",
      items: [
        "Service credits for future use",
        "Extended subscription period",
        "Upgraded features at no additional cost",
      ],
    },
    {
      id: "payment-issues",
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Payment Gateway Issues",
      intro: "For issues related to:",
      items: [
        "Failed transactions",
        "Double charges",
        "Payment gateway errors",
      ],
      outro: "Contact our support team immediately at shrnk.contact@gmail.com with:",
      additionalItems: [
        "Transaction screenshot",
        "Payment confirmation",
        "Bank statement (if applicable)",
      ],
    },
    {
      id: "changes",
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Changes to Refund Policy",
      items: [
        "We reserve the right to modify this policy",
        "Changes effective upon posting",
        "Continued use implies acceptance of changes",
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-24 w-full bg-white"></div>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-white to-red-50/50 py-12 md:py-16 border-b border-red-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 bg-red-100 text-red-600 rounded-2xl shadow-sm">
              <DollarSign className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Refund Policy</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
                  <FileText className="w-3.5 h-3.5" />
                  Legal
                </span>
                <span>Last Updated: November 2, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Quick Contact Card */}
        <div className="mb-10 p-6 bg-white border border-red-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(239,68,68,0.1)]">
          <div className="flex gap-4">
            <div className="p-2 bg-red-50 text-red-500 rounded-xl h-fit">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-1">Need a Refund?</p>
              <p className="text-sm text-gray-600">
                Contact us at{" "}
                <a
                  href="mailto:shrnk.contact@gmail.com"
                  className="font-semibold text-red-500 hover:text-red-600 hover:underline transition-colors"
                >
                  shrnk.contact@gmail.com
                </a>{" "}
                • Response Time: 24-48 hours
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isOpen = openSections.has(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen 
                    ? "bg-white border-red-100 shadow-md shadow-red-50/50" 
                    : "bg-white border-gray-100 hover:border-red-100 hover:shadow-sm"
                )}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2.5 rounded-xl transition-colors duration-300",
                      isOpen ? "bg-red-100 text-red-600" : "bg-gray-50 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500"
                    )}>
                      {section.icon}
                    </div>
                    <h2 className={cn(
                      "text-lg font-bold text-left transition-colors duration-300",
                      isOpen ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                    )}>
                      {section.title}
                    </h2>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    <ChevronDown className={cn(
                      "w-5 h-5 transition-colors",
                      isOpen ? "text-red-500" : "text-gray-400 group-hover:text-red-400"
                    )} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-8 pt-2">
                        <div className="pl-[3.25rem]">
                          {"content" in section && section.content && (
                            <p className="text-gray-600 leading-relaxed mb-6">
                              {section.content}
                            </p>
                          )}

                          {"intro" in section && section.intro && (
                            <p className="font-semibold text-gray-900 mb-4">
                              {section.intro}
                            </p>
                          )}

                          {"items" in section && section.items && (
                            <ul className="space-y-3 mb-6">
                              {section.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm md:text-base">
                                  <span className="text-red-500 font-bold text-lg flex-shrink-0 leading-tight">
                                    •
                                  </span>
                                  <span className="text-gray-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {"outro" in section && section.outro && (
                            <p className="font-semibold text-gray-900 mb-3 mt-4">
                              {section.outro}
                            </p>
                          )}

                          {"additionalItems" in section && section.additionalItems && (
                            <ul className="space-y-3">
                              {section.additionalItems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm md:text-base">
                                  <span className="text-red-500 font-bold text-lg flex-shrink-0 leading-tight">
                                    •
                                  </span>
                                  <span className="text-gray-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {hasSubsections(section) && (
                            <div className="space-y-6">
                              {section.subsections.map((subsection, idx) => (
                                <div
                                  key={idx}
                                  className={cn(
                                    "rounded-xl p-5 border bg-white",
                                    hasItems(subsection) && subsection.highlight === "green"
                                      ? "border-green-200 bg-green-50/30"
                                      : hasItems(subsection) && subsection.highlight === "red"
                                      ? "border-red-200 bg-red-50/30"
                                      : "border-gray-200 bg-gray-50/50"
                                  )}
                                >
                                  <div className="flex items-center gap-2 mb-4">
                                    {hasItems(subsection) && subsection.icon}
                                    <h3 className="font-bold text-gray-900">
                                      {subsection.title}
                                    </h3>
                                  </div>

                                  {hasSteps(subsection) && (
                                    <ol className="space-y-4">
                                      {subsection.steps.map((step, stepIdx: number) => (
                                        <li key={stepIdx} className="relative pl-6">
                                          {stepIdx !== subsection.steps.length - 1 && (
                                            <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-gray-200"></div>
                                          )}
                                          <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-red-500 rounded-full flex items-center justify-center text-xs font-bold text-red-500">
                                            {stepIdx + 1}
                                          </div>
                                          <div className="ml-4">
                                            <span className="font-bold text-gray-900 block mb-1">
                                              {step.label}
                                            </span>
                                            <span className="text-gray-600 text-sm block">
                                              {step.detail}
                                            </span>
                                            {step.subItems && (
                                              <ul className="mt-2 space-y-1.5 p-3 bg-gray-50 rounded-lg">
                                                {step.subItems.map((subItem, subIdx) => (
                                                  <li
                                                    key={subIdx}
                                                    className="flex items-start gap-2 text-xs text-gray-600"
                                                  >
                                                    <span className="text-red-400 mt-0.5">
                                                      →
                                                    </span>
                                                    <span>
                                                      {subItem}
                                                    </span>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </div>
                                        </li>
                                      ))}
                                    </ol>
                                  )}

                                  {hasItems(subsection) && (
                                    <ul className="space-y-2.5">
                                      {subsection.items.map((item, itemIdx) => (
                                        <li
                                          key={itemIdx}
                                          className="flex items-start gap-3 text-sm"
                                        >
                                          <span
                                            className={cn("font-bold text-lg flex-shrink-0 mt-[-4px]", 
                                              subsection.highlight === "green"
                                                ? "text-green-500"
                                                : subsection.highlight === "red"
                                                ? "text-red-500"
                                                : "text-gray-400"
                                            )}
                                          >
                                            •
                                          </span>
                                          <span className="text-gray-600">{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mt-12 p-8 bg-gradient-to-br from-gray-900 to-black text-white border border-gray-800 rounded-3xl text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gray-800 text-white rounded-2xl mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-white mb-2">Refund Inquiries</h3>
          <p className="text-gray-400 mb-6">
            If you have any questions about refunds, please contact us.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="mailto:shrnk.contact@gmail.com" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                shrnk.contact@gmail.com
              </a>
              <div className="text-gray-400 text-sm">
                Processing Time: 7-10 business days
              </div>
          </div>
        </motion.div>

        {/* Compliance Notice */}
        <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-2xl text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Note: This refund policy complies with Indian consumer protection laws.
          </p>
          <p className="text-xs text-gray-500">
            For any questions or concerns, please contact support.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicyPage;

