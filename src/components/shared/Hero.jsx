import React from 'react'
import { Button } from '../ui/button'
import { FaArrowRightLong } from 'react-icons/fa6'
import { DollarSign, Heart, Compass, MapPin, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className='min-h-screen relative overflow-hidden bg-warm-editorial bg-grid-dots text-stone-900 flexCenter pt-28 pb-20'>
            {/* Warm Ambient Glowing Orbs */}
            <div className='absolute top-1/4 -left-20 w-[450px] h-[450px] bg-amber-300/35 rounded-full blur-[130px] pointer-events-none' />
            <div className='absolute top-1/3 -right-20 w-[400px] h-[400px] bg-orange-300/30 rounded-full blur-[120px] pointer-events-none' />
            <div className='absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[140px] pointer-events-none' />

            {/* Floating Live Preview Badges */}
            <div className='hidden lg:flex absolute top-36 left-12 xl:left-24 items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-stone-200 text-xs font-semibold shadow-lg shadow-stone-300/30 animate-float-slow'>
                <div className='p-2 rounded-xl bg-orange-50 text-[#C85A32] border border-orange-100'>
                    <MapPin className='w-4 h-4' />
                </div>
                <div>
                    <p className='text-stone-900 font-extrabold text-xs'>Paris, France</p>
                    <p className='text-stone-500 text-[11px] font-medium'>3-Day Curated Itinerary</p>
                </div>
            </div>

            <div className='hidden lg:flex absolute bottom-36 right-12 xl:right-24 items-center gap-3 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-stone-200 text-xs font-semibold shadow-lg shadow-stone-300/30 animate-float-reverse'>
                <div className='p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100'>
                    <Sparkles className='w-4 h-4' />
                </div>
                <div>
                    <p className='text-stone-900 font-extrabold text-xs'>Custom AI Itinerary</p>
                    <p className='text-emerald-700 text-[11px] font-medium'>Hotels + Daily Roadmap</p>
                </div>
            </div>

            {/* Container */}
            <div className='relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8'>

                {/* Status Badge */}
                <div className='inline-flex items-center space-x-2.5 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full border border-stone-200/80 shadow-xs'>
                    <span className='relative flex h-2.5 w-2.5'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85A32] opacity-75' />
                        <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C85A32]' />
                    </span>
                    <span className='text-xs font-extrabold text-[#C85A32] tracking-wide uppercase'>
                        AI-Powered Travel Agent v1.0
                    </span>
                </div>

                {/* Hero Title */}
                <h1 className='text-5xl sm:text-6xl md:text-7xl font-black text-stone-900 tracking-tight leading-[1.1] text-balance'>
                    Design Your Dream Getaway in Seconds
                </h1>

                {/* Subtitle */}
                <p className='text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-medium'>
                    Tell us where you want to go, and let our advanced AI craft the perfect itinerary tailored to your budget, travel style, and interests.
                </p>

                {/* CTA Button */}
                <div className='pt-2'>
                    <Button
                        onClick={() => navigate('/create-trip')}
                        className='group relative inline-flex items-center justify-center px-9 py-6 text-lg font-bold text-white transition-all duration-300 bg-[#C85A32] rounded-full hover:bg-[#b04b27] shadow-xl shadow-[#C85A32]/25 hover:shadow-[#C85A32]/40 hover:scale-105 active:scale-95 cursor-pointer border border-[#b04b27]'
                    >
                        <span>Start Planning</span>
                        <FaArrowRightLong className='ml-2.5 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300' />
                    </Button>
                </div>

                {/* Feature Highlights Grid */}
                <div className='pt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto text-left'>
                    {/* Smart Routes */}
                    <div className='group p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-md shadow-stone-200/50 hover:shadow-xl hover:border-orange-300 transition-all duration-300 space-y-3'>
                        <div className='w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flexCenter text-[#C85A32] group-hover:scale-110 transition-transform'>
                            <Compass className='w-6 h-6' />
                        </div>
                        <h4 className='font-extrabold text-stone-900 text-base'>Smart Routes</h4>
                        <p className='text-xs text-stone-500 leading-relaxed font-medium'>
                            Optimized daily sightseeing paths to save you time and travel effort.
                        </p>
                    </div>

                    {/* Budget Control */}
                    <div className='group p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-md shadow-stone-200/50 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 space-y-3'>
                        <div className='w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flexCenter text-emerald-600 group-hover:scale-110 transition-transform'>
                            <DollarSign className='w-6 h-6' />
                        </div>
                        <h4 className='font-extrabold text-stone-900 text-base'>Budget Control</h4>
                        <p className='text-xs text-stone-500 leading-relaxed font-medium'>
                            Tailored hotel and activity picks fitting Cheap, Moderate, or Luxury tiers.
                        </p>
                    </div>

                    {/* Personalized */}
                    <div className='group p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-md shadow-stone-200/50 hover:shadow-xl hover:border-amber-300 transition-all duration-300 space-y-3'>
                        <div className='w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flexCenter text-amber-600 group-hover:scale-110 transition-transform'>
                            <Heart className='w-6 h-6' />
                        </div>
                        <h4 className='font-extrabold text-stone-900 text-base'>Personalized</h4>
                        <p className='text-xs text-stone-500 leading-relaxed font-medium'>
                            Custom experiences matched for Solo, Couple, Family, or Group trips.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero