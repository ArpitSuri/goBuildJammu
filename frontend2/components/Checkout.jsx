import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderService";
import { getCart } from "../services/cartService";

const SERVICEABLE_PINS = ["282001", "110001", "144001"];

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
        <div className="max-w-2xl mx-auto p-6 min-h-screen">
            {/* Step Indicators */}
            <div className="flex justify-between mb-10 px-4">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? "bg-[#FADB5F] text-black" : "bg-gray-100 text-gray-400"}`}>
                        {s}
                    </div>
                ))}
            </div>

            {/* STEP 1: PINCODE CHECK */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">1. Delivery Check</h2>
                    <input
                        type="text"
                        placeholder="Enter 6-digit Pincode"
                        className="w-full border-2 border-gray-100 p-5 rounded-2xl text-2xl font-bold focus:border-[#FADB5F] outline-none"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    />
                    <button
                        onClick={() => SERVICEABLE_PINS.includes(formData.pincode) ? setStep(2) : alert("Sorry, we don't deliver here yet.")}
                        className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-900 transition"
                    >
                        Verify Location
                    </button>
                </div>
            )}

            {/* STEP 2: ADDRESS CONCATENATION BOX */}
            {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">2. Shipping Details</h2>
                    <input
                        placeholder="House / Flat / Plot No."
                        className="w-full border-2 border-gray-50 p-4 rounded-xl outline-none focus:border-[#FADB5F]"
                        onChange={e => setFormData({ ...formData, houseNo: e.target.value })}
                    />
                    <textarea
                        placeholder="Area / Colony / Street Name"
                        className="w-full border-2 border-gray-50 p-4 rounded-xl h-32 outline-none focus:border-[#FADB5F]"
                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                    />
                    <input
                        placeholder="Landmark (Optional)"
                        className="w-full border-2 border-gray-50 p-4 rounded-xl outline-none focus:border-[#FADB5F]"
                        onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                    />
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setStep(1)} className="flex-1 py-4 font-bold text-gray-400">Back</button>
                        <button
                            disabled={!formData.houseNo || !formData.area}
                            onClick={() => setStep(3)}
                            className="flex-[2] bg-black text-white py-4 rounded-xl font-bold disabled:opacity-30"
                        >
                            Continue to Payment
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">3. Payment</h2>
                    <div className="space-y-3">
                        {/* COD Option */}
                        <label className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'COD' ? 'border-[#FADB5F] bg-yellow-50/50' : 'border-gray-50'}`}>
                            <div className="flex items-center gap-4">
                                <input type="radio" checked={formData.paymentMethod === 'COD'} onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })} className="w-5 h-5 accent-black" />
                                <div>
                                    <p className="font-bold text-lg">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500 font-medium">Pay securely at your doorstep</p>
                                </div>
                            </div>
                            <span className="text-2xl">💵</span>
                        </label>

                        {/* Disabled Online Option */}
                        <div className="flex items-center justify-between p-6 border-2 border-gray-50 rounded-2xl opacity-40 cursor-not-allowed grayscale">
                            <div className="flex items-center gap-4">
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                <div>
                                    <p className="font-bold text-lg">Online (UPI / Cards)</p>
                                    <p className="text-[10px] font-black text-yellow-600 tracking-tighter uppercase">Currently Unavailable</p>
                                </div>
                            </div>
                            <span className="text-2xl">💳</span>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setStep(2)} className="flex-1 py-4 font-bold text-gray-400">Back</button>
                        <button onClick={() => setStep(4)} className="flex-[2] bg-black text-white py-4 rounded-xl font-bold">Review Order</button>
                    </div>
                </div>
            )}

            {/* STEP 4: FINAL REVIEW */}
            {step === 4 && (
                <div className="space-y-8 animate-in zoom-in-95">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">4. Review</h2>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-200 space-y-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping To</p>
                            <p className="font-bold text-gray-800 leading-tight">
                                {formData.houseNo}, {formData.area} <br />
                                {formData.landmark && <span className="text-sm font-medium text-gray-500">Near {formData.landmark}</span>}
                                <span className="block mt-1 font-black text-[#FADB5F]">{formData.pincode}</span>
                            </p>
                        </div>
                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                                <p className="font-bold">{formData.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</p>
                            </div>
                            <button onClick={() => setStep(3)} className="text-xs font-bold text-gray-400 underline uppercase">Edit</button>
                        </div>
                    </div>

                    <button
                        onClick={handleOrder}
                        disabled={loading}
                        className="w-full bg-[#FADB5F] hover:bg-yellow-400 text-black py-5 rounded-2xl font-black text-2xl shadow-xl shadow-yellow-100 transition active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "PROCESSING..." : "PLACE ORDER NOW"}
                    </button>
                </div>
            )}
        </div>
    );
}