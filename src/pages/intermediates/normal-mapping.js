import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const NormalMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Normal Mapping"
      description="A look into the how normal map textures are used to add lighting detail to objects."
      keywords={["normal", "mapping", "texturing", "shader", "intermediates"]}
    />
    <Content>
      <h2>Shader Intermediates - Normal Mapping</h2>
      <h3>Summary</h3>
    </Content>
    <PageChange previous="/intermediates/lighting/" />
  </Layout>
)

export default NormalMappingPage
