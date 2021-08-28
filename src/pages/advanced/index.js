import { Link } from "gatsby"
import React from "react"

import Content from "../../components/content"
import Heading from "../../components/heading"
import Layout from "../../components/layout"
import Seo from "../../components/seo"

const IntermediatesIndexPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Advanceed - Content"
      description="Table of Contents for the Shader Advanced section."
      keywords={["shader", "advanced", "content", "toc"]}
    />
    <Content>
      <Heading type="h2">Table of Contents</Heading>
      <ul className="toc">
        <li>
          <Link to="/advanced/branching/">Shader Advanced - Branching</Link>
        </li>
        <li>
          <Link to="/advanced/color-banding-dithering/">
            Shader Advanced - Color Banding and Dithering
          </Link>
        </li>
        <li>
          <Link to="/advanced/transparency/">
            Shader Advanced - Transparency
          </Link>
        </li>
        <li>
          <Link to="/advanced/shadow-mapping/">
            Shader Advanced - Shadow Mapping
          </Link>
        </li>
        <li>More Coming Soon...</li>
      </ul>
    </Content>
  </Layout>
)

export default IntermediatesIndexPage
