"use client";

import { motion } from "framer-motion";
import { GitBranch, Search, Sparkles } from "lucide-react";

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto text-center py-12"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="w-full h-full rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3">Analyzing Repository</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our AI is examining the repository for junior-friendliness...
        </p>

        <div className="space-y-3">
          <LoadingStep
            icon={<GitBranch className="w-4 h-4" />}
            text="Fetching repository data"
            delay={0}
          />
          <LoadingStep
            icon={<Search className="w-4 h-4" />}
            text="Analyzing documentation & issues"
            delay={0.2}
          />
          <LoadingStep
            icon={<Sparkles className="w-4 h-4" />}
            text="Generating AI insights"
            delay={0.4}
          />
        </div>
      </div>
    </motion.div>
  );
}

function LoadingStep({
  icon,
  text,
  delay,
}: {
  icon: React.ReactNode;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex items-center gap-3 text-left bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-lg"
    >
      <div className="shrink-0 text-blue-600 dark:text-blue-400">{icon}</div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </motion.div>
  );
}
