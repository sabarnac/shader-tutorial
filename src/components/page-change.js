import PropTypes from "prop-types"
import React from "react"
import { Link } from "gatsby"

const PageChange = ({ previous, next }) => (
  <div className="row page-change">
    <div className="column column-50 util text-left">
      {previous ? <Link to={previous}>Previous Chapter</Link> : null}
    </div>
    <div className="column column-50 util text-right">
      {next ? <Link to={next}>Next Chapter</Link> : null}
    </div>
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
