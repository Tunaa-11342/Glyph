'use client'

import { useEffect, useRef } from 'react'

interface Props {
  color?: string
}

export default function ParticlesBackground({ color = '#8b5cf6' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number; y: number; vx: number; vy: number; size: number; opacity: number
    }[] = []

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    let animId: number

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1,3), 16)
      const g = parseInt(hex.slice(3,5), 16)
      const b = parseInt(hex.slice(5,7), 16)
      return `${r},${g},${b}`
    }

    const rgb = hexToRgb(color.startsWith('#') ? color : '#8b5cf6')

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${p.opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
