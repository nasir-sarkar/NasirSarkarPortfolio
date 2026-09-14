import React from 'react'
import { Code2, Sparkles, WifiOff, RotateCw } from 'lucide-react'


const STATUS_TEXT = 'Just a moment'


const RADIUS = 40
const OUTER_RADIUS = 47
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const OUTER_CIRCUMFERENCE = 2 * Math.PI * OUTER_RADIUS
const ARC_FRACTION = 0.26


export default function Preloader({ hidden, progress = 0, failed = false, onRetry = () => {} }) {
  const statusText = STATUS_TEXT
  const arcLength = CIRCUMFERENCE * ARC_FRACTION


  return (
    <div
      id="preloader"
      role="status"
      aria-live="polite"
      aria-label={failed ? 'Failed to load portfolio' : 'Loading portfolio'}
      className={`fixed inset-0 bg-[#0a0a0c] z-[99999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >




      {/* Ambient background glow */}
      <div className="preloader-glow preloader-glow-a" />
      <div className="preloader-glow preloader-glow-b" />




      {/* Subtle grid backdrop */}
      <div className="preloader-grid" />




      {/* Floating particles */}
      <div className="preloader-particles">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="preloader-particle"
            style={{
              left: `${(i * 61) % 100}%`,
              animationDelay: `${(i * 0.43) % 6}s`,
              animationDuration: `${6 + (i % 5)}s`,
              background: i % 3 === 0 ? '#ff6b00' : '#f9004d',
            }}
          />
        ))}
      </div>



      {/* Vignette for focus */}
      <div className="preloader-vignette" />

      <div className="relative z-10 flex flex-col items-center px-6">


        {/* Progress ring + halo + orbiting dots + icon */}
        <div className="relative w-[100px] h-[100px]">

          <div className={`preloader-ring-halo ${failed ? 'preloader-ring-halo-failed' : ''}`} />

          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className={failed ? '' : 'preloader-spin'}
          >
            {/* faint outer ring for layered depth */}
            <circle
              cx="50"
              cy="50"
              r={OUTER_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray={`${OUTER_CIRCUMFERENCE * 0.06} ${OUTER_CIRCUMFERENCE * 0.05}`}
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={failed ? '#555' : 'url(#preloaderGradient)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={failed ? `${CIRCUMFERENCE * 0.85} ${CIRCUMFERENCE}` : `${arcLength} ${CIRCUMFERENCE - arcLength}`}
              style={failed ? undefined : { filter: 'drop-shadow(0 0 5px rgba(249,0,77,0.55))' }}
            />
            <defs>
              <linearGradient id="preloaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f9004d" />
                <stop offset="100%" stopColor="#ff6b00" />
              </linearGradient>
            </defs>
          </svg>


          <div className="absolute inset-0 flex items-center justify-center">
            {failed ? (
              <WifiOff className="text-[#999]" size={19} strokeWidth={2.2} />
            ) : (
              <Code2 className="preloader-icon text-[#f9004d]" size={19} strokeWidth={2.2} />
            )}
          </div>


          {!failed && (
            <>
              <span className="preloader-orbit-dot preloader-orbit-dot-1" />
              <span className="preloader-orbit-dot preloader-orbit-dot-2" />
              <span className="preloader-orbit-dot preloader-orbit-dot-3" />
            </>
          )}
        </div>





        {/* Brand */}
        <div className="preloader-brand mt-8 text-[21px] font-[800] tracking-[0.5px]">
          <span className="text-[#f9004d]">Nasir</span>
          <span className="text-white"> Sarkar</span>
        </div>




        {/* Status text / error + retry */}
        {failed ? (
          <div className="preloader-status mt-5 flex flex-col items-center text-center">
            <p className="text-[#aaa] text-[13px] tracking-wide max-w-[280px] leading-relaxed">
              Unable to load. Please try again.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="preloader-retry-btn mt-5 inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#f9004d] text-white text-[13px] font-[700] tracking-wide hover:bg-[#c41020] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,0,77,0.35)] transition-all duration-300"
            >
              <RotateCw size={13} strokeWidth={2.5} />
              RETRY
            </button>
          </div>
        ) : (
          <>

            <div
              key={statusText}
              className="preloader-status mt-5 inline-flex items-center gap-2 px-4 py-[7px] rounded-full bg-white/[0.04] border border-white/[0.07]"
            >
              <Sparkles size={12} className="text-[#f9004d]" />
              <span className="text-[#d9d9d9] text-[12px] tracking-[1.5px] uppercase font-[600]">
                {statusText}<span className="preloader-caret">_</span>
              </span>
            </div>


            <p className="preloader-status mt-4 text-[#bbb] text-[13px] tracking-wide text-center max-w-[300px] leading-relaxed">
              <span>First load may take a few seconds<span className="preloader-caret">_</span></span>
            </p>


            <div className="mt-5 flex items-center gap-[6px]">
              <span className="preloader-bounce-dot" style={{ animationDelay: '0s' }} />
              <span className="preloader-bounce-dot" style={{ animationDelay: '0.15s' }} />
              <span className="preloader-bounce-dot" style={{ animationDelay: '0.3s' }} />
            </div>
          </>
        )}
      </div>


    </div>
  )
}