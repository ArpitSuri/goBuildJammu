import { useNavigate } from "react-router-dom";

export default function HeroStack() {
    const navigate = useNavigate();

    const banners = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&h=300&fit=crop",
            link: "/category/hardware",
            alt: "Hardware Tools Promotion"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=300&fit=crop",
            link: "/category/interiors",
            alt: "Interior Design Promotion"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?w=1200&h=300&fit=crop",
            link: "/category/electrical",
            alt: "Electrical Supplies Promotion"
        }
    ];

    return (
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-20 py-10 space-y-6">
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    onClick={() => navigate(banner.link)}
                    className="w-full h-[180px] md:h-[220px] lg:h-[260px] cursor-pointer overflow-hidden group bg-gray-50 border border-gray-100"
                >
                    <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </div>
            ))}
        </div>
    );
}