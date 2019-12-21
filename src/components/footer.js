import React from "react";

import github from "../images/github.png";
import twitter from "../images/twitter.png";

const Footer = () => (
  <div className="row">
    <footer className="column">
      <div className="author">
        Logo from{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Phong-shading-sample.jpg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Wikimedia Commons
        </a>
      </div>
      <div className="social">
        <a
          href="https://github.com/sabarnac/shader-tutorial/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={github} alt="GitHub Repo Link" />
        </a>
        <a
          href="https://twitter.com/disappointin_af"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={twitter} alt="Twitter Link" />
        </a>
      </div>
    </footer>
  </div>
)

export default Footer
