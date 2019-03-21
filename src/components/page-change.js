import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"

const PageChange = ({ previous, next }) => (
  <div className="page-change">
    {previous ? (
      <div className="page-previous util text-left">
        <Link to={previous}>Previous Chapter</Link>
      </div>
    ) : null}
    {next ? (
      <div className="page-next util text-right">
        <Link to={next}>Next Chapter</Link>
      </div>
    ) : null}
  </div>
)

PageChange.propTypes = {
  previous: PropTypes.string,
  next: PropTypes.string,
}

PageChange.defaultProps = {
  previous: ``,
  next: ``,
}

export default PageChange
