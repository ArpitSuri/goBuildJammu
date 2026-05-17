import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { getCart } from "../services/cartService";

const SERVICEABLE_PINS = ["226001", "226002", "226003", "226004", "226005", "226010", "226012", "226017", "226018", "226023", "227308"];

export default function Checkout() {
    const [step, setStep] = useState(1); // 1: Pincode, 2: Address, 3: Payment, 4: Review
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pincode: "",
        houseNo: "",
        area: "",
        landmark: "",
        paymentMethod: "COD"
    });

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        const { data } = await getCart();
        setCart(data);
    };

    const handleOrder = async () => {
        // ✅ CONCATENATE ADDRESS FIELDS
        // This creates the single "address" string the controller requires
        const fullAddressString = `${formData.houseNo.trim()}, ${formData.area.trim()}${formData.landmark ? `, Landmark: ${formData.landmark.trim()}` : ""}, PIN: ${formData.pincode.trim()}`;

        const payload = {
            address: fullAddressString, // Sent as a single string
            paymentMethod: formData.paymentMethod
        };

        try {
            setLoading(true);
            const { data } = await createOrder(payload);
            navigate(`/orders/${data.order._id}`);
        } catch (err) {
            // This will now catch if the backend still thinks something is missing
            alert(err.response?.data?.message || "Order failed");
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return null;

    return (
        <div className="max-w-xl mx-auto p-6 md:p-10 min-h-screen font-sans">
            {/* Step Indicators */}
            <div className="flex justify-between items-center mb-16 relative">
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gray-200 -z-10"></div>
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-10 h-10 flex items-center justify-center text-[12px] font-medium transition-all duration-300 ${step >= s ? "bg-black text-white border border-black" : "bg-white text-gray-400 border border-gray-200"}`}>
                        {s}
                    </div>
                ))}
            </div>

            {/* STEP 1: PINCODE CHECK */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-black mb-2">Delivery Check</h2>
                        <div className="h-[1px] w-8 bg-black"></div>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter 6-digit Pincode"
                        className="w-full border border-gray-200 px-6 py-4 text-[14px] font-light text-black placeholder:text-gray-400 focus:border-black outline-none transition-colors"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    />
                    <button
                        onClick={() => SERVICEABLE_PINS.includes(formData.pincode) ? setStep(2) : alert("Sorry, we don't deliver here yet.")}
                        className="w-full bg-black text-white py-4 text-[12px] font-medium tracking-widest uppercase hover:bg-white hover:text-black border border-black transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-none"
                    >
                        Verify Location
                    </button>
                </div>
            )}

            {/* STEP 2: ADDRESS CONCATENATION BOX */}
            {step === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-black mb-2">Shipping Details</h2>
                        <div className="h-[1px] w-8 bg-black"></div>
                    </div>
                    <input
                        placeholder="House / Flat / Plot No."
                        className="w-full border border-gray-200 px-6 py-4 text-[14px] font-light text-black placeholder:text-gray-400 focus:border-black outline-none transition-colors"
                        onChange={e => setFormData({ ...formData, houseNo: e.target.value })}
                        value={formData.houseNo}
                    />
                    <textarea
                        placeholder="Area / Colony / Street Name"
                        className="w-full border border-gray-200 px-6 py-4 h-32 text-[14px] font-light text-black placeholder:text-gray-400 focus:border-black outline-none transition-colors resize-none"
                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                        value={formData.area}
                    />
                    <input
                        placeholder="Landmark (Optional)"
                        className="w-full border border-gray-200 px-6 py-4 text-[14px] font-light text-black placeholder:text-gray-400 focus:border-black outline-none transition-colors"
                        onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                        value={formData.landmark}
                    />
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setStep(1)} className="flex-1 py-4 text-[12px] font-medium tracking-widest uppercase text-gray-500 hover:text-black transition-colors border border-gray-200">
                            Back
                        </button>
                        <button
                            disabled={!formData.houseNo || !formData.area}
                            onClick={() => setStep(3)}
                            className="flex-[2] bg-black text-white py-4 text-[12px] font-medium tracking-widest uppercase hover:bg-white hover:text-black border border-black transition-all duration-300 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-black mb-2">Payment</h2>
                        <div className="h-[1px] w-8 bg-black"></div>
                    </div>
                    <div className="space-y-4">
                        {/* COD Option */}
                        <label className={`flex items-center justify-between p-6 border cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-4">
                                <input type="radio" checked={formData.paymentMethod === 'COD'} onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })} className="w-4 h-4 accent-black" />
                                <div>
                                    <p className="text-[14px] font-medium text-black tracking-wide">Cash on Delivery</p>
                                    <p className="text-[12px] font-light text-gray-500 mt-1">Pay securely at your doorstep</p>
                                </div>
                            </div>
                            <span className="text-xl opacity-60">💵</span>
                        </label>

                        {/* Disabled Online Option */}
                        <div className="flex items-center justify-between p-6 border border-gray-200 opacity-40 cursor-not-allowed grayscale">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 border border-gray-300 rounded-full" />
                                <div>
                                    <p className="text-[14px] font-medium text-black tracking-wide">Online (UPI / Cards)</p>
                                    <p className="text-[10px] font-medium tracking-widest uppercase text-gray-500 mt-1">Currently Unavailable</p>
                                </div>
                            </div>
                            <span className="text-xl opacity-60">💳</span>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setStep(2)} className="flex-1 py-4 text-[12px] font-medium tracking-widest uppercase text-gray-500 hover:text-black transition-colors border border-gray-200">
                            Back
                        </button>
                        <button onClick={() => setStep(4)} className="flex-[2] bg-black text-white py-4 text-[12px] font-medium tracking-widest uppercase hover:bg-white hover:text-black border border-black transition-all duration-300">
                            Review Order
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 4: FINAL REVIEW */}
            {step === 4 && (
                <div className="space-y-8 animate-in zoom-in-95">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-black mb-2">Review</h2>
                        <div className="h-[1px] w-8 bg-black"></div>
                    </div>
                    <div className="bg-white p-8 border border-gray-200 space-y-6">
                        <div>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">Shipping To</p>
                            <p className="text-[14px] font-light text-gray-800 leading-relaxed">
                                {formData.houseNo}, {formData.area} <br />
                                {formData.landmark && <span className="block mt-1">Near {formData.landmark}</span>}
                                <span className="block mt-3 text-[13px] font-medium text-black tracking-widest uppercase">PIN: {formData.pincode}</span>
                            </p>
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-2">Payment</p>
                                <p className="text-[13px] font-medium text-black tracking-widest uppercase">{formData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</p>
                            </div>
                            <button onClick={() => setStep(3)} className="text-[10px] font-medium text-gray-400 hover:text-black uppercase tracking-widest transition-colors border-b border-gray-400 hover:border-black">Edit</button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setStep(3)} className="flex-1 py-4 text-[12px] font-medium tracking-widest uppercase text-gray-500 hover:text-black transition-colors border border-gray-200 disabled:opacity-50" disabled={loading}>
                            Back
                        </button>
                        <button
                            onClick={handleOrder}
                            disabled={loading}
                            className="flex-[2] bg-black text-white py-4 text-[12px] font-medium tracking-widest uppercase hover:bg-white hover:text-black border border-black transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-none disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
                        >
                            {loading ? "PROCESSING..." : "PLACE ORDER"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}