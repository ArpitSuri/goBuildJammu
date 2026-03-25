import { Trash2 } from "lucide-react";

export default function ProductList({ products, onDelete, onSelect })  {
  return (
    <div className="divide-y border border-gray-200 rounded-2xl bg-white">
      {products.map((p) => (
        <div
          key={p._id}
          onClick={() => onSelect(p)} // 🔥 THIS LINE
          className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition cursor-pointer"
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            
            {/* Image */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
              IMG
            </div>

            {/* Info */}
            <div>
              <p className="text-gray-800 font-medium">
                {p.name}
              </p>

              <p className="text-sm text-gray-500">
                {p.category?.name || "No Category"}
              </p>

              {/* Optional price (agar backend me hai) */}
              {p.price && (
                <p className="text-xs text-gray-400">
                  ₹ {p.price}
                </p>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 PREVENT SELECT
                onDelete(p._id);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 size={14} />
              Deactivate
            </button>
          </div>
        </div>
      ))}
      
    </div>
  );
}