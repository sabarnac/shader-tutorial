import { StaticImage } from "gatsby-plugin-image"
import PropTypes from "prop-types"
import React from "react"

import Navigation from "./navigation"

const Header = ({ siteTitle }) => (
  <header className="column column-25">
    <StaticImage
      src="../images/icon.png"
      alt="GPU Shader Tutorial Logo"
      style={{ display: "block", maxWidth: "45%", margin: "0 auto" }}
    />
    <h1>{siteTitle}</h1>
    <Navigation />
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
