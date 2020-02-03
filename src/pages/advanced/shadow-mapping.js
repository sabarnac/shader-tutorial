import React from "react";

import ShadowMappingAreaLightMapExample from "../../components/advanced/shadow-mapping/area-light/map-example";
import {
  areaLightMapFragmentShaderSource,
  areaLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/area-light/map-example-shaders";
import ShadowMappingAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-example";
import {
  areaLightShadowFragmentShaderSource,
  areaLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/area-light/shadow-example-shaders";
import ShadowMappingFixedAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-fixed-example";
import { areaLightShadowFixedFragmentShaderSource } from "../../components/advanced/shadow-mapping/area-light/shadow-fixed-example-shaders";
import ShadowMappingFixedModelAreaLightShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-model-fixed-example";
import * as ShadowMappingFixedModelAreaLightZoomedShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-model-fixed-zoomed-example";
import ShadowMappingAreaLightPcfShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-pcf-example";
import { areaLightShadowPcfFragmentShaderSource } from "../../components/advanced/shadow-mapping/area-light/shadow-pcf-example-shaders";
import ShadowMappingAreaLightPcfZoomedShadowExample from "../../components/advanced/shadow-mapping/area-light/shadow-pcf-zoomed-example";
import ShadowMappingSpotLightMapExample from "../../components/advanced/shadow-mapping/spot-light/map-example";
import {
  spotLightMapFragmentShaderSource,
  spotLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/spot-light/map-example-shaders";
import ShadowMappingSpotLightShadowExample from "../../components/advanced/shadow-mapping/spot-light/shadow-example";
import {
  spotLightShadowFragmentShaderSource,
  spotLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/spot-light/shadow-example-shaders";
import Content from "../../components/content";
import GlslCodeHighlight from "../../components/glsl-code-highlight";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import SEO from "../../components/seo";

const ShadowMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Advanced - Shadow Mapping"
      description="A look into what color banding is and how to mitigate it using dithering."
      keywords={["shader", "advanced", "banding", "dithering"]}
    />
    <Content>
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
      <ShadowMappingFixedAreaLightShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowFixedFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingFixedModelAreaLightShadowExample />
      <ShadowMappingFixedModelAreaLightZoomedShadowExample.default />
      <ShadowMappingAreaLightPcfShadowExample />
      <GlslCodeHighlight
        code={areaLightShadowPcfFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingAreaLightPcfZoomedShadowExample />
      <hr />
      <ShadowMappingSpotLightMapExample />
      <GlslCodeHighlight code={spotLightMapVertexShaderSource} type="Vertex" />
      <GlslCodeHighlight
        code={spotLightMapFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingSpotLightShadowExample />
      <GlslCodeHighlight
        code={spotLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={spotLightShadowFragmentShaderSource}
        type="Fragment"
      />
    </Content>
    <PageChange previous="/advanced/transparency/" />
  </Layout>
)

export default ShadowMappingPage
