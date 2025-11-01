// app/link-not-found/page.tsx
"use client";

import Link from "next/link";
import { Home, Link as LinkIcon, AlertCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LinkNotFoundPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-lg border-[1px] border-gray-300 p-8 space-y-8">
          {/* Animated Icon */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100"
              >
                <AlertCircle
                  className="w-12 h-12 text-red-500"
                  strokeWidth={2}
                />
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-300 shadow-sm"
              >
                <LinkIcon className="w-5 h-5 text-gray-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title & Description */}
          <motion.div variants={itemVariants} className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Oops! Link Not Found
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              This short link does not exist in our system
            </p>
          </motion.div>

          {/* Info Cards */}
          <motion.div variants={itemVariants} className="grid gap-3">
            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "4px 4px 0px 0px rgba(0,0,0)",
              }}
              transition={{ duration: 0.2 }}
              className="bg-white border-[1px] border-gray-300 rounded-lg p-4 text-left hover:border-black transition-all duration-200"
            >
              <p className="text-sm font-semibold text-gray-900 mb-1">
                📅 Link Expired
              </p>
              <p className="text-sm text-gray-600">
                Free links expire after 30 minutes
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "4px 4px 0px 0px rgba(0,0,0)",
              }}
              transition={{ duration: 0.2 }}
              className="bg-white border-[1px] border-gray-300 rounded-lg p-4 text-left hover:border-black transition-all duration-200"
            >
              <p className="text-sm font-semibold text-gray-900 mb-1">
                🗑️ Link Deleted
              </p>
              <p className="text-sm text-gray-600">
                The owner may have removed this link
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.02,
                boxShadow: "4px 4px 0px 0px rgba(0,0,0)",
              }}
              transition={{ duration: 0.2 }}
              className="bg-white border-[1px] border-gray-300 rounded-lg p-4 text-left hover:border-black transition-all duration-200"
            >
              <p className="text-sm font-semibold text-gray-900 mb-1">
                ✏️ Typo in URL
              </p>
              <p className="text-sm text-gray-600">
                Double-check the link you entered
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="space-y-3 pt-2 flex flex-col"
          >
            <Link href="/">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "4px 4px 0px 0px rgba(0,0,0)",
                }}
                whileTap={{ scale: 0.98 }}
                className="group w-full bg-black text-white font-semibold py-3 px-6 rounded-lg border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Create New Short Link
                <motion.div
                  initial={{ x: 0 }}
                  animate={{
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.div>
            </Link>

            <Link href="/">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "4px 4px 0px 0px rgba(0,0,0)",
                }}
                whileTap={{ scale: 0.98 }}
                className="group w-full bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-lg border-[1px] border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Home className="w-5 h-5" />
                </motion.div>
                Back to Homepage
              </motion.div>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="pt-4 text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="mailto:support@shrnk.com"
                className="text-red-500 hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
