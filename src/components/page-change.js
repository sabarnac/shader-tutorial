import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

const PageChange = ({ previous, next }) => (
  <div className="page-change">
    {previous ? (
      <div className="page-previous util text-left">
        <Link to={previous}>&#x2190; Previous Chapter</Link>
      </div>
    ) : null}
    {next ? (
      <div className="page-next util text-right">
        <Link to={next}>Next Chapter &#x2192;</Link>
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
