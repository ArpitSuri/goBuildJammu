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
      console.log("User Roles:", user.role); // Debugging line

      const roles = user.role || [];

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 font-sans" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] w-full max-w-md mx-4 border border-gray-100 animate-[fadeIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-black tracking-tight mb-2">
            Verify your number
          </h2>
          <p className="text-[13px] text-gray-500 font-light">
            Enter the 6-digit code sent to <span className="font-medium text-black">+91 {data.phone}</span>
          </p>
        </div>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className="w-12 h-14 text-center text-lg font-semibold text-black border border-gray-200 rounded-2xl outline-none focus:border-black focus:ring-1 focus:ring-black/10 bg-gray-50/50 transition-all duration-200 shadow-sm"
              value={otp[index] || ""}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="w-full bg-black text-white text-[13px] font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend & Cancel */}
        <div className="flex items-center justify-between mt-6">
          <button className="text-[13px] text-gray-500 hover:text-black font-medium transition-colors cursor-pointer">
            Resend code
          </button>
          <button
            onClick={onClose}
            className="text-[13px] text-gray-400 hover:text-black font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}