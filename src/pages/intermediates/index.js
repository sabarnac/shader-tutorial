import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import { Link } from "gatsby"

const IntermediatesIndexPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Content"
      description="Table of Contents for the Shader Intermediates section."
      keywords={["shader", "intermediates", "content", "toc"]}
    />
    <Content>
      <h2>Table of Contents</h2>
      <ul className="toc">
        <li>
          <Link to="/intermediates/color-2">
            Shader Intermediates - Color Part 2
          </Link>
        </li>
        <li>
          <Link to="/intermediates/image-generation">
            Shader Intermediates - Image Generation
          </Link>
        </li>
        <li>
          <Link to="/intermediates/texturing-branching">
            Shader Intermediates - Texturing And Branching
          </Link>
        </li>
        <li>
          <Link to="/intermediates/lighting-dithering">
            Shader Intermediates - Lighting and Dithering
          </Link>
        </li>
        <li>More Coming Soon...</li>
      </ul>
    </Content>
  </Layout>
)

export default IntermediatesIndexPage
