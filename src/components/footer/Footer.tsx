import React from 'react'

export default function Footer() {
  return (

    <footer className="bg-slate-300 text-gray-800 w-full  bottom-0">

      <div className="container mx-auto px-6 py-10">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">Gulit</h2>
            <p className="mt-2 text-gray-700">
              Your one-stop destination for all electronics. Explore, shop, and
              enjoy!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <h3 className="uppercase font-medium text-gray-900">Company</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-medium text-gray-900">Support</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-medium text-gray-900">Follow Us</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-400"></div>

        <div className="flex flex-col items-center justify-between mt-6 sm:flex-row">
          <p className="text-sm text-gray-700">
            &copy; {new Date().getFullYear()} Gulit. All Rights Reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M22 2H2a2 2 0 00-2 2v16a2 2 0 002 2h11v-7H9v-3h4v-2c0-3 2-5 5-5h3v3h-3c-1 0-2 .5-2 2v2h4l-1 3h-3v7h4a2 2 0 002-2V4a2 2 0 00-2-2z" />
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-20c0-1.1-.9-2-2-2zm-7 22h-2v-10h2v10zm-1-11c-.7 0-1-.5-1-1 0-.6.4-1 1-1s1 .4 1 1c0 .5-.4 1-1 1zm9 11h-2v-6c0-1-.4-2-1.4-2-.7 0-1.1.5-1.4 1-.1.3-.1.5-.1.7v6h-2s.1-10 0-11h2v1.5c.3-.4.7-1.2 1.8-1.2 1.3 0 2.2.8 2.2 3v7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
