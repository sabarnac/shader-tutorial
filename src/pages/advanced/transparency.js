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
      <GlslCodeHighlight code={fragmentShaderSource.trim()} type="Fragment" />
      <p>
        As seen in this fragment shader code, the color of the fragment is set
        using whatever color value is received, and the alpha value of the color
        is set to 0.5. This means that the fragment is 50% opaque (or 50%
        transparent).
      </p>
      <p>
        However, just setting the alpha value isn't enough. You will have to
        explicitly tell the graphics API you use to enable color/alpha blending.
      </p>
      <p>
        Color blending is an operation that the GPU can perform where it blends
        the colors of multiple fragments into a final output color.
      </p>
      <p>
        Alpha blending is a type of color blending where the colors from
        different fragments are blended together depending on the alpha
        component of each color.
      </p>
      <p>
        GPUs can blend colors in multiple ways, each using their own specific
        formula for how colors are mixed. However, while some can be used with
        no issues, there are certain blending algorithms that have caveats
        attached to them.
      </p>
      <p>
        For the examples we'll be showing, the WebGL color blending
        configuration is:
      </p>
      <GenericCodeHighlight
        code={webglCode.trim()}
        type="WebGL"
        language="javascript"
      />
      <p>
        The equivalent OpenGL and DirectX color blending configurations are:
      </p>
      <GenericCodeHighlight
        code={openglCode.trim()}
        type="OpenGL"
        language="cpp"
      />
      <GenericCodeHighlight
        code={directxCode.trim()}
        type="DirectX"
        language="cpp"
      />
      <p>
        While this configuration is recommended for proper color blending, it
        has a requirement that can severly impact performance.
      </p>
      <p>
        The{" "}
        <a
          href="https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-10-transparency/"
          target="_blank"
          rel="noopener noreferrer"
        >
          transparency chapter
        </a>{" "}
        of{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenGL Tutorial
        </a>{" "}
        provides an explanation into the issues that can be faced when drawing
        transparent objects using the configuration we've shown here. We'll also
        show an example here to demonstrate the limitations of our chosen color
        blending algorithm.
      </p>
      <h3>Example - Red Square and Green Square</h3>
      <TransparencyFirstExample />
      <p>
        Here, we're drawing two squares, one of red, and one of green. In this
        image, the red square is placed in front of the green square, but the
        green square is passed to the GPU first for rendering.
      </p>
      <p>
        When the GPU renders the two squares, it first draws the green square
        onto the image. Once the green square is drawn, it begins drawing the
        red square on top.
      </p>
      <p>
        When the red square is being drawn, the parts of the red square that
        overlay on top of the green square require the colors of both to be
        blended together.
      </p>
      <p>
        The blending operation configuration that is being used, and was shown
        previously, tells the GPU to blend the colors in such a way that the new
        fragment color being added to the image (red) should dominate over the
        color already present in the image (green).
      </p>
      <p>
        Since the red square is drawn after the green square, its color will
        dominate over the green, making the color of the overlay skew more
        towards red. This is in line with our expectations, since the red square
        is also in front of the green square, depth-wise.
      </p>
      <p>
        However, what if we wish to draw the image with the green square in
        front. If we swap the vertex positions of the two squares, we get the
        following result.
      </p>
      <TransparencySecondExample />
      <p>
        This result is completely inaccurate. The color of the green square
        should be dominating over the red, but it is in fact the same as the
        first example, giving the impression that the red square is still in
        front.
      </p>
      <p>
        Why is this the case? Because the blending operation has a major
        requirement that we have failed to satisfy with the second example.
      </p>
      <p>
        In the first image, the green square was drawn onto the image first, and
        followed by the red square. The chosen blending operation operates in
        such a way that new objects being drawn will have their colors dominate
        over already existing colors.
      </p>
      <p>
        This issue is that even though we have moved the vertex positions of the
        green square to be in front of the red square, we are still drawing the
        green square first onto the image.
      </p>
      <p>
        This means that since the red square is being drawn second, its colors
        will dominate over the green due to the blending operation selected.
        This results in the incorrect result we see above.
      </p>
      <p>
        In order to fix this result, the order in which the squares are passed
        to the GPU should be sorted by the depth of the squares. Squares further
        away from the camera should be drawn before squares closer to the
        camera.
      </p>
      <TransparencyThirdExample />
      <p>
        Since the red square is now behind, by passing it first to the GPU to be
        drawn, the error in our result is now fixed. The color of the green
        square now dominates over the red, as it should have been.
      </p>
      <p>
        In our example, the issue was very simple to fix since we were only
        drawing two objects that were separated and could be sorted easily.
      </p>
      <p>
        However, in cases of objects with multiple polygons that connect or
        cross-over each other, each polygon needs to be sorted in the correct
        order.
      </p>
      <p>
        This issue can further be aggravated by a moving camera. Since all
        transparent polygons have to be sorted by depth w.r.t. the camera, a
        moving camera requires multiplying each polygon by the model-view matrix
        first before sorting.
      </p>
      <p>
        As we can see, the scope of transparency becomes exponentially more
        difficulty with increasing complexity. This is why transparent objects
        aren't commonly found in games, where real-time rendering is crucial for
        a good experience.
      </p>
      <p>
        The{" "}
        <a
          href="https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-10-transparency/"
          target="_blank"
          rel="noopener noreferrer"
        >
          transparency chapter
        </a>{" "}
        of{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenGL Tutorial
        </a>{" "}
        does provide possible steps that can be taken to reduce the performance
        impact, and also provides links on how order-independent transparency
        techniques, although they are not simple to implement.
      </p>
      <p>
        There are also other possible configuration options to use that don't
        have performance degrading requirements, but each blending algorithm
        produces a different output, so we recommend experimenting to see which
        configuration works best for your case.
      </p>
    </Content>
    <PageChange previous="/advanced/color-banding-dithering/" />
  </Layout>
)

export default TransparencyPage
