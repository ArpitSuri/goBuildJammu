import { Pencil, Trash2 } from "lucide-react";

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <div className="divide-y border border-gray-200 rounded-2xl bg-white">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition"
        >
          {/* Left */}
          <div>
            <p className="text-gray-800 font-medium">
              {cat.name}
            </p>
            <p className="text-sm text-gray-500">
              {cat.parent?.name || "Root Category"}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(cat)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              onClick={() => onDelete(cat._id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}