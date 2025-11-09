"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  DollarSign,
  CheckCircle,
  XCircle,
  Mail,
  ArrowLeft,
  AlertTriangle,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

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
};

type Step = {
  label: string;
  detail: string;
  subItems?: string[];
};

type SubsectionWithSteps = {
  title: string;
  steps: Step[];
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
          icon: "",
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
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-2xl font-black mb-2">
                Refund Policy
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Last Updated: November 2, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Quick Contact Card */}
        <div className="mb-8 p-4 bg-red-300 border-2 border-black rounded-lg">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Need a Refund?</p>
              <p className="text-sm text-gray-700">
                Contact us at{" "}
                <a
                  href="mailto:shrnk.contact@gmail.com"
                  className="font-bold underline"
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
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t-2 border-black"
                  >
                    <div className="p-4 sm:p-6 bg-gray-50">
                      {"content" in section && section.content && (
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {section.content}
                        </p>
                      )}

                      {"intro" in section && section.intro && (
                        <p className="font-semibold text-gray-900 mb-3">
                          {section.intro}
                        </p>
                      )}

                      {"items" in section && section.items && (
                        <ul className="space-y-2 mb-4">
                          {section.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <span className="text-red-500 font-bold text-lg flex-shrink-0">
                                •
                              </span>
                              <span className="text-gray-700">{item}</span>
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
                        <ul className="space-y-2">
                          {section.additionalItems.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <span className="text-red-500 font-bold text-lg flex-shrink-0">
                                •
                              </span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {hasSubsections(section) && (
                        <div className="space-y-4">
                          {section.subsections.map((subsection, idx) => (
                            <div
                              key={idx}
                              className={`border-2 border-black rounded-lg p-4 bg-white ${
                                hasItems(subsection) && subsection.highlight === "green"
                                  ? "border-l-4 border-l-green-500"
                                  : hasItems(subsection) && subsection.highlight === "red"
                                  ? "border-l-4 border-l-red-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                {hasItems(subsection) && subsection.icon}
                                <h3 className="font-bold text-gray-900">
                                  {subsection.title}
                                </h3>
                              </div>

                              {hasSteps(subsection) && (
                                <ol className="space-y-3">
                                  {subsection.steps.map((step, stepIdx: number) => (
                                    <li key={stepIdx}>
                                      <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-red-100 border-2 border-black rounded-full flex items-center justify-center text-sm font-bold">
                                          {stepIdx + 1}
                                        </span>
                                        <div className="flex-1">
                                          <span className="font-semibold text-gray-900">
                                            {step.label}:{" "}
                                          </span>
                                          <span className="text-gray-700">
                                            {step.detail}
                                          </span>
                                          {step.subItems && (
                                            <ul className="mt-2 ml-4 space-y-1">
                                              {step.subItems.map((subItem, subIdx) => (
                                                <li
                                                  key={subIdx}
                                                  className="flex items-start gap-2"
                                                >
                                                  <span className="text-red-500 text-sm">
                                                    →
                                                  </span>
                                                  <span className="text-sm text-gray-600">
                                                    {subItem}
                                                  </span>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ol>
                              )}

                              {hasItems(subsection) && (
                                <ul className="space-y-2">
                                  {subsection.items.map((item, itemIdx) => (
                                    <li
                                      key={itemIdx}
                                      className="flex items-center gap-3"
                                    >
                                      <span
                                        className={`font-bold text-lg flex-shrink-0 ${
                                          subsection.highlight === "green"
                                            ? "text-green-500"
                                            : subsection.highlight === "red"
                                            ? "text-red-500"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        •
                                      </span>
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
            <h3 className="font-bold text-xl">Contact for Refunds</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="mb-2">
                Email:{" "}
                <a
                  href="mailto:shrnk.contact@gmail.com"
                  className="font-bold underline"
                >
                  shrnk.contact@gmail.com
                </a>
              </p>
              <p className="mb-2">Response Time: Within 24-48 hours</p>
              <p>Processing Time: 7-10 business days after approval</p>
            </div>
          </div>
        </motion.div>

        {/* Compliance Notice */}
        <div className="mt-4 p-4 bg-yellow-50 border-2 border-black rounded-lg">
          <p className="text-sm font-medium">
            <span className="font-bold">Note:</span> This refund policy complies
            with Indian consumer protection laws and Reserve Bank of India
            guidelines.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            For any questions or concerns, please contact us at{" "}
            <a href="mailto:shrnk.contact@gmail.com" className="font-bold underline">
              shrnk.contact@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;