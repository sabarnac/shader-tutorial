import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Navigation = () => (
  <nav>
    <ul>
      <li className="skip-nav">
        <a href="#main">
          <small>Skip Navigation</small>
        </a>
      </li>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        Basics
        <ul>
          <li>
            <Link to="/basics/introduction/">Introduction</Link>
          </li>
          <li>
            <Link to="/basics/vertex-shader/">Vertex Shader Basics</Link>
          </li>
          <li>
            <Link to="/basics/fragment-shader">Fragment Shader Basics</Link>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
)

Navigation.propTypes = {
  siteTitle: PropTypes.string,
}

Navigation.defaultProps = {
  siteTitle: ``,
}

export default Navigation
