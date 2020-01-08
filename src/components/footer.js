import React from "react";

import Image from "./image";

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
          <Image
            src="github.png"
            alt="GitHub Repo Link"
            style={{ width: "32px", height: "32px" }}
          />
        </a>
        <a
          href="https://twitter.com/disappointin_af"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            src="twitter.png"
            alt="Twitter Link"
            style={{ width: "32px", height: "32px" }}
          />
        </a>
      </div>
    </footer>
  </div>
)

export default Footer
