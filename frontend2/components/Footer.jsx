import React from 'react'

const Footer = () => {
  return (
      <footer className="bg-[#F2C100] text-[#1A1A1A] font-sans pt-16 pb-8 px-6 md:px-20">

          <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

              {/* LEFT SECTION */}
              <div className="flex flex-col space-y-6">

                  {/* App Buttons */}
                  {/* <div className="flex flex-wrap gap-3">
                      <img
                          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                          alt="Google Play"
                          className="h-10 w-auto max-w-[140px]"
                      />
                      <img
                          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                          alt="App Store"
                          className="h-10 w-auto max-w-[140px]"
                      />
                  </div> */}

                  {/* Brand */}
                  <div>
                      <h2 className="text-xl font-bold border-b border-black inline-block pb-1 mb-3">
                          DigitalInfratech - Building materials at door step
                      </h2>
                      <p className="text-sm leading-relaxed max-w-xs">
                          DigitalInfratech™ is owned and operated by DigitalInfratech Retail Private Limited.
                      </p>
                  </div>

                  {/* Socials */}
                  <div className="flex gap-4 text-lg">
                      <a href="#"><i className="fab fa-facebook-f"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                      <a href="#"><i className="fab fa-youtube"></i></a>
                  </div>
              </div>

              {/* COMPANY */}
              <div>
                  <h3 className="font-bold text-lg mb-6">Company</h3>
                  <ul className="space-y-3">
                      {["About Us", "Contact", "Knowledge Hub", "FAQ's"].map((item) => (
                          <li key={item}>
                              <a href="#" className="flex items-center text-sm group">
                                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition">
                                      ❯
                                  </span>
                                  {item}
                              </a>
                          </li>
                      ))}
                  </ul>
              </div>

              {/* POLICY */}
              <div>
                  <h3 className="font-bold text-lg mb-6">Policy</h3>
                  <ul className="space-y-3">
                      {[
                          "Refund Policy",
                          "Privacy Policy",
                          "Terms of Service",
                          "Shipping Policy",
                      ].map((item) => (
                          <li key={item}>
                              <a href="#" className="flex items-center text-sm group">
                                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition">
                                      ❯
                                  </span>
                                  {item}
                              </a>
                          </li>
                      ))}
                  </ul>
              </div>

              {/* CONTACT */}
              <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                  <div className="text-sm leading-relaxed">
                      <p className="mb-2">
                          <span className="font-medium">Email:</span>{" "}
                          <span className="opacity-80">infor@digitalinfratech.in</span>
                      </p>
                      <p>
                          <span className="font-medium">Address:</span>{" "}
                          <span className="opacity-80">
                             Room no 104. OM Plazza ,Munshi pulia
                          </span>
                      </p>
                  </div>
              </div>
          </div>

          {/* Divider */}
          <hr className="border-black/10 mb-12" />

          {/* Newsletter */}
          <div className="max-w-xl mx-auto text-center mb-16 px-2">
              <h3 className="text-lg md:text-xl font-bold mb-6">
                  Get updates on new products & offers
              </h3>

              <form className="relative">
                  <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-transparent border border-black/30 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-black"
                  />
                  <button
                      type="submit"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                  >
                      →
                  </button>
              </form>
          </div>

          {/* Bottom Bar */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-4 opacity-70 text-center md:text-left">
              <p>© 2026, DigitalInfraTech</p>

              <div className="flex flex-wrap justify-center gap-4">
                  <a href="#" className="hover:underline">Refund</a>
                  <a href="#" className="hover:underline">Privacy</a>
                  <a href="#" className="hover:underline">Terms</a>
                  <a href="#" className="hover:underline">Shipping</a>
              </div>
          </div>

          {/* Scroll to Top */}
          <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 bg-[#1B8A31] text-white p-3 rounded-md shadow-lg hover:scale-110 transition"
          >
              ▲
          </button>

      </footer>
  )
}

export default Footer
