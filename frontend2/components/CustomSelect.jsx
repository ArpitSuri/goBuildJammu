import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Select option";

  return (
    <div className="relative" ref={ref}>
      
      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center 
        bg-white hover:border-green-600 transition"
      >
        <span className="text-gray-700">{selectedLabel}</span>
        <span className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-52 overflow-y-auto">

          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer text-sm 
              ${
                value === opt.value
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}