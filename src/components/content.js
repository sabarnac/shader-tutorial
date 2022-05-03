/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import PropTypes from "prop-types";
import React from "react";

const Content = ({ children }) => <>{children}</>;

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Content;
