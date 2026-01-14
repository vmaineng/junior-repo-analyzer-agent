"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Search, Loader2 } from "lucide-react";

interface RepoInputFormProps {
  onSubmit: (repoUrl: string, githubToken?: string) => void;
  isLoading: boolean;
}

export default function RepoInputForm({
  onSubmit,
  isLoading,
}: RepoInputFormProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onSubmit(repoUrl.trim(), githubToken.trim() || undefined);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GitBranch className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Analyze Repository</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Paste a GitHub repository URL to get started
            </p>
          </div>
        </div>

        {/* Main Input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="repo-url"
              className="block text-sm font-semibold mb-2"
            >
              Repository URL
            </label>
            <div className="relative">
              <input
                id="repo-url"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                disabled={isLoading}
                required
              />
              <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Example: https://github.com/facebook/react or facebook/react
            </p>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {showAdvanced ? "▼" : "▶"} Advanced Options (Optional)
          </button>

          {/* GitHub Token Input (Collapsible) */}
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <label
                  htmlFor="github-token"
                  className="block text-sm font-semibold mb-2"
                >
                  GitHub Personal Access Token
                </label>
                <input
                  id="github-token"
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxx (optional)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Providing a token increases API rate limits. Get one{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !repoUrl.trim()}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Repository...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze Repository
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <InfoCard
          title="Junior-Friendly Check"
          description="AI analyzes documentation, issues, and community guidelines"
        />
        <InfoCard
          title="Activity Status"
          description="Checks for commits in the last 2 months"
        />
        <InfoCard
          title="Contribution Guide"
          description="Get specific recommendations for getting started"
        />
      </div>
    </motion.form>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="font-semibold text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
