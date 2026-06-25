import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'

export default function LiveSite() {
  const { id } = useParams()
  const [html, setHtml] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`)
        setHtml(result.data.latestCode)
      } catch (error) {
        console.log(error)
        setError("Site not found")
      }
    }
    handleGetWebsite()
  }, [id])

  if (error) {
    return (
      <div
        className='h-screen flex flex-col items-center justify-center bg-[#08080f] text-white'
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <div className='text-zinc-500 text-sm'>{error}</div>
        <a href='/' className='mt-4 text-amber-400 text-sm hover:underline'>← Back to FreeBuild</a>
      </div>
    )
  }

  return (
    <iframe
      title='Live Site — FreeBuild'
      srcDoc={html}
      className='w-screen h-screen border-none'
      sandbox='allow-scripts allow-same-origin allow-forms'
    />
  )
}