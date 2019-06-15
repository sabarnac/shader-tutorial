import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import NormalMappingFirstExample from "../../components/intermediates/normal-mapping/first-example"
import NormalMappingSecondExample from "../../components/intermediates/normal-mapping/second-example"
import NormalMappingThirdExample from "../../components/intermediates/normal-mapping/third-example"
import texture from "../../images/intermediates/texture-2.png"
import normalTexture from "../../images/intermediates/normal.png"

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
      <p className="util text-center">
        <img
          alt="Stone Wall - Color Map"
          style={{ width: "65%" }}
          src={texture}
        />
      </p>
      <NormalMappingFirstExample />
      <p className="util text-center">
        <img
          alt="Stone Wall - Normal Map"
          style={{ width: "65%" }}
          src={normalTexture}
        />
      </p>
      <NormalMappingSecondExample />
      <NormalMappingThirdExample />
      <h3>Summary</h3>
    </Content>
    <PageChange previous="/intermediates/lighting/" />
  </Layout>
)

export default NormalMappingPage
