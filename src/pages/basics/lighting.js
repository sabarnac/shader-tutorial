import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import LightingFirstExample from "../../components/basics/lighting/first-example"
import LightingSecondExample from "../../components/basics/lighting/second-example"
import LightingThirdExample from "../../components/basics/lighting/third-example"
import LightingFourthExample from "../../components/basics/lighting/fourth-example"

const ShaderTexturingPage = () => {
  return (
    <Layout>
      <SEO
        title="Shader Basics - Lighting"
        keywords={[
          "lighting",
          "shader",
          "basics",
          "diffuse",
          "specular",
          "ambient",
        ]}
      />
      <h2>Shader Basics - Lighting</h2>
      <LightingFirstExample />
      <LightingSecondExample />
      <LightingThirdExample />
      <LightingFourthExample />
      <PageChange previous="/basics/fragment-shader/" />
    </Layout>
  )
}

export default ShaderTexturingPage
