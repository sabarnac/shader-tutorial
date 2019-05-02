import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import TransparencyFirstExample from "../../components/advanced/transparency/first-example"
import TransparencySecondExample from "../../components/advanced/transparency/second-example"
import TransparencyThirdExample from "../../components/advanced/transparency/third-example"
import GenericCodeHighlight from "../../components/generic-code-highlight"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import { fragmentShaderSource } from "../../components/advanced/transparency/common-shaders"
import { openglCode } from "../../components/advanced/transparency/opengl-blend"
import { webglCode } from "../../components/advanced/transparency/webgl-blend"
import { directxCode } from "../../components/advanced/transparency/directx-blend"

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
        the 4th component representing opaqueness of the color.
      </p>
      <p>
        By setting the opaqueness value of the color of the fragments, you can
        use transparency. The GPU can be told how transluscent colors returned
        by the fragment shader should be blended, and based upon that get a
        final result.
      </p>
      <GlslCodeHighlight code={fragmentShaderSource.trim()} type="Fragment" />
      <p>
        In OpenGL, alpha color blending can be enabled by setting the following
        configuration:
      </p>
      <GenericCodeHighlight
        language="cpp"
        code={openglCode.trim()}
        type="OpenGL C/C++"
      />
      <p>
        In WebGL, alpha color blending can be enabled by setting the following
        configuration (and is what is used here):
      </p>
      <GenericCodeHighlight
        language="javascript"
        code={webglCode.trim()}
        type="WebGL JS"
      />
      <p>
        In DirectX, alpha color blending can be enabled by setting the following
        configuration (and is what is used here):
      </p>
      <GenericCodeHighlight
        language="cpp"
        code={directxCode.trim()}
        type="DirectX C/C++"
      />
      <TransparencyFirstExample />
      <TransparencySecondExample />
      <TransparencyThirdExample />
    </Content>
    <PageChange previous="/advanced/color-banding-dithering/" />
  </Layout>
)

export default NormalMappingPage
