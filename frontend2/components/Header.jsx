export function HeroSection() {
    return (
        <div className="w-full bg-gray-50 px-6 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* LEFT CONTENT */}
            <div className="max-w-xl">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                    Build Better with <span className="text-blue-600">Quality Materials</span>
                </h1>

                <p className="text-gray-600 mb-6">
                    Explore top-grade cement, tools, and construction essentials — delivered to your location.
                </p>

                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                    Shop Now
                </button>
            </div>

            {/* RIGHT IMAGE */}
            <div className="w-full md:w-[45%]">
                <img
                    src="https://images.unsplash.com/photo-1581094794329-c8112a89af12"
                    alt="Construction Materials"
                    className="w-full h-[250px] md:h-[350px] object-cover rounded-lg"
                />
            </div>
        </div>
    );
}