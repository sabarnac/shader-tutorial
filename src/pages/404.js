import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gpu`, "shader", "tutorial"]} />
    <h2>Page Not Found</h2>
    <p>
      The page you requested for doesn't seem to exist.
    </p>
  </Layout>
)

export default IndexPage
