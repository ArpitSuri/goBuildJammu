import React from 'react'
import { ArrowUp, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
      <footer className="bg-gray-50 text-gray-900 font-sans pt-24 pb-10 px-6 md:px-12 lg:px-20 border-t border-gray-200">
          <div className="mx-auto max-w-[1400px]">
              
              {/* Top Section: Newsletter & Brand */}
              <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-16">
                  
                  {/* Brand & Mission */}
                  <div className="max-w-md">
                      <div className="flex items-center gap-3 mb-6">
                          <img src="/Logocropped.png" alt="Digital Infratech Logo" className="h-10 w-auto object-contain" />
                          <span className="text-lg font-bold tracking-widest uppercase text-black">Digital Infratech</span>
                      </div>
                      <p className="text-[14px] text-gray-600 font-medium leading-relaxed mb-8">
                          Premium building materials, delivered directly to your doorstep. We are committed to providing the highest quality infrastructure supplies for your projects across Lucknow.
                      </p>
                      <div className="flex items-center gap-4">
                          <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black hover:shadow-md transition-all duration-300">
                              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                          <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black hover:shadow-md transition-all duration-300">
                              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                          </a>
                          <a href="#" className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black hover:shadow-md transition-all duration-300">
                              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          </a>
                      </div>
                  </div>

                  {/* Newsletter */}
                  <div className="w-full lg:max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                          Stay in the loop
                      </h3>
                      <p className="text-[14px] text-gray-500 font-medium leading-relaxed mb-6">
                          Subscribe to get updates on new materials and exclusive offers.
                      </p>
                      <form className="relative flex items-center group">
                          <input
                              type="email"
                              placeholder="Enter your email address"
                              className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-6 pr-32 text-[14px] font-medium outline-none placeholder:text-gray-400 focus:border-black transition-colors"
                          />
                          <button
                              type="submit"
                              className="absolute right-1.5 bg-black text-white px-6 py-2.5 rounded-full text-[12px] font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors"
                          >
                              Subscribe
                          </button>
                      </form>
                  </div>
              </div>

              {/* Middle Section: Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 mb-16 pt-16 border-t border-gray-200">
                  
                  {/* CONTACT */}
                  <div>
                      <h4 className="text-[12px] font-bold tracking-widest uppercase text-black mb-6">Contact Us</h4>
                      <ul className="space-y-5 text-[14px] font-medium text-gray-600">
                          <li className="flex items-start gap-3">
                              <Mail className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                              <a href="mailto:info@digitalinfratech.in" className="hover:text-black transition-colors">info@digitalinfratech.in</a>
                          </li>
                          <li className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">Room no 104, OM Plazza,<br/>Munshi Pulia, Lucknow</span>
                          </li>
                      </ul>
                  </div>

                  {/* COMPANY */}
                  <div>
                      <h4 className="text-[12px] font-bold tracking-widest uppercase text-black mb-6">Company</h4>
                      <ul className="space-y-4 text-[14px] font-medium text-gray-600">
                          {["About Us", "Our Stores", "Knowledge Hub", "FAQ's", "Careers"].map((item) => (
                              <li key={item}>
                                  <a href="#" className="hover:text-black transition-colors inline-block">{item}</a>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* LEGAL */}
                  <div>
                      <h4 className="text-[12px] font-bold tracking-widest uppercase text-black mb-6">Legal</h4>
                      <ul className="space-y-4 text-[14px] font-medium text-gray-600">
                          {["Refund Policy", "Privacy Policy", "Terms of Service", "Shipping Policy"].map((item) => (
                              <li key={item}>
                                  <a href="#" className="hover:text-black transition-colors inline-block">{item}</a>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center text-[13px] font-medium tracking-wide text-gray-500 gap-6 pt-8 border-t border-gray-200">
                  <p className="flex-1 text-center md:text-left">
                      © 2026 Digital Infratech Retail Private Limited.
                  </p>

                  <div className="flex-1 flex justify-center">
                      <p className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                          <span className="text-gray-700">All systems operational</span>
                      </p>
                  </div>

                  <div className="flex-1 flex justify-center md:justify-end">
                      <button
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                          className="w-12 h-12 bg-white border border-gray-200 text-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-1"
                          aria-label="Scroll to top"
                      >
                          <ArrowUp size={20} strokeWidth={2} />
                      </button>
                  </div>
              </div>
          </div>
      </footer>
  )
}

export default Footer
