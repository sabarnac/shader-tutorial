import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import { Link } from "gatsby"

const IntermediatesIndexPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanceed - Content"
      description="Table of Contents for the Shader Advanced section."
      keywords={["shader", "advanced", "content", "toc"]}
    />
    <Content>
      <h2>Table of Contents</h2>
      <ul className="toc">
        <li>
          <Link to="/advanced/branching">Shader Advanced - Branching</Link>
        </li>
        <li>
          <Link to="/advanced/color-banding-dithering">
            Shader Advanced - Color Banding and Dithering
          </Link>
        </li>
        <li>More Coming Soon...</li>
      </ul>
    </Content>
  </Layout>
)

export default IntermediatesIndexPage
