import React from 'react'
import { Button } from '../ui/button'
import { FaArrowRightLong } from 'react-icons/fa6'
import { DollarSign, Heart, Plane, Sparkles, Compass, MapPin, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className='min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white flexCenter py-28'>
            {/* Background Dot Grid Overlay */}
            <div className='absolute inset-0 bg-grid-dots opacity-40 pointer-events-none' />

            {/* Glowing Ambient Mesh Orbs */}
            <div className='absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[140px] pointer-events-none animate-pulse-slow' />
            <div className='absolute top-1/3 -right-20 w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-[130px] pointer-events-none' />
            <div className='absolute -bottom-20 left-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none' />

            {/* Floating Live Preview Badges */}
            <div className='hidden lg:flex absolute top-36 left-12 xl:left-24 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-semibold shadow-2xl animate-float-slow'>
                <div className='p-2 rounded-xl bg-indigo-500/20 text-indigo-300'>
                    <MapPin className='w-4 h-4' />
                </div>
                <div>
                    <p className='text-white font-bold'>Paris, France</p>
                    <p className='text-indigo-200 text-[11px] font-normal'>3-Day Curated Trip</p>
                </div>
            </div>

            <div className='hidden lg:flex absolute bottom-36 right-12 xl:right-24 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-semibold shadow-2xl animate-float-reverse'>
                <div className='p-2 rounded-xl bg-emerald-500/20 text-emerald-300'>
                    <Sparkles className='w-4 h-4' />
                </div>
                <div>
                    <p className='text-white font-bold'>AI Itinerary Ready</p>
                    <p className='text-emerald-200 text-[11px] font-normal'>Hotels + Daily Roadmap</p>
                </div>
            </div>

            {/* Container */}
            <div className='relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8'>

                {/* Status Badge */}
                <div className='inline-flex items-center space-x-2.5 bg-indigo-500/10 backdrop-blur-xl px-4 py-2 rounded-full border border-indigo-400/20 shadow-lg'>
                    <span className='relative flex h-2.5 w-2.5'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75' />
                        <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500' />
                    </span>
                    <span className='text-xs font-semibold text-indigo-200 tracking-wide uppercase'>
                        AI-Powered Travel Agent v1.0
                    </span>
                </div>

                {/* Hero Title */}
                <h1 className='text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-200 tracking-tight leading-[1.1] text-balance'>
                    Design Your Dream Getaway in Seconds
                </h1>

                {/* Subtitle */}
                <p className='text-lg sm:text-xl text-indigo-100/80 max-w-2xl mx-auto leading-relaxed font-normal'>
                    Tell us where you want to go, and let our advanced AI craft the perfect itinerary tailored to your budget, travel style, and interests.
                </p>

                {/* CTA Button */}
                <div className='pt-2'>
                    <Button
                        onClick={() => navigate('/create-trip')}
                        className='group relative inline-flex items-center justify-center px-9 py-6 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 cursor-pointer border border-white/20'
                    >
                        <span>Start Planning</span>
                        <FaArrowRightLong className='ml-2.5 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300' />
                    </Button>
                </div>

                {/* Feature Highlights Grid */}
                <div className='pt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto text-left'>
                    {/* Smart Routes */}
                    <div className='group p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-indigo-400/40 hover:bg-white/10 transition-all duration-300 space-y-2.5'>
                        <div className='w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flexCenter text-indigo-300 group-hover:scale-110 transition-transform'>
                            <Compass className='w-5 h-5' />
                        </div>
                        <h4 className='font-bold text-white text-base'>Smart Routes</h4>
                        <p className='text-xs text-indigo-200/70 leading-relaxed'>
                            Optimized daily sightseeing paths to save you time and travel effort.
                        </p>
                    </div>

                    {/* Budget Control */}
                    <div className='group p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/40 hover:bg-white/10 transition-all duration-300 space-y-2.5'>
                        <div className='w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flexCenter text-emerald-300 group-hover:scale-110 transition-transform'>
                            <DollarSign className='w-5 h-5' />
                        </div>
                        <h4 className='font-bold text-white text-base'>Budget Control</h4>
                        <p className='text-xs text-emerald-200/70 leading-relaxed'>
                            Tailored hotel and activity picks fitting Cheap, Moderate, or Luxury tiers.
                        </p>
                    </div>

                    {/* Personalized */}
                    <div className='group p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/40 hover:bg-white/10 transition-all duration-300 space-y-2.5'>
                        <div className='w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/30 flexCenter text-purple-300 group-hover:scale-110 transition-transform'>
                            <Heart className='w-5 h-5' />
                        </div>
                        <h4 className='font-bold text-white text-base'>Personalized</h4>
                        <p className='text-xs text-purple-200/70 leading-relaxed'>
                            Custom experiences matched for Solo, Couple, Family, or Group trips.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero