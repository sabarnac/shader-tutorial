import React from "react"

import ShadowMappingAreaLightMapExample from "../../components/advanced/shadow-mapping/area-light/map-example"
import {
  areaLightMapFragmentShaderSource,
  areaLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/area-light/map-example-shaders"
import ShadowMappingAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-example"
import {
  areaLightShadowFragmentShaderSource,
  areaLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/area-light/shadow-example-shaders"
import ShadowMappingFixedAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-fixed-example"
import { areaLightShadowFixedFragmentShaderSource } from "../../components/advanced/shadow-mapping/area-light/shadow-fixed-example-shaders"
import ShadowMappingFixedModelAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-model-fixed-example"
import * as ShadowMappingFixedModelAreaLightZoomedShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-model-fixed-zoomed-example"
import ShadowMappingAreaLightPcfShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-pcf-example"
import { areaLightShadowPcfFragmentShaderSource } from "../../components/advanced/shadow-mapping/area-light/shadow-pcf-example-shaders"
import ShadowMappingAreaLightPcfZoomedShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-pcf-zoomed-example"
import ShadowMappingNoShadowExample from "../../components/advanced/shadow-mapping/no-shadow/shadow-example"
import ShadowMappingPointLightMapExample from "../../components/advanced/shadow-mapping/point-light/map-example"
import ShadowMappingPointLightShadowExample from "../../components/advanced/shadow-mapping/point-light/shadow-example"
import {
  pointLightShadowFragmentShaderSource,
  pointLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/point-light/shadow-example-shaders"
import ShadowMappingSpotLightMapExample from "../../components/advanced/shadow-mapping/spot-light/map-example"
import ShadowMappingSpotLightShadowExample from "../../components/advanced/shadow-mapping/spot-light/shadow-example"
import {
  spotLightShadowFragmentShaderSource,
  spotLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/spot-light/shadow-example-shaders"
import Content from "../../components/content"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import SEO from "../../components/seo"

const ShadowMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanced - Shadow Mapping"
      description="A look into the how shadow maps can be generated and used to add dynamic shadows produced by objects in a scene."
      keywords={[
        "shadow",
        "mapping",
        "texturing",
        "shader",
        "spot light",
        "area light",
        "point light",
        "advanced",
      ]}
    />
    <Content>
      <h2>Shader Advanced - Shadow Mapping</h2>
      <ShadowMappingNoShadowExample />
      <h3>Area light</h3>
      <ShadowMappingAreaLightMapExample />
      <GlslCodeHighlight code={areaLightMapVertexShaderSource} type="Vertex" />
      <GlslCodeHighlight
        code={areaLightMapFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingAreaLightShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={areaLightShadowFragmentShaderSource}
        type="Fragment"
      />
      <h4>Shadow acne</h4>
      <ShadowMappingFixedAreaLightShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowFixedFragmentShaderSource}
        type="Fragment"
      />
      <h4>Peter-panning</h4>
      <ShadowMappingFixedModelAreaLightShadowExample />
      <h4>Shadow aliasing</h4>
      <ShadowMappingFixedModelAreaLightZoomedShadowExample.default />
      <h4>Percentage-Closer Filtering (PCF)</h4>
      <ShadowMappingAreaLightPcfShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowPcfFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingAreaLightPcfZoomedShadowExample />
      <h3>Spot light</h3>
      <ShadowMappingSpotLightMapExample />
      <ShadowMappingSpotLightShadowExample />
      <GlslCodeHighlight
        code={spotLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={spotLightShadowFragmentShaderSource}
        type="Fragment"
      />
      <h3>Point light</h3>
      <ShadowMappingPointLightMapExample />
      <ShadowMappingPointLightShadowExample />
      <GlslCodeHighlight
        code={pointLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={pointLightShadowFragmentShaderSource}
        type="Fragment"
      />
    </Content>
    <PageChange previous="/advanced/transparency/" />
  </Layout>
)

export default ShadowMappingPage
