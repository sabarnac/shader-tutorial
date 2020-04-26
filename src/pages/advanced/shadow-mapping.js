import { Link } from "gatsby"
import React from "react"

import ShadowMappingDirectionalLightMapExample from "../../components/advanced/shadow-mapping/directional-light/map-example"
import {
  directionalLightMapFragmentShaderSource,
  directionalLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/map-example-shaders"
import ShadowMappingDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-example"
import {
  directionalLightShadowFragmentShaderSource,
  directionalLightShadowVertexShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/shadow-example-shaders"
import ShadowMappingFixedDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-example"
import {
  directionalLightShadowFixedFragmentShaderSource,
} from "../../components/advanced/shadow-mapping/directional-light/shadow-fixed-example-shaders"
import * as ShadowMappingFixedModelDirectionalLightShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-model-fixed-example"
import * as ShadowMappingFixedModelDirectionalLightZoomedShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-model-fixed-zoomed-example"
import ShadowMappingDirectionalLightPcfShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-example"
import { directionalLightShadowPcfFragmentShaderSource } from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-example-shaders"
import ShadowMappingDirectionalLightPcfZoomedShadowExample from "../../components/advanced/shadow-mapping/directional-light/shadow-pcf-zoomed-example"
import ShadowMappingNoShadowExample from "../../components/advanced/shadow-mapping/no-shadow/shadow-example"
import ShadowMappingPointLightMapExample from "../../components/advanced/shadow-mapping/point-light/map-example"
import {
  pointLightMapFragmentShaderSource,
  pointLightMapVertexShaderSource,
} from "../../components/advanced/shadow-mapping/point-light/map-example-shaders"
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
      <p>
        In the <Link to="/intermediates/lighting/">lighting chapter</Link>,
        we've learnt how to color an object based on the light falling on it,
        and the various components that make up the lighting of an object.
      </p>
      <p>
        However, we're still missing an important component of lighting an
        object - the shadows that the create. While light can increase the
        visibility of an object, it also allows an object to cast shadows on
        other objects, reducing their visibility.
      </p>
      <p>
        Without shadows being considered when shading an object based on the
        sources of light in the world, the world will not look accurate.
      </p>
      <p>
        Let's take a look at an example where we only have lighting in the
        world, but no shadows being cast by objects.
      </p>
      <ShadowMappingNoShadowExample />
      <p></p>
      <h3>Directional light</h3>
      <ShadowMappingDirectionalLightMapExample />
      <GlslCodeHighlight
        code={directionalLightMapVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={directionalLightMapFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingDirectionalLightShadowExample />
      <GlslCodeHighlight
        code={directionalLightShadowVertexShaderSource}
        type="Vertex"
      />
      <GlslCodeHighlight
        code={directionalLightShadowFragmentShaderSource}
        type="Fragment"
      />
      <h4>Shadow acne</h4>
      <ShadowMappingFixedDirectionalLightShadowExample />
      <GlslCodeHighlight
        code={directionalLightShadowFixedFragmentShaderSource}
        type="Fragment"
      />
      <h4>Peter-panning</h4>
      <ShadowMappingFixedModelDirectionalLightShadowExample.default />
      <h4>Shadow aliasing</h4>
      <ShadowMappingFixedModelDirectionalLightZoomedShadowExample.default />
      <h4>Percentage-Closer Filtering (PCF)</h4>
      <ShadowMappingDirectionalLightPcfShadowExample />
      <GlslCodeHighlight
        code={directionalLightShadowPcfFragmentShaderSource}
        type="Fragment"
      />
      <ShadowMappingDirectionalLightPcfZoomedShadowExample />
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
      <GlslCodeHighlight code={pointLightMapVertexShaderSource} type="Vertex" />
      <GlslCodeHighlight
        code={pointLightMapFragmentShaderSource}
        type="Fragment"
      />
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
