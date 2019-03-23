import PropTypes from "prop-types"
import React from "react"
import Navigation from "./navigation"
import icon from "../images/icon.png"

const Header = ({ siteTitle }) => (
  <header className="column column-25">
    <img
      src={icon}
      style={{ display: "block", maxWidth: "65%", margin: "0 auto" }}
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
