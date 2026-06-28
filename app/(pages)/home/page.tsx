import React from 'react';

/**
 * Home Page
 *
 * Main landing page for AnalyticsRise
 * Showcases platform features, learning paths, and call-to-action
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sky-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
            AnalyticsRise
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 mb-4">Practice. Master. Get Certified.</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Learn data analytics by solving real business problems. Master SQL, Power BI, Tableau,
            Excel, Python, and more through hands-on practice.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors">
              Start Learning
            </button>
            <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
              View Courses
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: 'Real Projects',
              description: 'Learn by solving actual business problems, not watching videos',
            },
            {
              title: 'Expert Courses',
              description: 'Structured learning paths from beginner to advanced certification',
            },
            {
              title: 'Practice Labs',
              description: 'Interactive simulators and hands-on practice environments',
            },
            {
              title: 'Certifications',
              description: 'Earn recognized certificates upon completion',
            },
            {
              title: 'Community',
              description: 'Connect with learners and industry professionals',
            },
            {
              title: 'Leaderboard',
              description: 'Track progress and compete with peers',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-sky-500/50 transition-colors"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </section>

        {/* Tools Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Tools You&apos;ll Master</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Microsoft Excel',
              'SQL',
              'Power BI',
              'Tableau',
              'Alteryx',
              'Python',
              'R Studio',
              'Snowflake',
              'Databricks',
              'Microsoft Fabric',
              'Azure',
              'AWS',
            ].map((tool) => (
              <div
                key={tool}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-slate-300 hover:text-sky-400 hover:border-sky-500/50 transition-colors"
              >
                {tool}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
