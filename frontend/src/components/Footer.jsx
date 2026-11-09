function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">
              Ekiti<span className="text-green-500">Move</span>
            </h2>

            <p className="mt-4 text-gray-400 max-w-sm">
              Your simple and reliable way to discover routes,
              transport options, and destinations across Ekiti State.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Home
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Routes
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Transport
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-green-400 transition">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold">
              Ekiti Move
            </h3>

            <p className="mt-4 text-gray-400">
              Helping you move around Ekiti with ease.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
          <p>
            © 2026 Ekiti Move. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;