/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import { graphql, useStaticQuery, withPrefix } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Helmet from "react-helmet"

const Seo = ({
  description = undefined,
  lang = "en",
  meta = [],
  keywords,
  title,
  pathname,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            baseUrl
            description
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
    >
      <title>
        {title} | {site.siteMetadata.title}
      </title>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <meta name="description" content={metaDescription} />
      <meta
        property="og:title"
        content={`${title} | ${site.siteMetadata.title}`}
      />
      <meta
        property="og:url"
        content={`${site.siteMetadata.baseUrl}${pathname}`}
      />
      <meta property="og:description" content={metaDescription} />
      <meta
        property="og:image"
        content={`${site.siteMetadata.baseUrl}${withPrefix("/icon.png")}`}
      />
      <meta property="og:image:height" content="256" />
      <meta property="og:image:width" content="256" />
      <meta property="og:image:alt" content="GPU Shader Tutorial Icon" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:title"
        content={`${title} | ${site.siteMetadata.title}`}
      />
      <meta name="twitter:description" content={metaDescription} />
      <meta
        name="twitter:image"
        content={`${site.siteMetadata.baseUrl}${withPrefix("/icon.png")}`}
      />
      <meta name="twitter:image:alt" content="GPU Shader Tutorial Icon" />
      {keywords.length ? (
        <meta name="keywords" content={keywords.join(`, `)} />
      ) : null}
      {meta.map((props) => (
        <meta {...props} />
      ))}
    </Helmet>
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  keywords: [],
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
}

export default Seo
