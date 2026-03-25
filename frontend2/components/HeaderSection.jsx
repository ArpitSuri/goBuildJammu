export function Header() {
    return (
        <div className="w-full border-b px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-xl font-bold">YourStore</h1>

            {/* Search */}
            <input
                type="text"
                placeholder="Search products..."
                className="border px-4 py-2 w-[40%] rounded-md"
            />

            {/* Cart */}
            <button className="text-lg">🛒</button>
        </div>
    );
}