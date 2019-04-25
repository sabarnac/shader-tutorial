import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
// import GlslCodeHighlight from "../../components/glsl-code-highlight"

const NormalMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanced - Transparency"
      description="A look into the implementing transparency and certain quirks about it."
      keywords={[
        "shader",
        "advanced",
        "transparency",
        "transparent",
        "transluscent",
      ]}
    />
    <Content>
      <h2>Shader Advanced - Transparency</h2>
      <p />
    </Content>
    <PageChange previous="/advanced/color-banding-dithering/" />
  </Layout>
)

export default NormalMappingPage
