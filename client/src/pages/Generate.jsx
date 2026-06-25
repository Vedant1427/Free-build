import { ArrowLeft, Zap } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'

const PHASES = [
  "Analyzing your idea…",
  "Designing layout & structure…",
  "Writing HTML & CSS…",
  "Adding animations & interactions…",
  "Final quality checks…",
]

export default function Generate() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [error, setError] = useState("")

  const handleGenerateWebsite = async () => {
    setLoading(true)
    setError("")
    try {
      const result = await axios.post(`${serverUrl}/api/website/generate`, { prompt }, { withCredentials: true })
      setProgress(100)
      setLoading(false)
      navigate(`/editor/${result.data.websiteId}`)
    } catch (error) {
      setLoading(false)
      setError(error.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0)
      setProgress(0)
      return
    }
    let value = 0
    let phase = 0
    const interval = setInterval(() => {
      const increment = value < 20
        ? Math.random() * 1.5
        : value < 60
          ? Math.random() * 1.2
          : Math.random() * 0.6
      value += increment
      if (value >= 93) value = 93
      phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1)
      setProgress(Math.floor(value))
      setPhaseIndex(phase)
    }, 1200)
    return () => clearInterval(interval)
  }, [loading])

  return (
    <div className='min-h-screen bg-[#08080f] text-white' style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Background */}
      <div className='pointer-events-none fixed inset-0 z-0'>
        <div className='absolute top-[-180px] right-[-100px] w-[550px] h-[550px] bg-amber-500/7 rounded-full blur-[140px]' />
        <div className='absolute bottom-0 left-[-80px] w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]' />
        <div className='absolute inset-0 opacity-[0.025]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Navbar */}
      <div className='sticky top-0 z-40 backdrop-blur-2xl bg-[#08080f]/80 border-b border-white/[0.07]'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center gap-4'>
          <button className='p-2 rounded-lg hover:bg-white/8 transition' onClick={() => navigate("/")}>
            <ArrowLeft size={16} className='text-zinc-400' />
          </button>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded bg-amber-400 flex items-center justify-center'>
              <Zap size={11} className='text-black' fill='black' />
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif" }} className='text-lg'>FreeBuild</span>
          </div>
        </div>
      </div>

      <div className='relative z-10 max-w-3xl mx-auto px-6 py-20'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-7'>
            <Zap size={12} fill='currentColor' /> AI Website Generator
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl md:text-6xl leading-tight mb-5'>
            Describe Your<br />
            <span className='text-amber-400'>Dream Website.</span>
          </h1>
          <p className='text-zinc-500 max-w-lg mx-auto leading-relaxed'>
            Be as detailed as you like. Mention your style, colors, sections, and purpose —
            our AI handles the rest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className='relative mb-4'>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder='Example: "A modern portfolio for a UI/UX designer with a dark theme, hero section with animated text, project grid, and a contact form..."'
              className='w-full h-52 p-6 rounded-2xl bg-white/[0.04] border border-white/[0.09] outline-none resize-none text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 focus:border-amber-400/40 focus:bg-white/[0.06] transition'
            />
            <div className='absolute bottom-4 right-4 text-xs text-zinc-700'>
              {prompt.length} chars
            </div>
          </div>

          {/* Prompt Suggestions */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='mb-6'
            >
              <p className='text-xs text-zinc-600 mb-3 flex items-center gap-1.5'>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                Try a suggestion
              </p>
              <div className='flex flex-wrap gap-2'>
                {[
                  "Modern SaaS landing page with gradient hero, pricing cards, testimonials, and dark theme",
                  "Professional portfolio for a photographer with fullscreen image gallery and contact form",
                  "Restaurant website with menu sections, reservation form, food gallery, and warm color scheme",
                  "Tech startup landing page with animated stats, team section, FAQ, and bold typography",
                  "Fitness & wellness studio site with class schedule, trainer profiles, and membership plans",
                  "Creative agency website with case studies, team bios, services grid, and a vibrant color scheme"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(suggestion)}
                    className='px-3.5 py-2 rounded-xl text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/30 hover:text-amber-400 hover:bg-amber-400/[0.06] transition-all duration-200 text-left leading-relaxed'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3'
            >
              {error}
            </motion.p>
          )}

          <div className='flex justify-center'>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGenerateWebsite}
              disabled={!prompt.trim() || loading}
              className={`flex items-center gap-2 px-12 py-4 rounded-xl font-semibold text-base transition ${
                prompt.trim() && !loading
                  ? "bg-amber-400 text-black hover:bg-amber-300"
                  : "bg-white/8 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <Zap size={16} fill={prompt.trim() && !loading ? 'black' : 'currentColor'} />
              {loading ? "Generating…" : "Generate Website"}
            </motion.button>
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto mt-14"
          >
            <div className='rounded-2xl bg-white/[0.03] border border-white/[0.07] p-8'>
              <div className='flex justify-between mb-3 text-xs text-zinc-500'>
                <span className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-amber-400 rounded-full animate-pulse' />
                  {PHASES[phaseIndex]}
                </span>
                <span className='text-amber-400 font-semibold'>{progress}%</span>
              </div>

              <div className='h-1.5 w-full bg-white/8 rounded-full overflow-hidden'>
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.8 }}
                />
              </div>

              <div className='text-center text-xs text-zinc-600 mt-5'>
                Estimated time: <span className="text-zinc-400 font-medium">~8–12 minutes</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}