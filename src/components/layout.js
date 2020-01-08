/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */
import "./layout.css";

import { graphql, StaticQuery } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import Footer from "./footer";
import Header from "./header";
import Notice from "./notice";

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={({
      site: {
        siteMetadata: { title },
      },
    }) => (
      <div className="container">
        <div className="row wrapper">
          <Header siteTitle={title} />
          <div className="column column-75 content">
            <Notice />
            <main className="row main" id="main">
              <div className="column">{children}</div>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
