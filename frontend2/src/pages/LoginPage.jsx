import { useState } from "react";
import { Link } from "react-router-dom";
import { sendLoginOTP } from "../../services/authService";
import OTPModal from "../../components/OtpModel";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const siteUrl = "https://www.digitalinfratech.in/login";
    const [phone, setPhone] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!phone.trim()) return;
        try {
            setLoading(true);
            await sendLoginOTP({ phone });
            setShowOTP(true);
        } catch (err) {
            alert(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
      <>
      <Helmet>
        {/* Prevent search engines from indexing the login page */}
        <meta name="robots" content="noindex, nofollow" />
        
        <title>Login | Digital Infratech - Lucknow's Construction Hub</title>
        <meta name="description" content="Access your Digital Infratech account to manage your construction material orders and doorstep deliveries in Lucknow." />
        
        {/* Open Graph for branding */}
        <meta property="og:title" content="Login to Digital Infratech" />
        <meta property="og:description" content="Manage your building material and home accessory orders." />
        <meta property="og:url" content={siteUrl} />
        
        {/* Specific focus on security/trust */}
        <link rel="canonical" href={siteUrl} />
      </Helmet>

    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[length:24px_24px]"></div>

      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo2.png" alt="Digital Infratech" className="h-56 w-auto object-contain" />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-black tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[14px] text-gray-500 font-light">
              Enter your phone number to continue
            </p>
          </div>

          {/* Phone Input */}
          <div className="mb-6">
            <label className="block text-[12px] font-medium tracking-widest uppercase text-gray-500 mb-2">
              Phone Number
            </label>
            <div className="flex border border-gray-200 rounded-full overflow-hidden focus-within:border-black transition-colors shadow-sm">
              <span className="px-4 flex items-center bg-gray-50 text-[13px] font-medium text-gray-500 border-r border-gray-200">
                +91
              </span>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full px-4 py-3.5 text-[14px] font-medium text-black placeholder:text-gray-400 outline-none bg-transparent"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || phone.trim().length < 10}
            className="w-full bg-black text-white text-[13px] font-bold tracking-widest uppercase py-4 rounded-full transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
          >
            {loading ? "Sending OTP..." : "Request OTP"}
          </button>

          {/* Terms */}
          <p className="text-[11px] text-gray-400 text-center mt-6 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-gray-600 hover:text-black underline underline-offset-2 transition-colors">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-600 hover:text-black underline underline-offset-2 transition-colors">
              Terms of Service
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="text-[11px] text-gray-400 font-medium tracking-widest uppercase">or</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          {/* Signup */}
          <p className="text-[14px] text-gray-500 text-center font-light">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-semibold hover:underline underline-offset-4 transition-colors">
              Create account
            </Link>
          </p>
        </div>

        {/* Bottom branding */}
        <p className="text-center text-[11px] text-gray-400 mt-8 tracking-wide">
          © 2026 Digital Infratech Retail Private Limited
        </p>
      </div>

    <OTPModal
      isOpen={showOTP}
      onClose={() => setShowOTP(false)}
      data={{ phone }}
    />
  </div>
      </>
);
}