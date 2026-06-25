import { ArrowLeft, Check, Coins, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'

const plans = [
  {
    key: "free",
    name: "Starter",
    price: "₹0",
    credits: 100,
    description: "Explore FreeBuild at no cost",
    features: [
      "AI website generation",
      "Responsive HTML output",
      "Basic animations",
      "1-click deploy",
    ],
    popular: false,
    button: "Get Started Free",
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹499",
    credits: 500,
    description: "For creators & freelancers",
    features: [
      "Everything in Starter",
      "Faster generation",
      "Edit & regenerate",
      "Priority queue",
    ],
    popular: true,
    button: "Upgrade to Pro",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹1499",
    credits: 1000,
    description: "For teams & power users",
    features: [
      "Everything in Pro",
      "Unlimited iterations",
      "Team collaboration",
      "Dedicated support",
    ],
    popular: false,
    button: "Contact Sales",
  },
]

export default function Pricing() {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const [loading, setLoading] = useState(null)

  const handleBuy = async (planKey) => {
    if (!userData) { navigate("/"); return }
    if (planKey === "free") { navigate("/dashboard"); return }
    setLoading(planKey)
    try {
      const result = await axios.post(`${serverUrl}/api/billing`, { planType: planKey }, { withCredentials: true })
      window.location.href = result.data.sessionUrl
    } catch (error) {
      console.log(error)
      setLoading(null)
    }
  }

  return (
    <div className='relative min-h-screen bg-[#08080f] text-white px-6 pt-16 pb-28 overflow-hidden' style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Background */}
      <div className='absolute inset-0 pointer-events-none z-0'>
        <div className='absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px]' />
        <div className='absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]' />
        <div className='absolute inset-0 opacity-[0.025]' style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Back button */}
      <button
        className='relative z-10 mb-10 flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition'
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={15} />
        Back to Home
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-2xl mx-auto text-center mb-16"
      >
        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-medium mb-6'>
          <Coins size={12} /> Simple Pricing
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className='text-4xl md:text-6xl mb-4'>
          Invest in your<br />web presence.
        </h1>
        <p className='text-zinc-500 text-lg'>Buy credits once. Build anytime. No subscriptions.</p>
      </motion.div>

      {/* Plans */}
      <div className='relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={`relative rounded-3xl p-7 border flex flex-col transition-all ${
              p.popular
                ? "border-amber-400/50 bg-gradient-to-b from-amber-400/10 via-amber-400/5 to-transparent shadow-2xl shadow-amber-400/10"
                : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
          >
            {p.popular && (
              <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                <span className='px-4 py-1 text-xs rounded-full bg-amber-400 text-black font-semibold'>
                  Most Popular
                </span>
              </div>
            )}

            <div className='mb-6'>
              <h2 className='text-lg font-semibold mb-1'>{p.name}</h2>
              <p className='text-zinc-500 text-sm'>{p.description}</p>
            </div>

            <div className='mb-4'>
              <span style={{ fontFamily: "'DM Serif Display', serif" }} className='text-5xl'>{p.price}</span>
              <span className='text-zinc-600 text-sm ml-2'>one-time</span>
            </div>

            <div className='flex items-center gap-2 mb-8 px-3 py-2 rounded-xl bg-amber-400/8 border border-amber-400/15 w-fit'>
              <Coins size={15} className='text-amber-400' />
              <span className='text-amber-300 text-sm font-semibold'>{p.credits} Credits</span>
            </div>

            <ul className='space-y-3 mb-8 flex-1'>
              {p.features.map((f) => (
                <li key={f} className='flex items-start gap-2.5 text-sm text-zinc-400'>
                  <Check size={15} className='text-amber-400 mt-0.5 flex-shrink-0' />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!!loading}
              onClick={() => handleBuy(p.key)}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition ${
                p.popular
                  ? "bg-amber-400 text-black hover:bg-amber-300"
                  : "bg-white/8 text-white hover:bg-white/15 border border-white/10"
              } disabled:opacity-50`}
            >
              {loading === p.key ? "Redirecting…" : p.button}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <div className='relative z-10 text-center mt-14 text-zinc-600 text-sm'>
        All plans include instant deployment & full code ownership.
      </div>
    </div>
  )
}