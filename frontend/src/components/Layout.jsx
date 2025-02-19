import { Outlet } from "react-router-dom";
import Navbar from "./ui/Navbar";
import Footer from "./ui/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-[77vh]">
        <Outlet /> {/* ✅ Ye fix karega pages render hone ka issue */}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
