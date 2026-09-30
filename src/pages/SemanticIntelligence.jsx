import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Code2,
  FileText,
  Sliders,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import {
  fetchSemanticModels,
  extractSemanticRubric,
  batchAnalyzeCohort,
} from '../utils/api.js';

const SAMPLE_PROJECTS = [
  {
    title: 'High-Throughput Clinical Genomic ETL & Variant Annotation Pipeline',
    modelId: 'llama-3-8b',
    text: `Architected and deployed a containerized asynchronous data pipeline using Python, FastAPI, and Nextflow to process 50GB+ whole-genome sequencing FASTQ and VCF files. 
Implemented custom genomic variant filtering algorithms with Pandas and Scikit-Learn, achieving 99.4% concordance with ClinVar reference benchmarks.
Configured Docker container deployment on AWS ECS with Redis queue buffering and automated PyTest integration suites covering 48 unit test cases.
Enforced strict HIPAA / FERPA cryptographic logging with AES-256 encrypted storage buckets.`
  },
  {
    title: 'Distributed Key-Value Store with Raft Consensus & Gossip Membership',
    modelId: 'mistral-7b',
    text: `Engineered a fault-tolerant distributed key-value storage engine in Go utilizing the Raft consensus protocol and custom gRPC service contracts.
Implemented log replication, leader election, and atomic state machine transitions with mutex locks and concurrent goroutines.
Integrated OpenTelemetry distributed tracing and Prometheus metrics endpoints to monitor p99 latency under 20,000 ops/sec throughput benchmarks.
Containerized deployment across multi-node Linux Kubernetes clusters with automated failover testing.`
  },
  {
    title: 'Zero-Trust API Security Proxy with Mutual TLS & Behavioral Threat Detection',
    modelId: 'gemma-2-9b',
    text: `Designed an enterprise security reverse proxy with Python and cryptography libraries to enforce mTLS client certificates and OWASP Top 10 mitigation rules.
Implemented JWT token validation with role-based access control (RBAC) and real-time rate limiting using Redis sliding-window counters.
Conducted comprehensive penetration testing reports and automated security compliance scans verifying zero unauthorized payload ingress.`
  }
];

