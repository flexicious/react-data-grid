/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { AutoSizingGrid } from "./auto-sizing-grid";
import "@ezgrid/grid-core/icons.css";
import "@ezgrid/grid-core/styles.css";

import { useEffect } from "react";

export function App() {
  const onWindowScroll = function () {
    var header = document.getElementsByTagName("header")[0];
    if (window.pageYOffset > 0) {
      header.classList.add("scroll");
    } else {
      header.classList.remove("scroll");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", onWindowScroll);
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
    };
  }, []);


  return (
    <>
      <header>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <ul>
          <li><a href="#">Welcome to React DataGrid</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <AutoSizingGrid />
      </main>
      <footer>
        <p>Copyright © 2023</p>
        <p>Powered by React Data Grid </p>
        <p>
          Privacy Policy | Terms of Use | Sitemap
        </p>
        <p>
          Cookie Preferences | Corporate Information.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a  
          diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac
        </p>
      </footer>
    </>);

}


export default App;

