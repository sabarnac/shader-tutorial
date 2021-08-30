import PropTypes from "prop-types"
import React from "react"

import linkImage from "../images/link.svg"

const slugify = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

const Heading = ({ type, children }) => {
  const HeaderComponent = type
  const slugLink = `${type[1]}-${slugify(children)}`

  return (
    <HeaderComponent id={slugLink}>
      {children}
      <a href={`#${slugLink}`} aria-labe={`Link to section "${children}"`}>
        <img alt="" role="presentation" src={linkImage} />
      </a>
    </HeaderComponent>
  )
}

Heading.propTypes = {
  type: PropTypes.oneOf(["h3", "h4", "h5", "h6"]).isRequired,
  children: PropTypes.string.isRequired,
}

export default Heading
