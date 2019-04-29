import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import TransparencyFirstExample from "../../components/advanced/transparency/first-example"
import TransparencySecondExample from "../../components/advanced/transparency/second-example"
import TransparencyThirdExample from "../../components/advanced/transparency/third-example"
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
      <p>
        Implementing support for transparency in shader code is not a complex
        task. The fragment shader returns a color vector of 4 components, with
        the 4th component representing transparency or, more accurately,
        opaqueness.
      </p>
      <p>
        By setting the opaqueness value of the color of the fragments, you can
        enable transparency. The GPU can be told how transluscent colors
        returned by the fragment shader should be blended, and based upon that
        get a final result.
      </p>
      <TransparencyFirstExample />
      <TransparencySecondExample />
      <TransparencyThirdExample />
    </Content>
    <PageChange previous="/advanced/color-banding-dithering/" />
  </Layout>
)

export default NormalMappingPage
