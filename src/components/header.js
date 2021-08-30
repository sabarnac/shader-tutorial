import { StaticImage } from "gatsby-plugin-image"
import PropTypes from "prop-types"
import React from "react"

import Navigation from "./navigation"

const Header = ({ siteTitle, isHomePage }) => (
  <header className="column column-25">
    <StaticImage
      src="../images/icon.png"
      alt="GPU Shader Tutorial Logo"
      style={{ display: "block", maxWidth: "45%", margin: "0 auto" }}
    />
    {isHomePage ? (
      <h1 id="site-title" class="title-largest">
        {siteTitle}
      </h1>
    ) : (
      <div
        id="site-title"
        class="title-largest"
        style={{ textAlign: "center" }}
      >
        {siteTitle}
      </div>
    )}
    <Navigation />
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  isHomePage: PropTypes.bool,
}

Header.defaultProps = {
  siteTitle: ``,
  isHomePage: false,
}

export default Header
