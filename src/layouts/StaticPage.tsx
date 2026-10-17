import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import "../styles/StaticPage.css";

// The four side pages (Help, Rules, Store, Forum) share the same shell, so it lives
// here once instead of being copy-pasted four times.
function StaticPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="header-login-panel">
      <div className="aside-container">
        <LoginPanel />
        <RandomInfos />
      </div>
      <Navbar />
      <div className="main-page">
        <article className="static-page">
          <h2>{title}</h2>
          {children}
        </article>
      </div>
    </div>
  );
}

export default StaticPage;
