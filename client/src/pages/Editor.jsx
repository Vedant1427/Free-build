import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useState } from 'react'
import { Code2, MessageSquare, Monitor, Rocket, Send, X, Zap } from 'lucide-react'
import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Editor from '@monaco-editor/react'

export default function WebsiteEditor() {
  const { id } = useParams()
  const [website, setWebsite] = useState(null)
  const [error, setError] = useState("")
  const [code, setCode] = useState("")
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState("")
  const iframeRef = useRef(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [thinkingIndex, setThinkingIndex] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const thinkingSteps = [
    "Understanding your request…",
    "Planning layout changes…",
    "Improving responsiveness…",
    "Applying animations…",
    "Finalizing update…",
  ]

  const handleUpdate = async () => {
    if (!prompt) return
    setUpdateLoading(true)
    const text = prompt
    setPrompt("")
    setMessages((m) => [...m, { role: "user", content: text }])
    try {
      const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true })
      setUpdateLoading(false)
      setMessages((m) => [...m, { role: "ai", content: result.data.message }])
      setCode(result.data.code)
    } catch (error) {
      setUpdateLoading(false)
      console.log(error)
    }
  }

  const handleDeploy = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
      window.open(`${result.data.url}`, "_blank")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!updateLoading) return
    const i = setInterval(() => {
      setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
    }, 1200)
    return () => clearInterval(i)
  }, [updateLoading])

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
        setWebsite(result.data)
        setCode(result.data.latestCode)
        setMessages(result.data.conversation)
      } catch (error) {
        console.log(error)
        setError(error.response.data.message)
      }
    }
    handleGetWebsite()
  }, [id])

  useEffect(() => {
    if (!iframeRef.current || !code) return
    const blob = new Blob([code], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    iframeRef.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [code])

  if (error) {
    return (
      <div className='h-screen flex items-center justify-center bg-[#08080f] text-red-400' style={{ fontFamily: "'Outfit', sans-serif" }}>
        {error}
      </div>
    )
  }
  if (!website) {
    return (
      <div className='h-screen flex items-center justify-center bg-[#08080f] text-white' style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className='flex items-center gap-3 text-zinc-500 text-sm'>
          <div className='w-4 h-4 border-2 border-zinc-700 border-t-amber-400 rounded-full animate-spin' />
          Loading editor…
        </div>
      </div>
    )
  }

  /* headerJSX and chatPanelJSX are inlined as render helpers (not components)
     to prevent React from unmounting/remounting them on every re-render,
     which was causing the chat input to lose focus after typing one character. */

  const headerJSX = (onclose) => (
    <div className='h-14 px-4 flex items-center justify-between border-b border-white/[0.07] bg-[#09090f]'>
      <div className='flex items-center gap-2 min-w-0'>
        <div className='w-5 h-5 rounded bg-amber-400 flex items-center justify-center flex-shrink-0'>
          <Zap size={10} className='text-black' fill='black' />
        </div>
        <span className='text-sm font-medium truncate text-zinc-200'>{website.title}</span>
      </div>
      {onclose && <button onClick={onclose} className='p-1.5 rounded-lg hover:bg-white/8 transition'><X size={16} color='white' /></button>}
    </div>
  )

  const chatPanelJSX = (
    <>
      <div className='flex-1 overflow-y-auto px-4 py-5 space-y-3'>
        {messages.length === 0 && (
          <div className='text-center text-zinc-600 text-xs mt-12'>
            Describe a change to get started.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[88%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-amber-400 text-black font-medium"
                : "bg-white/[0.06] border border-white/[0.08] text-zinc-300"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {updateLoading && (
          <div className='max-w-[88%] mr-auto'>
            <div className='flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs bg-white/[0.04] border border-white/[0.07] text-zinc-500 italic'>
              <div className='w-2 h-2 bg-amber-400 rounded-full animate-pulse flex-shrink-0' />
              {thinkingSteps[thinkingIndex]}
            </div>
          </div>
        )}
      </div>
      <div className='p-3 border-t border-white/[0.07]'>
        <div className='flex gap-2'>
          <input
            placeholder='Describe a change…'
            className='flex-1 rounded-xl px-4 py-3 bg-white/[0.05] border border-white/[0.09] text-sm outline-none placeholder:text-zinc-600 focus:border-amber-400/40 transition text-zinc-200'
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleUpdate()}
          />
          <button
            className='px-4 py-3 rounded-xl bg-amber-400 text-black hover:bg-amber-300 transition disabled:opacity-40'
            disabled={updateLoading || !prompt.trim()}
            onClick={handleUpdate}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className='h-screen w-screen flex bg-[#08080f] text-white overflow-hidden' style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* Desktop Sidebar */}
      <aside className='hidden lg:flex w-[340px] flex-col border-r border-white/[0.07] bg-[#09090f] flex-shrink-0'>
        {headerJSX(null)}
        {chatPanelJSX}
      </aside>

      {/* Main Area */}
      <div className='flex-1 flex flex-col min-w-0'>
        <div className='h-14 px-4 flex justify-between items-center border-b border-white/[0.07] bg-[#09090f] flex-shrink-0'>
          <span className='text-xs text-zinc-600 font-medium tracking-wide uppercase'>Live Preview</span>
          <div className='flex gap-2 items-center'>
            {!website.deployed && (
              <button
                className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 transition'
                onClick={handleDeploy}
              >
                <Rocket size={12} /> Deploy
              </button>
            )}
            <button className='p-2 rounded-lg hover:bg-white/8 transition lg:hidden' onClick={() => setShowChat(true)}>
              <MessageSquare size={16} className='text-zinc-400' />
            </button>
            <button className='p-2 rounded-lg hover:bg-white/8 transition' onClick={() => setShowCode(true)}>
              <Code2 size={16} className='text-zinc-400' />
            </button>
            <button className='p-2 rounded-lg hover:bg-white/8 transition' onClick={() => setShowFullPreview(true)}>
              <Monitor size={16} className='text-zinc-400' />
            </button>
          </div>
        </div>
        <iframe
          ref={iframeRef}
          sandbox='allow-scripts allow-same-origin allow-forms'
          className='flex-1 w-full bg-white'
        />
      </div>

      {/* Mobile Chat Overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-[9999] bg-[#09090f] flex flex-col"
          >
            {headerJSX(() => setShowChat(false))}
            {chatPanelJSX}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor Panel */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full lg:w-[48%] z-[9999] bg-[#0d0d0d] flex flex-col border-l border-white/[0.07]"
          >
            <div className='h-12 px-4 flex justify-between items-center border-b border-white/[0.07] bg-[#0d0d0d]'>
              <div className='flex items-center gap-2'>
                <Code2 size={14} className='text-zinc-500' />
                <span className='text-sm text-zinc-400 font-medium'>index.html</span>
              </div>
              <button
                onClick={() => setShowCode(false)}
                className='p-1.5 rounded-lg hover:bg-white/8 transition'
              >
                <X size={16} className='text-zinc-400' />
              </button>
            </div>
            <Editor
              theme='vs-dark'
              value={code}
              language='html'
              onChange={(v) => setCode(v)}
              options={{ fontSize: 13, minimap: { enabled: false }, padding: { top: 16 } }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Preview */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black"
          >
            <iframe
              className='w-full h-full bg-white'
              srcDoc={code}
              sandbox='allow-scripts allow-same-origin allow-forms'
            />
            <button
              onClick={() => setShowFullPreview(false)}
              className='absolute top-4 right-4 p-2.5 bg-black/80 border border-white/10 rounded-xl hover:bg-black transition'
            >
              <X size={16} className='text-white' />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}