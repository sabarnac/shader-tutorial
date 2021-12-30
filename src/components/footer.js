import { StaticImage } from "gatsby-plugin-image"
import React from "react"

const Footer = () => (
  <div className="row">
    <footer className="column">
      <div className="author">
        Logo inspired from{" "}
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
          <StaticImage
            src="../images/github.png"
            alt="GitHub Repo Link"
            style={{ width: "32px", height: "32px" }}
          />
        </a>
      </div>
    </footer>
  </div>
)

export default Footer
