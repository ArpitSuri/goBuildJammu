import { useState } from "react";
import { Link } from "react-router-dom";
import { sendLoginOTP } from "../../services/authService";
import OTPModal from "../../components/OtpModel";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const siteUrl = "https://www.digitalinfratech.in/login";
    const [phone, setPhone] = useState("");
    const [showOTP, setShowOTP] = useState(false);

    const handleSubmit = async () => {
        try {
            await sendLoginOTP({ phone });

            setShowOTP(true);
        } catch (err) {
            alert(err.response?.data?.message);
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
        Login with OTP
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter your log in details
      </p>

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
        className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-black font-semibold py-2 rounded-lg transition"
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

      {/* Signup */}
      <p className="text-sm text-gray-500 mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-yellow-600 font-medium hover:underline">
          Sign up
        </Link>
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