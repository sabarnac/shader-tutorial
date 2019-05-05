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

const TransparencyPage = ({ location: { pathname } }) => (
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
      <p>
        How you wish for colors to be blended is modifiable through those
        configuration settings. There are multiple ways that GPU can blend
        translucent colors, but only one method can be chosen at a time, and
        each produce different results.
      </p>
      <p>
        However, certain methods of color blending have strings attached to
        them.
      </p>
      <p>
        For example, the default color blending functions set in the above
        provided configurations require the objects being drawn to be provided
        in a particular order in order for the result to be accurate.
      </p>
      <p>
        Let's look at certain examples for why order matters for those color
        blending modes to make color transparency results appear correctly.
      </p>
      <h3>Example - Translucent Triangles</h3>
      <TransparencyFirstExample />
      <h4>How it works</h4>
      <GlslCodeHighlight code={fragmentShaderSource.trim()} type="Fragment" />
      <p>
        In this example, two squares are drawn, with the red square being
        partially overlayed on top of the green square. The GPU was sent the
        green square to draw first, and the red square second.
      </p>
      <p>
        The configurations for color blending tell the GPU to blend the colors
        of the squares in a specific way.
      </p>
      <p>
        First the green square is drawn on the image, so all the pixels covered
        by the square are colored green with an opacity of 0.4. When the red
        square is then drawn after, the GPU now has to determine how to mix the
        colors of the green and red squares.
      </p>
      <p>
        Using the default configurations we've provided as examples above, and
        use here, the GPU is told to blend colors in such a way that new colors
        being added to the image (red square) should dominate over existing ones
        (green square).
      </p>
      <TransparencySecondExample />
      <TransparencyThirdExample />
      <p>
        To learn how the blending functions exactly work, check out{" "}
        <a
          href="https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/glBlendFunc.xhtml"
          target="_blank"
          rel="noopener noreferrer"
        >
          this link for OpenGL/WebGL
        </a>{" "}
        and{" "}
        <a
          href="https://docs.microsoft.com/en-us/windows/desktop/api/d3d11/ne-d3d11-d3d11_blend"
          target="_blank"
          rel="noopener noreferrer"
        >
          this link for DirectX
        </a>
        .
      </p>
    </Content>
    <PageChange previous="/advanced/color-banding-dithering/" />
  </Layout>
)

export default TransparencyPage
