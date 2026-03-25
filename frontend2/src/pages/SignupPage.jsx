import { useState } from "react";
import { sendSignupOTP } from "../../services/authService";
import OTPModal from "../../components/OtpModel";

export default function Signup() {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [showOTP, setShowOTP] = useState(false);

    const handleSubmit = async () => {
        try {
            await sendSignupOTP({ phone, name });

            setShowOTP(true);
        } catch (err) {
            alert(err.response?.data?.message);
        }
    };

    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">

      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="bg-yellow-400 p-3 rounded-lg">
          ⚡
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800">
        Signup with OTP
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Create your new account
      </p>

      {/* Name Input */}
      <div className="text-left mb-4">
        <label className="text-sm text-gray-600">Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full mt-1 p-2 border rounded-lg outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Phone Input */}
      <div className="text-left mb-4">
        <label className="text-sm text-gray-600">Phone</label>
        <div className="flex mt-1 border rounded-lg overflow-hidden">
          <span className="px-3 flex items-center bg-gray-100 text-gray-600 text-sm">
            IN
          </span>
          <input
            type="text"
            placeholder="Phone number"
            className="w-full p-2 outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
      >
        Request OTP
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-400 mt-4">
        I accept that I have read & understood
        <br />
        <span className="underline cursor-pointer hover:text-yellow-600">
          Privacy Policy and T&Cs
        </span>
      </p>

      {/* Login Link */}
      <p className="text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <span className="text-yellow-600 font-medium cursor-pointer hover:underline">
          Log in
        </span>
      </p>
    </div>

    <OTPModal
      isOpen={showOTP}
      onClose={() => setShowOTP(false)}
      data={{ phone, name }}
    />
  </div>
);
}