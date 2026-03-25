import { useNavigate } from "react-router-dom";

export default function HeroStack() {
    const navigate = useNavigate();

    const banners = [
        {
            id: 1,
            image: "https://via.placeholder.com/1200x400?text=Banner+1",
            link: "/category/electronics"
        },
        {
            id: 2,
            image: "https://via.placeholder.com/1200x400?text=Banner+2",
            link: "/category/fashion"
        },
        {
            id: 3,
            image: "https://via.placeholder.com/1200x400?text=Banner+3",
            link: "/category/home"
        }
    ];

    return (
        <div className="w-full px-4 py-4 space-y-4">
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    onClick={() => navigate(banner.link)}
                    className="w-full h-[180px] md:h-[250px] lg:h-[300px] cursor-pointer overflow-hidden rounded-xl"
                >
                    <img
                        src={banner.image}
                        alt={`Banner ${banner.id}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ))}
        </div>
    );
}