import React from "react"

import Content from "../../components/content"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const ColorBandingDitheringPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Advanced - Cube Maps"
      description="A look into what cube maps are and some of the ways they can be used."
      keywords={[
        "shader",
        "advanced",
        "cube",
        "maps",
        "skybox",
        "reflections",
        "refractions",
        "global",
        "illumination",
        "gi",
      ]}
    />
    <Content>
      <h1>Shader Advanced - Cube Maps</h1>
      <p>Page is currently not written yet. Check back later!</p>
    </Content>
    <PageChange previous="/advanced/shadow-mapping/" />
  </Layout>
)

export default ColorBandingDitheringPage
