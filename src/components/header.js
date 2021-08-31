import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

import animatedIcon from "../images/icon-animated.png"
import icon from "../images/icon.png"
import Navigation from "./navigation"

const Header = ({ siteTitle, isHomePage }) => {
  const [showAnimatedIcon, setShowAnimatedIcon] = useState(false)

  useEffect(() => setShowAnimatedIcon(true), [])

  return (
    <header className="column column-25">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <picture>
          {showAnimatedIcon ? (
            <source srcSet={animatedIcon} type="image/apng" />
          ) : null}
          <img
            src={icon}
            alt="GPU Shader Tutorial Logo"
            height={256}
            width={256}
            style={{ width: "256px", height: "100%" }}
          />
        </picture>
      </div>
      {isHomePage ? (
        <h1 id="site-title" className="title-largest">
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
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  isHomePage: PropTypes.bool,
}

Header.defaultProps = {
  siteTitle: ``,
  isHomePage: false,
}

export default Header
