import logo from "../../assets/images/invoice-logo.svg";
import Navbar from "../Header/Navbar/Navbar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle("lock-scroll");
  };

  const isHomePage = location.pathname === "/";

  return (
    <header className="fixed top-0 z-40 py-4 px-6 flex w-full items-center justify-between p-0 bg-white shadow-md">
      <a
        href="#main"
        className="absolute left-0 z-[100] m-3 -translate-x-[150%] bg-soft-blue p-3 text-white transition focus:translate-x-0"
      >
        Skip to main content
      </a>
      <div className="flex items-center gap-4">
        <a href="/" className="z-50 flex gap-1">
          <img
            src={logo}
            alt="Bookmark"
            width={25}
            height={45}
            className={`transition duration-300 ease-in-out md:filter-none ${
              isMenuOpen ? "filter-logo-blue" : ""
            }`}
          />
          <h2 className="text-blue-500 font-bold text-xl">InvoiceGen</h2>
        </a>
        {!isHomePage && (
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition duration-300 font-semibold text-sm"
            title="Go back to previous page"
          >
            ← Back
          </button>
        )}
      </div>

      <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
    </header>
  );
};

export default Header;
