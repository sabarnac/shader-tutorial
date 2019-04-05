import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const ColorPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Color"
      description="A look into colors and the certain concepts and details of digital colors."
      keywords={["color", "shader", "intermediates"]}
    />
    <Content>
      <h2>Shader Intermediates - Color</h2>
      <p />
      <h3>Summary</h3>
    </Content>
    <PageChange next="/intermediates/texturing-branching/" />
  </Layout>
)

export default ColorPage