export default function SemanticIntelligence() {
  const [models, setModels] = useState({});
  const [selectedModel, setSelectedModel] = useState('llama-3-8b');
  const [projectTitle, setProjectTitle] = useState(SAMPLE_PROJECTS[0].title);
  const [projectText, setProjectText] = useState(SAMPLE_PROJECTS[0].text);
  const [extractionResult, setExtractionResult] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [batchResult, setBatchResult] = useState(null);
  const [batchAnalyzing, setBatchAnalyzing] = useState(false);

  useEffect(() => {
    fetchSemanticModels()
      .then((res) => {
        if (res && res.models) setModels(res.models);
      })
      .catch((err) => console.error('Error fetching models:', err));

    // Auto-run initial extraction
    runExtraction(SAMPLE_PROJECTS[0].title, SAMPLE_PROJECTS[0].text, 'llama-3-8b');
  }, []);

  const runExtraction = async (title, text, model) => {
    setExtracting(true);
    try {
      const res = await extractSemanticRubric({
        projectTitle: title,
        projectText: text,
        modelId: model,
      });
      setExtractionResult(res);
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setExtracting(false);
    }
  };

  const handleExtractSubmit = (e) => {
    e.preventDefault();
    runExtraction(projectTitle, projectText, selectedModel);
  };

  const handleApplySample = (sample) => {
    setProjectTitle(sample.title);
    setProjectText(sample.text);
    setSelectedModel(sample.modelId);
    runExtraction(sample.title, sample.text, sample.modelId);
  };

  const handleBatchAnalysis = async () => {
    setBatchAnalyzing(true);
    try {
      const res = await batchAnalyzeCohort();
      setBatchResult(res);
    } catch (err) {
      console.error('Batch analysis error:', err);
    } finally {
      setBatchAnalyzing(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Phase 3 Semantic Intelligence
              </span>
              <span className="flex items-center gap-1.5 text-xs text-purple-400">
                <Brain size={13} />
                Open-Weight LLM Rubric Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-white mt-1">
              Automated Project Rubric Extraction
            </h1>
            <p className="text-sm text-surface-400 mt-0.5">
              Extract demonstrated skills, architectural patterns, and Bloom's cognitive depth from student project artifacts.
            </p>
          </div>

          <button
            onClick={handleBatchAnalysis}
            disabled={batchAnalyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-xs font-semibold text-white shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50"
          >
            <Sparkles size={13} className={batchAnalyzing ? 'animate-spin' : ''} />
            {batchAnalyzing ? 'Analyzing Cohort...' : 'Batch Analyze Cohort'}
          </button>
        </div>

        {/* Model Selector Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(models).map(([key, m]) => (
            <div
              key={key}
              onClick={() => setSelectedModel(key)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedModel === key
                  ? 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'glass border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">{m.name}</p>
                <span className="px-1.5 py-0.5 rounded bg-surface-800 text-[10px] font-mono text-purple-300">
                  {m.parameters}
                </span>
              </div>
              <p className="text-[11px] text-surface-400 mt-1 line-clamp-1">{m.specialty}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-surface-500 font-mono">
                <span>Ctx: {m.contextWindow}</span>
                <span>{m.quantization}</span>
                <span className="text-emerald-400">{m.latencyMs}ms avg</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-surface-400 mr-1 flex items-center gap-1">
            <Sliders size={12} /> Test Presets:
          </span>
          {SAMPLE_PROJECTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleApplySample(sample)}
              className="px-2.5 py-1 rounded-lg bg-surface-850 hover:bg-surface-800 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors"
            >
              Preset #{idx + 1}: {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Interactive Analyzer Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-5 glass p-5 rounded-2xl border border-white/[0.08] flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Code2 size={16} className="text-purple-400" />
              <h2 className="text-base font-semibold text-white">Project Artifact Input</h2>
            </div>
            <p className="text-xs text-surface-400 mb-4">
              Paste a student repository README, pull request writeup, or project specification.
            </p>

            <form onSubmit={handleExtractSubmit} className="space-y-3.5 flex-1 flex flex-col">
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-wider mb-1">
                  README / Technical Description
                </label>
                <textarea
                  rows={8}
                  value={projectText}
                  onChange={(e) => setProjectText(e.target.value)}
                  className="w-full flex-1 bg-surface-900 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={extracting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {extracting ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Running Semantic Inference...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} /> Extract Demonstrated Rubric & Skills
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Dossier */}
          <div className="lg:col-span-7 glass p-5 rounded-2xl border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-semibold text-white">Semantic Extraction Report</h2>
                <p className="text-[11px] text-surface-400">
                  Evaluated using {extractionResult?.modelUsed || 'Open-Weight LLM'}
                </p>
              </div>

              {extractionResult && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                    Score: {extractionResult.rubricScores?.totalScore}/100
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-medium">
                    {extractionResult.bloomsTaxonomy}
                  </span>
                </div>
              )}
            </div>

            {extractionResult ? (
              <div className="space-y-4">
                {/* Extracted Skills with Confidence */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">
                    Demonstrated Technical Skills ({extractionResult.extractedSkills?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {extractionResult.extractedSkills?.map((sk, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-surface-900/80 border border-white/[0.05] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{sk.skill}</p>
                          <span className="text-[10px] text-surface-500">{sk.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {Math.round(sk.confidence * 100)}%
                          </span>
                          <div className="w-14 h-1.5 rounded-full bg-surface-800 mt-1 overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${sk.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture Patterns */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">
                    Detected Architectural Patterns
                  </h3>
                  <div className="space-y-1.5">
                    {extractionResult.architecturePatterns?.map((pat, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-surface-900/60 border border-white/[0.04] flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-200 font-medium">{pat.pattern}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono text-[10px]">
                          {Math.round(pat.confidence * 100)}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rubric Criteria Breakdown */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">
                    Pedagogical Rubric Criteria
                  </h3>
                  <div className="space-y-2">
                    {extractionResult.rubricScores?.criteria?.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-surface-900/90 border border-white/[0.06] text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{c.criterion}</span>
                          <span className="font-mono font-bold text-brand-400">
                            {c.score} / {c.max}
                          </span>
                        </div>
                        <p className="text-surface-400 text-[11px] leading-relaxed">
                          {c.justification}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explainable AI Rationale */}
                <div className="p-3 rounded-xl bg-brand-500/[0.07] border border-brand-500/20 text-xs text-brand-200 leading-relaxed">
                  <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-brand-400" />
                    Explainable AI Justification
                  </p>
                  {extractionResult.explainableSummary}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-surface-500 text-xs">
                No analysis generated yet. Click "Extract Demonstrated Rubric & Skills" to begin.
              </div>
            )}
          </div>
        </div>

        {/* Batch Cohort Analysis Results Drawer */}
        <AnimatePresence>
          {batchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass p-5 rounded-2xl border border-purple-500/30 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-purple-400" />
                  <h2 className="text-base font-semibold text-white">
                    Cohort-Wide Semantic Skill Distribution
                  </h2>
                </div>
                <span className="text-xs text-surface-400">
                  {batchResult.totalStudentsAnalyzed} Students Evaluated · {batchResult.totalUniqueSkillsExtracted} Unique Skills Extracted
                </span>
              </div>

              {/* Top Skills Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {batchResult.topDemonstratedSkills?.map((item, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-surface-900 border border-white/10 flex items-center gap-2 text-xs"
                  >
                    <span className="text-white font-medium">{item.skill}</span>
                    <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono text-[10px]">
                      {item.frequency} projects
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
