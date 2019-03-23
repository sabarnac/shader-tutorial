import React from "react"
import twitter from "../images/twitter.png"

const Footer = () => (
  <div className="row">
    <footer className="column">
      <div className="author">
        By Sabarna Chakravarty | Logo from{" "}
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
          href="https://twitter.com/disappointin_af"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={twitter} alt="twitter" />
        </a>
      </div>
    </footer>
  </div>
)

export default Footer
