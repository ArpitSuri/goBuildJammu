import { useState, useRef } from "react";
import { verifyOTP } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function OTPModal({ isOpen, onClose, data }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const otpArray = otp.split("");
    otpArray[index] = value;
    const finalOtp = otpArray.join("");
    setOtp(finalOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    try {
      setLoading(true);

      const res = await verifyOTP({
        phone: data.phone,
        otp,
        name: data.name,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      const roles = user.roles || [];

      if (roles.includes("admin")) {
        navigate("/admin");
      } else if (roles.includes("delivery")) {
        navigate("/delivery");
      } else {
        navigate("/");
      }

      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the OTP sent to your phone
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-between mb-6">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-12 h-12 text-center text-lg border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 border-gray-300"
              value={otp[index] || ""}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}