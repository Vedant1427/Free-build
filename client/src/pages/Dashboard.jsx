import { ArrowLeft, Check, Rocket, Share2, Zap, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'

export default function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [websites, setWebsites] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  const handleDeploy = async (id) => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })
      window.open(`${result.data.url}`, "_blank")
      setWebsites((prev) =>
        prev.map((w) => w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w)
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true)
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
        setWebsites(result.data || [])
        setLoading(false)
      } catch (error) {
        console.log(error)
        setError(error.response.data.message)
        setLoading(false)
      }
    }
    handleGetAllWebsites()
  }, [])

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl)
    setCopiedId(site._id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className='min-h-screen bg-[#08080f] text-white' style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Background */}
      <div className='pointer-events-none fixed inset-0 z-0'>
        <div className='absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-amber-500/6 rounded-full blur-[130px]' />
        <div className='absolute inset-0 opacity-[0.025]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <div className='sticky top-0 z-40 backdrop-blur-2xl bg-[#08080f]/80 border-b border-white/[0.07]'>
        <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button className='p-2 rounded-lg hover:bg-white/8 transition' onClick={() => navigate("/")}>
              <ArrowLeft size={16} className='text-zinc-400' />
            </button>
            <div className='flex items-center gap-2'>
              <div className='w-6 h-6 rounded bg-amber-400 flex items-center justify-center'>
                <Zap size={11} className='text-black' fill='black' />
              </div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-lg'>FreeBuild</h1>
            </div>
            <span className='text-zinc-600 text-sm'>/</span>
            <span className='text-zinc-400 text-sm'>Dashboard</span>
          </div>
          <button
            className='flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition hover:scale-105'
            onClick={() => navigate("/generate")}
          >
            <Plus size={15} /> New Website
          </button>
        </div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-6 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className='text-sm text-zinc-500 mb-1'>Welcome back,</p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl'>{userData.name}</h1>
        </motion.div>

        {loading && (
          <div className="mt-32 text-center">
            <div className='inline-flex items-center gap-3 text-zinc-500 text-sm'>
              <div className='w-4 h-4 border-2 border-zinc-600 border-t-amber-400 rounded-full animate-spin' />
              Loading your websites…
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mt-32 text-center text-red-400 text-sm">{error}</div>
        )}

        {websites?.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-32 text-center"
          >
            <div className='w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5'>
              <Zap size={24} className='text-zinc-600' />
            </div>
            <p className='text-zinc-500 mb-5'>You haven't built anything yet.</p>
            <button
              onClick={() => navigate("/generate")}
              className='px-6 py-3 rounded-xl bg-amber-400 text-black font-semibold text-sm hover:bg-amber-300 transition'
            >
              Build Your First Website
            </button>
          </motion.div>
        )}

        {!loading && !error && websites?.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
            {websites.map((w, i) => {
              const copied = copiedId === w._id
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-hidden hover:border-amber-400/20 transition flex flex-col group"
                >
                  {/* Preview */}
                  <div
                    className='relative h-44 bg-black cursor-pointer overflow-hidden'
                    onClick={() => navigate(`/editor/${w._id}`)}
                  >
                    <iframe
                      srcDoc={w.latestCode}
                      className='absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />
                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                      <span className='px-4 py-2 rounded-lg bg-black/70 text-white text-xs font-medium border border-white/20'>
                        Open Editor
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className='p-5 flex flex-col gap-4 flex-1'>
                    <div>
                      <h3 className='text-sm font-semibold line-clamp-2 mb-1'>{w.title}</h3>
                      <p className='text-xs text-zinc-600'>
                        Updated {new Date(w.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {!w.deployed ? (
                      <button
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 transition hover:scale-105"
                        onClick={() => handleDeploy(w._id)}
                      >
                        <Rocket size={14} /> Deploy
                      </button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy(w)}
                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          copied
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300"
                        }`}
                      >
                        {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share Link</>}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}