import { Pencil, Ban } from "lucide-react";

export default function AttributeList({ attributes, onEdit, onDelete }) {
  return (
    <div className="divide-y border border-gray-200 rounded-2xl bg-white">
      {attributes.map((attr) => {
        const isDisabled = attr.isFilterable === false;

        return (
          <div
            key={attr._id}
            className={`flex justify-between items-center px-4 py-4 transition ${
              isDisabled ? "opacity-50 bg-gray-50" : "hover:bg-gray-50"
            }`}
          >
            {/* Left */}
            <div>
              <p className="text-gray-800 font-medium flex items-center gap-2">
                {attr.name}

                {isDisabled && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Disabled
                  </span>
                )}
              </p>

              <p className="text-sm text-gray-500">
                {attr.type} • {attr.category?.name || "No Category"}
              </p>

              {attr.options?.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {attr.options.join(", ")}
                </p>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(attr)}
                disabled={isDisabled}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg transition ${
                  isDisabled
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Pencil size={14} />
                Edit
              </button>

              {!isDisabled ? (
                <button
                  onClick={() => onDelete(attr._id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <Ban size={14} />
                  Disable
                </button>
              ) : (
                <span className="text-sm text-gray-400">
                  Disabled
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}