import React from "react"

import ShadowMappingMapExample from "../../components/advanced/shadow-mapping/map-example"
import {
  mapVertexShaderSource,
  mapFragmentShaderSource,
} from "../../components/advanced/shadow-mapping/map-example-shaders"
import {
  shadowVertexShaderSource,
  shadowFragmentShaderSource,
} from "../../components/advanced/shadow-mapping/shadow-example-shaders"
import Content from "../../components/content"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import SEO from "../../components/seo"
import ShadowMappingShadowExample from "../../components/advanced/shadow-mapping/shadow-example"

const ShadowMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanced - Shadow Mapping"
      description="A look into what color banding is and how to mitigate it using dithering."
      keywords={["shader", "advanced", "banding", "dithering"]}
    />
    <Content>
      <ShadowMappingMapExample />
      <GlslCodeHighlight code={mapVertexShaderSource} type="Vertex" />
      <GlslCodeHighlight code={mapFragmentShaderSource} type="Fragment" />
      <ShadowMappingShadowExample />
      <GlslCodeHighlight code={shadowVertexShaderSource} type="Vertex" />
      <GlslCodeHighlight code={shadowFragmentShaderSource} type="Fragment" />
    </Content>
    <PageChange previous="/advanced/transparency/" />
  </Layout>
)

export default ShadowMappingPage
