import React from 'react'
import { motion } from "motion/react"
import { ArrowLeft, Zap, Globe, Code2, Clock, Sparkles, Shield, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const steps = [
  { step: "01", title: "Describe Your Idea", desc: "Type a prompt in plain English — anything from a portfolio site to a SaaS landing page." },
  { step: "02", title: "AI Writes the Code", desc: "FreeBuild's AI engine generates semantic HTML, CSS, and JavaScript tailored to your vision in minutes." },
  { step: "03", title: "Edit & Refine", desc: "Use our live editor and chat interface to iterate. Ask for changes conversationally — no coding needed." },
  { step: "04", title: "Deploy in One Click", desc: "Publish your site to the web instantly. Share a link with the world. Done." },
]

const values = [
  { icon: <Clock size={20} className='text-amber-400' />, title: "Minutes, Not Days", desc: "Traditional web development takes weeks. FreeBuild compresses that to a single afternoon." },
  { icon: <Sparkles size={20} className='text-amber-400' />, title: "Quality First", desc: "We don't generate throwaway code. Every site is clean, accessible, and production-grade." },
  { icon: <Shield size={20} className='text-amber-400' />, title: "You Own Everything", desc: "Download your code any time. No lock-in, no hidden fees. Your site, your rules." },
  { icon: <Globe size={20} className='text-amber-400' />, title: "Global Reach", desc: "Deploy to a public URL instantly. Share, showcase, or sell — with zero infrastructure overhead." },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className='relative min-h-screen bg-[#08080f] text-white overflow-hidden' style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Background */}
      <div className='pointer-events-none fixed inset-0 z-0'>
        <div className='absolute top-[-150px] right-[-100px] w-[500px] h-[500px] bg-amber-500/7 rounded-full blur-[130px]' />
        <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]' />
        <div className='absolute inset-0 opacity-[0.025]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Navbar */}
      <div className='fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] backdrop-blur-2xl bg-[#08080f]/70'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <button className='flex items-center gap-3 text-zinc-400 hover:text-white transition' onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded bg-amber-400 flex items-center justify-center'>
                <Zap size={12} className='text-black' fill='black' />
              </div>
              <span style={{ fontFamily: "'DM Serif Display', serif" }} className='text-white text-lg'>FreeBuild</span>
            </div>
          </button>
          <button
            onClick={() => navigate("/generate")}
            className='flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition'
          >
            Start Building <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className='relative z-10 pt-44 pb-24 px-6 text-center max-w-4xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-8'
        >
          <Zap size={12} fill='currentColor' /> About FreeBuild
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'DM Serif Display', serif" }}
          className='text-5xl md:text-7xl leading-tight mb-8'
        >
          The Fastest Way to<br />
          <span className='text-amber-400'>Build the Web.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className='text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto'
        >
          FreeBuild is an AI-powered website builder that turns your ideas into fully functional,
          professionally designed websites — in minutes. Just describe what you want,
          and our AI does the rest.
        </motion.p>
      </section>

      {/* Mission Block */}
      <section className='relative z-10 max-w-5xl mx-auto px-6 pb-24'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='rounded-3xl bg-gradient-to-br from-amber-400/10 to-indigo-500/10 border border-amber-400/20 p-10 md:p-14'
        >
          <p className='text-xs font-semibold tracking-widest text-amber-400 uppercase mb-4'>Our Mission</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-3xl md:text-4xl mb-6 leading-snug'>
            Remove every barrier between an idea and a live website.
          </h2>
          <p className='text-zinc-400 leading-relaxed text-lg max-w-2xl'>
            We built FreeBuild because great ideas deserve great websites — and not everyone has the time,
            budget, or expertise to build one from scratch. Whether you're a founder, freelancer,
            student, or creator, FreeBuild gives you a professional web presence without the overhead.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className='relative z-10 max-w-6xl mx-auto px-6 pb-28'>
        <div className='text-center mb-14'>
          <p className='text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3'>The Process</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl md:text-5xl'>How FreeBuild Works</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className='rounded-2xl bg-white/[0.03] border border-white/[0.07] p-7 hover:border-amber-400/25 transition group'
            >
              <div className='flex items-start gap-5'>
                <span style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl text-amber-400/40 group-hover:text-amber-400/70 transition leading-none'>{s.step}</span>
                <div>
                  <h3 className='font-semibold text-lg mb-2'>{s.title}</h3>
                  <p className='text-zinc-500 text-sm leading-relaxed'>{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className='relative z-10 max-w-6xl mx-auto px-6 pb-28'>
        <div className='text-center mb-14'>
          <p className='text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3'>Why FreeBuild</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl md:text-5xl'>Built Different</h2>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className='rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 hover:border-amber-400/25 transition'
            >
              <div className='w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center mb-4'>
                {v.icon}
              </div>
              <h3 className='font-semibold mb-2'>{v.title}</h3>
              <p className='text-zinc-500 text-sm leading-relaxed'>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className='relative z-10 max-w-4xl mx-auto px-6 pb-32 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='rounded-3xl bg-white/[0.03] border border-white/[0.08] p-14'
        >
          <h2 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl md:text-5xl mb-5'>Ready to build?</h2>
          <p className='text-zinc-400 mb-8'>Your first website is free. No credit card required.</p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <button
              onClick={() => navigate("/generate")}
              className='flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-300 transition hover:scale-105'
            >
              Build My Website <ArrowRight size={16} />
            </button>
            <a
              href="https://two-websitebuilder-1-oxrp.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className='flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 hover:border-amber-400/50 hover:bg-white/5 transition hover:scale-105 text-white font-semibold'
            >
              View Live Demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='relative z-10 border-t border-white/[0.07] py-10 text-center text-sm text-zinc-600'>
        &copy; {new Date().getFullYear()} FreeBuild. All rights reserved.
      </footer>
    </div>
  )
}