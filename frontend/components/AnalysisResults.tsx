"use client";

import { RepoAnalysisResponse } from "@/types";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Star,
  GitFork,
  AlertTriangle,
  Code2,
} from "lucide-react";

interface AnalysisResultsProps {
  analysis: RepoAnalysisResponse;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const {
    is_junior_friendly,
    is_recently_active,
    confidence_score,
    summary,
    detailed_analysis,
    recommendations,
  } = analysis;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Verdict Card */}
      <motion.div
        variants={itemVariants}
        className={`rounded-2xl p-8 border-2 backdrop-blur-sm ${
          is_junior_friendly
            ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-700"
            : "bg-rose-50 border-rose-300 dark:bg-rose-950/30 dark:border-rose-700"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
              is_junior_friendly
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {is_junior_friendly ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">
              {is_junior_friendly
                ? "✨ Junior-Friendly Repository!"
                : "⚠️ May Be Challenging for Juniors"}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              {summary}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">
                  Confidence: {confidence_score}%
                </span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${
                  is_recently_active
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-semibold">
                  {is_recently_active ? "Recently Active" : "Inactive Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Repository Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          icon={<Star className="w-5 h-5" />}
          label="Stars"
          value={detailed_analysis.repo_stats.stars.toLocaleString()}
          color="yellow"
        />
        <StatCard
          icon={<GitFork className="w-5 h-5" />}
          label="Forks"
          value={detailed_analysis.repo_stats.forks.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="Open Issues"
          value={detailed_analysis.repo_stats.open_issues.toLocaleString()}
          color="orange"
        />
        <StatCard
          icon={<Code2 className="w-5 h-5" />}
          label="Language"
          value={detailed_analysis.repo_stats.language || "Mixed"}
          color="purple"
        />
      </motion.div>

      {/* Activity Info */}
      <motion.div
        variants={itemVariants}
        className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-100">
              Activity Status
            </h3>
            <p className="text-blue-800 dark:text-blue-200">
              {detailed_analysis.activity_info}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Strengths */}
      {detailed_analysis.strengths.length > 0 && (
        <motion.div variants={itemVariants}>
          <InfoSection
            title="Strengths for Junior Developers"
            items={detailed_analysis.strengths}
            icon={<CheckCircle2 className="w-6 h-6" />}
            color="green"
          />
        </motion.div>
      )}

      {/* Good First Areas */}
      {detailed_analysis.good_first_areas.length > 0 && (
        <motion.div variants={itemVariants}>
          <InfoSection
            title="Good First Contribution Areas"
            items={detailed_analysis.good_first_areas}
            icon={<Code2 className="w-6 h-6" />}
            color="blue"
          />
        </motion.div>
      )}

      {/* Prerequisites */}
      {detailed_analysis.prerequisites.length > 0 && (
        <motion.div variants={itemVariants}>
          <InfoSection
            title="Prerequisites & Skills Needed"
            items={detailed_analysis.prerequisites}
            icon={<Lightbulb className="w-6 h-6" />}
            color="purple"
          />
        </motion.div>
      )}

      {/* Concerns */}
      {detailed_analysis.concerns.length > 0 && (
        <motion.div variants={itemVariants}>
          <InfoSection
            title="Potential Challenges"
            items={detailed_analysis.concerns}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="orange"
          />
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div variants={itemVariants}>
          <InfoSection
            title="Recommendations"
            items={recommendations}
            icon={<Lightbulb className="w-6 h-6" />}
            color="indigo"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper Components

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "yellow" | "blue" | "orange" | "purple";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    yellow:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    orange:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: "green" | "blue" | "purple" | "orange" | "indigo";
}

function InfoSection({ title, items, icon, color }: InfoSectionProps) {
  const colorClasses = {
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-900 dark:text-green-100",
      icon: "text-green-600 dark:text-green-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-900 dark:text-blue-100",
      icon: "text-blue-600 dark:text-blue-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-900 dark:text-purple-100",
      icon: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-900 dark:text-orange-100",
      icon: "text-orange-600 dark:text-orange-400",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-900 dark:text-indigo-100",
      icon: "text-indigo-600 dark:text-indigo-400",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`${colors.icon} flex-shrink-0 mt-1`}>{icon}</div>
        <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
          >
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-current mt-2 opacity-60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
