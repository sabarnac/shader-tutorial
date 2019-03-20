import PropTypes from "prop-types"
import React from "react"
import twitter from "../images/twitter.png"

const Footer = () => (
  <div className="row">
    <footer className="column">
      <div className="author">By Sabarna Chakravarty</div>
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

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
