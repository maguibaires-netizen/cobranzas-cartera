import Navbar from "./Navbar.jsx";

export default function Layout({ children }) {
  return (
    <div className="shell">
      <div className="screen">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
