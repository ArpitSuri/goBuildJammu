import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SLIDES = [
    {
        id: 1,
        bg: "bg-[#f8f9fa]",
        badge: "Fastest Delivery in Lucknow",
        title: "Build Better with\nQuality Materials",
        subtitle: "Explore top-grade cement, tools, and construction essentials — delivered to your location. Order more, pay less. Automatically.",
        cta: "Shop Now",
        ctaLink: "/",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
    },
    {
        id: 2,
        bg: "bg-white",
        badge: "100% Genuine Products",
        title: "Cement, Ply &\nHardware in 60 Mins",
        subtitle: "QR-verified authentic materials delivered directly to your construction site without delay.",
        cta: "Explore Categories",
        ctaLink: "/",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
    },
    {
        id: 3,
        bg: "bg-gray-50/50",
        badge: "Free Delivery Above ₹5,000",
        title: "Bulk Orders?\nGet Wholesale Prices",
        subtitle: "Best rates on cement, plywood, electrical & more. Build your dream without breaking the bank.",
        cta: "View Deals",
        ctaLink: "/",
        image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
    },
];

export function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const t = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrent(c => (c + 1) % SLIDES.length);
                setFade(true);
            }, 600);
        }, 5500);
        return () => clearInterval(t);
    }, []);

    const goTo = (i) => {
        if (i === current) return;
        setFade(false);
        setTimeout(() => { setCurrent(i); setFade(true); }, 400);
    };

    const slide = SLIDES[current];

    return (
        <div className={`w-full relative overflow-hidden min-h-[500px] md:min-h-[640px] flex items-center transition-colors duration-1000 ${slide.bg} border-b border-gray-100 group font-sans`}>
            
            {/* Nav Arrows */}
            <button 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
            >
                <ArrowLeft size={20} strokeWidth={1} />
            </button>
            <button 
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-black opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => goTo((current + 1) % SLIDES.length)}
            >
                <ArrowRight size={20} strokeWidth={1} />
            </button>

            <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-16 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
                
                {/* Text Content */}
                <div className={`flex-1 flex flex-col items-start transition-all duration-700 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-block border border-gray-200 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase mb-8 text-gray-600 bg-white shadow-sm">
                        {slide.badge}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-black leading-[1.15] mb-6 whitespace-pre-line tracking-tight">
                        {slide.title}
                    </h1>
                    
                    <p className="text-[15px] md:text-[16px] text-gray-500 font-light mb-10 max-w-md leading-relaxed">
                        {slide.subtitle}
                    </p>
                    
                    <button 
                        onClick={() => navigate(slide.ctaLink)}
                        className="bg-black text-white px-8 py-4 text-[12px] font-medium tracking-[0.15em] uppercase hover:bg-white hover:text-black border border-black transition-all duration-300 cursor-pointer shadow-lg shadow-black/10 hover:shadow-none"
                    >
                        {slide.cta}
                    </button>
                </div>

                {/* Image Content */}
                <div className={`flex-1 w-full max-w-xl transition-all duration-700 transform ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
                        <img 
                            src={slide.image} 
                            alt={slide.title} 
                            className={`w-full h-full object-cover object-center transition-transform duration-[10s] ease-linear ${fade ? 'scale-105' : 'scale-100'}`}
                        />
                        {/* Minimal border frame inside image */}
                        <div className="absolute inset-4 border border-white/20 pointer-events-none mix-blend-overlay"></div>
                    </div>
                </div>

            </div>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                {SLIDES.map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => goTo(i)}
                        className={`transition-all duration-500 h-[2px] cursor-pointer ${i === current ? 'w-12 bg-black' : 'w-4 bg-black/20 hover:bg-black/50'}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}