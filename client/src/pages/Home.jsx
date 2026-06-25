import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, Zap, Globe, Code2, ArrowRight } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

// Add Google Fonts in index.html: DM Serif Display + Outfit

const highlights = [
  {
    icon: <Zap size={22} className="text-amber-400" />,
    title: "AI Generated Code",
    desc: "Describe your vision. FreeBuild writes clean, semantic HTML/CSS/JS — no templates, no shortcuts.",
  },
  {
    icon: <Globe size={22} className="text-amber-400" />,
    title: "Fully Responsive",
    desc: "Every site looks flawless on mobile, tablet, and desktop — pixel-perfect from day one.",
  },
  {
    icon: <Code2 size={22} className="text-amber-400" />,
    title: "Production Ready",
    desc: "Deploy instantly with animations, accessibility, and scalable structure baked in.",
  },
]

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false)
  const { userData } = useSelector(state => state.user)
  const [openProfile, setOpenProfile] = useState(false)
  const [websites, setWebsites] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      setOpenProfile(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!userData) return
    const handleGetAllWebsites = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
        setWebsites(result.data || [])
      } catch (error) {
        console.log(error)
      }
    }
    handleGetAllWebsites()
  }, [userData])

  return (
    <div className='relative min-h-screen bg-[#08080f] text-white overflow-hidden' style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Background ambient blobs */}
      <div className='pointer-events-none fixed inset-0 z-0'>
        <div className='absolute top-[-180px] left-[-120px] w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px]' />
        <div className='absolute bottom-[-100px] right-[-80px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-400/3 rounded-full blur-[160px]' />
        {/* Subtle grid */}
        <div className='absolute inset-0 opacity-[0.03]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] backdrop-blur-2xl bg-[#08080f]/70'
      >
        <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center'>
              <Zap size={14} className='text-black' fill='black' />
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif" }} className='text-xl tracking-tight'>FreeBuild</span>
          </div>

          <div className='flex items-center gap-6'>
            <button className='hidden md:inline text-sm text-zinc-400 hover:text-white transition' onClick={() => navigate("/about")}>About</button>
            <button className='hidden md:inline text-sm text-zinc-400 hover:text-white transition' onClick={() => navigate("/pricing")}>Pricing</button>

            {userData && (
              <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-sm cursor-pointer hover:bg-amber-400/20 transition' onClick={() => navigate("/pricing")}>
                <Coins size={13} className='text-amber-400' />
                <span className='text-zinc-300'>{userData.credits}</span>
                <span className='text-amber-400 font-bold text-xs'>CR</span>
              </div>
            )}

            {!userData ? (
              <button
                onClick={() => setOpenLogin(true)}
                className='px-5 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition'
              >
                Get Started
              </button>
            ) : (
              <div className='relative'>
                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                  <img
                    src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=f59e0b&color=000`}
                    alt=""
                    referrerPolicy='no-referrer'
                    className='w-9 h-9 rounded-full border-2 border-amber-400/30 object-cover'
                  />
                </button>
                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 z-50 rounded-2xl bg-[#111118] border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className='px-4 py-3 border-b border-white/10'>
                        <p className='text-sm font-semibold truncate'>{userData.name}</p>
                        <p className='text-xs text-zinc-500 truncate'>{userData.email}</p>
                      </div>
                      <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5'>
                        <Coins size={14} className='text-amber-400' />
                        <span className='text-zinc-300'>Credits: {userData.credits}</span>
                      </button>
                      <button className='w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition' onClick={() => navigate("/dashboard")}>Dashboard</button>
                      <button className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 transition' onClick={handleLogOut}>Logout</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className='relative z-10 pt-48 pb-32 px-6 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-8'
        >
          <Zap size={12} fill='currentColor' /> AI-Powered Website Builder
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: "'DM Serif Display', serif" }}
          className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-8"
        >
          Build Stunning Sites<br />
          <span className='text-amber-400'>in Minutes.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className='mt-4 max-w-xl mx-auto text-zinc-400 text-lg leading-relaxed'
        >
          Describe your idea — FreeBuild writes the code, handles the design,
          and deploys it for the world to see. No experience needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='flex items-center justify-center gap-4 mt-12'
        >
          <button
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-black font-semibold hover:bg-amber-300 transition hover:scale-105"
            onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}
          >
            {userData ? "Go to Dashboard" : "Start Building Free"} <ArrowRight size={16} />
          </button>
          <button
            className="px-8 py-4 rounded-xl border border-white/10 text-sm text-zinc-300 hover:bg-white/5 transition"
            onClick={() => navigate("/about")}
          >
            Learn More
          </button>
        </motion.div>
      </section>

      {/* Feature Cards */}
      {!userData && (
        <section className='relative z-10 max-w-6xl mx-auto px-6 pb-32'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-7 hover:border-amber-400/30 hover:bg-white/[0.05] transition-all group"
              >
                <div className='mb-4 w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400/20 transition'>
                  {h.icon}
                </div>
                <h3 className='text-lg font-semibold mb-2'>{h.title}</h3>
                <p className='text-sm text-zinc-500 leading-relaxed'>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Websites */}
      {userData && websites?.length > 0 && (
        <section className='relative z-10 max-w-7xl mx-auto px-6 pb-32'>
          <div className='flex items-center justify-between mb-8'>
            <h3 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-3xl'>Recent Projects</h3>
            <button className='text-sm text-amber-400 hover:underline' onClick={() => navigate("/dashboard")}>View All →</button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {websites.slice(0, 3).map((w, i) => (
              <motion.div
                key={w._id}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/editor/${w._id}`)}
                className="cursor-pointer rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden hover:border-amber-400/20 transition"
              >
                <div className='h-40 bg-black relative overflow-hidden'>
                  <iframe srcDoc={w.latestCode} className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                </div>
                <div className='p-5'>
                  <h3 className='text-sm font-semibold line-clamp-1 mb-1'>{w.title}</h3>
                  <p className='text-xs text-zinc-500'>Updated {new Date(w.updatedAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className='relative z-10 border-t border-white/[0.07] py-10 text-center text-sm text-zinc-600'>
        <div className='flex items-center justify-center gap-2 mb-2'>
          <div className='w-5 h-5 rounded bg-amber-400 flex items-center justify-center'>
            <Zap size={10} className='text-black' fill='black' />
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif" }} className='text-white text-base'>FreeBuild</span>
        </div>
        &copy; {new Date().getFullYear()} FreeBuild. All rights reserved.
      </footer>

      {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
    </div>
  )
}