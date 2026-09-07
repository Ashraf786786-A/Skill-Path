import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  Code2,
  Database,
  Palette,
  Shield,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Layers,
} from 'lucide-react';

import PageTransition from '../components/PageTransition.jsx';
import SkillNetwork3D from '../components/SkillNetwork3D.jsx';

const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Disciplines', icon: Sparkles },
  { id: 'eng', label: 'Software & Systems', icon: Code2 },
  { id: 'data', label: 'Data & AI', icon: Database },
  { id: 'design', label: 'Design & UX', icon: Palette },
  { id: 'security', label: 'Security & Cloud', icon: Shield },
  { id: 'competency', label: 'Human Competencies', icon: BrainCircuit },
];

const SKILLS_TAXONOMY = [
  // Software & Systems
  { name: 'Python', category: 'eng', count: 7, careers: ['Data Analyst', 'Software Developer', 'ML Engineer'], desc: 'High-level programming for data, automation & backend.' },
  { name: 'JavaScript', category: 'eng', count: 4, careers: ['Software Developer', 'UX Designer'], desc: 'Modern ECMAScript for interactive web frontends & servers.' },
  { name: 'React', category: 'eng', count: 4, careers: ['Software Developer', 'UX Designer'], desc: 'Component architecture, state management & reactive rendering.' },
  { name: 'SQL', category: 'eng', count: 6, careers: ['Data Analyst', 'Data Scientist', 'Cloud Architect'], desc: 'Relational data modeling, aggregations & query optimization.' },
  { name: 'Version Control', category: 'eng', count: 6, careers: ['Software Developer', 'Cloud Architect'], desc: 'Git branching, pull request code reviews & CI integration.' },
  { name: 'Algorithms', category: 'eng', count: 4, careers: ['Software Developer', 'ML Engineer'], desc: 'Data structures, computational complexity & problem solving.' },

  // Data & AI
  { name: 'Data Analysis', category: 'data', count: 6, careers: ['Data Analyst', 'Biomedical Data Scientist'], desc: 'Exploratory data analysis, cleaning & pattern synthesis.' },
  { name: 'Data Visualisation', category: 'data', count: 5, careers: ['Data Analyst', 'Digital Marketing Analyst'], desc: 'Plotly, Tableau & D3 visual narrative translation.' },
  { name: 'Statistics', category: 'data', count: 5, careers: ['Data Analyst', 'ML Engineer', 'Biomedical Data Scientist'], desc: 'Hypothesis testing, distributions & regression inference.' },
  { name: 'Machine Learning', category: 'data', count: 4, careers: ['ML Engineer', 'Biomedical Data Scientist'], desc: 'Supervised & unsupervised model training and evaluation.' },
  { name: 'Deep Learning', category: 'data', count: 2, careers: ['ML Engineer'], desc: 'Neural networks, PyTorch & computer vision/NLP.' },

  // Design & UX
  { name: 'UI/UX Design', category: 'design', count: 3, careers: ['UX Designer'], desc: 'User experience flows, visual hierarchy & interaction design.' },
  { name: 'User Research', category: 'design', count: 3, careers: ['UX Designer', 'Digital Marketing Analyst'], desc: 'Qualitative interviews, usability testing & persona mapping.' },
  { name: 'Wireframing', category: 'design', count: 3, careers: ['UX Designer'], desc: 'Information architecture and low-fidelity interface scaffolding.' },
  { name: 'Prototyping', category: 'design', count: 3, careers: ['UX Designer'], desc: 'High-fidelity Figma clickable interactive user testing flows.' },

  // Security & Cloud
  { name: 'Cybersecurity', category: 'security', count: 2, careers: ['Cybersecurity Analyst'], desc: 'Threat defense, vulnerability assessment & intrusion prevention.' },
  { name: 'Network Security', category: 'security', count: 2, careers: ['Cybersecurity Analyst'], desc: 'Firewalls, VPNs, packet inspection & network topology.' },
  { name: 'Cloud Computing', category: 'security', count: 3, careers: ['Cloud Solutions Architect'], desc: 'AWS/GCP architectures, serverless, microservices & cost scaling.' },
  { name: 'Docker', category: 'security', count: 3, careers: ['Cloud Solutions Architect', 'Software Developer'], desc: 'Containerization, microservice isolation & orchestration.' },

  // Human Competencies
  { name: 'Analytical Thinking', category: 'competency', count: 8, careers: ['All Roles'], desc: 'Deconstructing complex ambiguities into structured solutions.' },
  { name: 'Problem Solving', category: 'competency', count: 8, careers: ['All Roles'], desc: 'Iterative debugging and strategic root-cause resolution.' },
  { name: 'Technical Writing', category: 'competency', count: 6, careers: ['All Roles'], desc: 'Clear documentation, architectural RFCs & case studies.' },
  { name: 'Collaboration', category: 'competency', count: 7, careers: ['All Roles'], desc: 'Peer code reviews, cross-functional team empathy & agility.' },
];

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = SKILLS_TAXONOMY.filter((skill) => {
    const matchesCat = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.careers.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-10 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Demonstrated Capability Ontology</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Skill & Competency Taxonomy
            </h1>
            <p className="section-subtitle">
              Taxonomy of verified skills linked directly to student evidence deliverables and market career roles.
            </p>
          </div>

          <div className="text-xs font-mono text-surface-400 bg-surface-900/60 p-2.5 rounded-xl border border-surface-800">
            <span>22 Mapped Capabilities across 8 Roles</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill, concept or career..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-950/80 border border-surface-700/80 rounded-xl text-xs text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 font-sans transition-colors"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {SKILL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                      : 'text-surface-400 hover:text-white bg-surface-900/40 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((sk, index) => (
            <motion.div
              key={sk.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="glass-card-hover p-5 rounded-2xl flex flex-col justify-between space-y-4 border-surface-700/80 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-display font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                    {sk.name}
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    {sk.count} Students
                  </span>
                </div>

                <p className="text-xs text-surface-400 leading-relaxed font-sans">
                  {sk.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-800/80 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                  Target Careers:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sk.careers.map((career) => (
                    <span
                      key={career}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-900 text-surface-300 border border-surface-800"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Embedded 3D Skill Graph Section */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-brand-400">
                Spatial Perspective
              </span>
              <h2 className="section-title">3D Relational Constellation</h2>
              <p className="section-subtitle">
                Interactive spatial visualization linking evidence origins to skill nodes and career destinations.
              </p>
            </div>
          </div>

          <SkillNetwork3D className="h-[440px] w-full" />
        </section>
      </div>
    </PageTransition>
  );
}
