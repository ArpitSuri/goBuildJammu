// export function HeroSection() {
//     return (
//         <div className="w-full bg-gray-50 px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">

//             {/* LEFT CONTENT */}
//             <div className="max-w-xl">
//                 <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
//                     Build Better with <span className="text-blue-600">Quality Materials</span>
//                 </h1>

//                 <p className="text-gray-600 mb-6">
//                     Explore top-grade cement, tools, and construction essentials — delivered to your location.
//                 </p>

//                 <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
//                     Shop Now
//                 </button>
//             </div>

//             {/* RIGHT IMAGE */}
//             <div className="w-full md:w-[45%]">
//                 <img
//                     src="https://images.unsplash.com/photo-1581094794329-c8112a89af12"
//                     alt="Construction Materials"
//                     className="w-full h-[250px] md:h-[350px] object-cover rounded-lg"
//                 />
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SLIDES = [
    {
        id: 1,
        bg: "linear-gradient(135deg, #fdf6e3 0%, #f5e6c0 100%)",
        badge: "🏗️ LUCKNOW'S FASTEST DELIVERY",
        title: "Build Better with\nQuality Materials",
        subtitle: "Order more, Pay Less. Automatically.",
        cta: "Shop Now",
        ctaLink: "/",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&q=80",
        accent: "#FFD700",
    },
    {
        id: 2,
        bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        badge: "✅ 100% GENUINE PRODUCTS",
        title: "Cement, Ply &\nHardware in 60 Mins",
        subtitle: "QR-verified authentic materials delivered to your site.",
        cta: "Explore Categories",
        ctaLink: "/",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&q=80",
        accent: "#22c55e",
    },
    {
        id: 3,
        bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
        badge: "🚀 FREE DELIVERY ABOVE ₹5,000",
        title: "Bulk Orders?\nGet Wholesale Prices",
        subtitle: "Best rates on cement, plywood, electrical & more.",
        cta: "View Deals",
        ctaLink: "/",
        image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=700&q=80",
        accent: "#f97316",
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
            }, 350);
        }, 4500);
        return () => clearInterval(t);
    }, []);

    const goTo = (i) => {
        setFade(false);
        setTimeout(() => { setCurrent(i); setFade(true); }, 300);
    };

    const slide = SLIDES[current];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .hr-hero {
          font-family: 'Inter', sans-serif;
          width: 100%;
          background: ${slide.bg};
          transition: background 0.5s ease;
          position: relative;
          overflow: hidden;
          min-height: 420px;
          display: flex;
          align-items: center;
        }
        .hr-hero-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          box-sizing: border-box;
          gap: 32px;
        }
        .hr-hero-left {
          flex: 1;
          opacity: ${fade ? 1 : 0};
          transform: ${fade ? "translateY(0)" : "translateY(16px)"};
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .hr-hero-badge {
          display: inline-block;
          background: #fff;
          border: 2px solid ${slide.accent};
          color: #111;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        .hr-hero-title {
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          color: #111;
          line-height: 1.15;
          margin: 0 0 14px;
          white-space: pre-line;
        }
        .hr-hero-sub {
          font-size: 16px;
          color: #555;
          font-weight: 500;
          margin: 0 0 28px;
          font-style: italic;
        }
        .hr-hero-cta {
          background: #111;
          color: #FFD700;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }
        .hr-hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }
        .hr-hero-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          opacity: ${fade ? 1 : 0};
          transform: ${fade ? "scale(1)" : "scale(0.96)"};
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .hr-hero-img {
          width: 100%;
          max-width: 520px;
          height: 340px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }
        /* Dots */
        .hr-hero-dots {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .hr-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(0,0,0,0.2);
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          padding: 0;
        }
        .hr-dot.active {
          width: 24px;
          border-radius: 4px;
          background: #111;
        }
        /* Arrows */
        .hr-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.85);
          border: none;
          width: 38px; height: 38px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: background 0.2s;
          z-index: 2;
        }
        .hr-arrow:hover { background: #fff; }
        .hr-arrow-left { left: 16px; }
        .hr-arrow-right { right: 16px; }

        @media (max-width: 768px) {
          .hr-hero-inner { flex-direction: column; padding: 32px 20px; }
          .hr-hero-right { justify-content: center; }
          .hr-hero-img { height: 200px; max-width: 100%; }
        }
      `}</style>

            <div className="hr-hero" style={{ background: slide.bg }}>
                <button className="hr-arrow hr-arrow-left" onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}>‹</button>

                <div className="hr-hero-inner">
                    <div className="hr-hero-left">
                        <div className="hr-hero-badge">{slide.badge}</div>
                        <h1 className="hr-hero-title">{slide.title}</h1>
                        <p className="hr-hero-sub">{slide.subtitle}</p>
                        <button className="hr-hero-cta" onClick={() => navigate(slide.ctaLink)}>
                            {slide.cta} →
                        </button>
                    </div>
                    <div className="hr-hero-right">
                        <img className="hr-hero-img" src={slide.image} alt={slide.title} />
                    </div>
                </div>

                <button className="hr-arrow hr-arrow-right" onClick={() => goTo((current + 1) % SLIDES.length)}>›</button>

                <div className="hr-hero-dots">
                    {SLIDES.map((_, i) => (
                        <button key={i} className={`hr-dot ${i === current ? "active" : ""}`} onClick={() => goTo(i)} />
                    ))}
                </div>
            </div>
        </>
    );
}