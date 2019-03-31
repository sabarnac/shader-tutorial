/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React, { Fragment } from "react"
import PropTypes from "prop-types"
import MathJax from "react-mathjax2"

const Content = ({ children }) => (
  <MathJax.Context input="ascii">
    <Fragment>{children}</Fragment>
  </MathJax.Context>
)

Content.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Content
