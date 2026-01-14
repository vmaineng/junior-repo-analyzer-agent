"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Sparkles, Code2, Users } from "lucide-react";
import RepoInputForm from "../components/RepoInputForm";
import AnalysisResults from "../components/AnalysisResults";
import LoadingState from "../components/LoadingState";
import ErrorDisplay from "../components/ErrorDisplay";
import { analyzeRepository } from "@/lib/api";
import { RepoAnalysisResponse, AnalysisStatus } from "@/types";

export default function Home() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [analysis, setAnalysis] = useState<RepoAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (repoUrl: string, githubToken?: string) => {
    setStatus("loading");
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeRepository({
        repo_url: repoUrl,
        github_token: githubToken,
      });
      setAnalysis(result);
      setStatus("success");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setError(null);
    setAnalysis(null);
  };

  return (
    <main className="min-h-screen">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-12 pb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-2xl">
              <Github className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Junior Repo Analyzer
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover junior-friendly GitHub repositories with AI-powered
              analysis. Find the perfect project to start your open-source
              journey.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <FeaturePill icon={<Sparkles />} text="AI-Powered Analysis" />
              <FeaturePill icon={<Code2 />} text="Activity Tracking" />
              <FeaturePill icon={<Users />} text="Contribution Guide" />
            </div>
          </motion.div>
        </header>

        {/* Main Content Area */}
        <div className="px-4 pb-20">
          {status === "idle" && (
            <RepoInputForm onSubmit={handleAnalyze} isLoading={false} />
          )}

          {status === "loading" && (
            <>
              <RepoInputForm onSubmit={handleAnalyze} isLoading={true} />
              <div className="mt-8">
                <LoadingState />
              </div>
            </>
          )}

          {status === "success" && analysis && (
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                >
                  ← Analyze Another Repository
                </button>
              </motion.div>
              <AnalysisResults analysis={analysis} />
            </div>
          )}

          {status === "error" && error && (
            <>
              <RepoInputForm onSubmit={handleAnalyze} isLoading={false} />
              <div className="mt-8">
                <ErrorDisplay message={error} onRetry={handleRetry} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Powered by Claude AI • Built with Next.js, TypeScript & FastAPI</p>
          <p className="mt-2">
            Helping junior developers find their first open-source contribution
            💙
          </p>
        </footer>
      </div>
    </main>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700"
    >
      <span className="text-blue-600 dark:text-blue-400">{icon}</span>
      <span className="text-sm font-semibold">{text}</span>
    </motion.div>
  );
}
