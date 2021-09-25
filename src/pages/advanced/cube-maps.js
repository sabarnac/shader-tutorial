import React from "react"

import CubeMapTexture from "../../components/advanced/cube-maps/cube-map-texture"
import CubeMapTextureExample from "../../components/advanced/cube-maps/cube-map-texture-example"
import {
  cubeMapTextureFragmentShaderSource,
  cubeMapTextureVertexShaderSource,
} from "../../components/advanced/cube-maps/cube-map-texture-example-shaders"
import ReflectionExample from "../../components/advanced/cube-maps/reflection-example"
import ReflectionRefractionMapExample from "../../components/advanced/cube-maps/reflection-refraction-map-example"
import SimpleRefractionExample from "../../components/advanced/cube-maps/simple-refraction-example"
import SkyboxExample from "../../components/advanced/cube-maps/skybox-example"
import { skyboxFragmentShaderSource, skyboxVertexShaderSource } from "../../components/advanced/cube-maps/skybox-example-shaders"
import SkyboxMapTexture from "../../components/advanced/cube-maps/skybox-texture"
import Content from "../../components/content"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import Heading from "../../components/heading"
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
      <p>
        This chapter is currently being written. But you can view the various
        sections of examples that will be displayed as part of this chapter.
      </p>
    </Content>
    <Heading type="h2">Cube map on a cube</Heading>
    <CubeMapTexture />
    <CubeMapTextureExample />
    <GlslCodeHighlight
      code={cubeMapTextureVertexShaderSource}
      type="Cube Map Vertex"
    />
    <GlslCodeHighlight
      code={cubeMapTextureFragmentShaderSource}
      type="Cube Map Fragment"
    />
    <Heading type="h2">Skybox</Heading>
    <SkyboxMapTexture />
    <SkyboxExample />
    <GlslCodeHighlight code={skyboxVertexShaderSource} type="Skybox Vertex" />
    <GlslCodeHighlight
      code={skyboxFragmentShaderSource}
      type="Skybox Fragment"
    />
    <ReflectionRefractionMapExample />
    <ReflectionExample />
    <SimpleRefractionExample />
    <PageChange previous="/advanced/shadow-mapping/" />
  </Layout>
)

export default ColorBandingDitheringPage
