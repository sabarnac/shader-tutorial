import React from "react"

import { fragmentShaderSource } from "../../components/advanced/transparency/common-shaders"
import { directxCode } from "../../components/advanced/transparency/directx-blend"
import TransparencyFirstExample from "../../components/advanced/transparency/first-example"
import { openglCode } from "../../components/advanced/transparency/opengl-blend"
import TransparencySecondExample from "../../components/advanced/transparency/second-example"
import TransparencyThirdExample from "../../components/advanced/transparency/third-example"
import { webglCode } from "../../components/advanced/transparency/webgl-blend"
import Content from "../../components/content"
import GenericCodeHighlight from "../../components/generic-code-highlight"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import Heading from "../../components/heading"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const TransparencyPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
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
      <h1>Shader Advanced - Transparency</h1>
      <p>
        Implementing support for transparency in shader code is not a complex
        task. The fragment shader returns a color vector of 4 components, with
        the 4th component representing opaqueness of the color.
      </p>
      <p>
        By setting the opaqueness value of the color of the fragments, you can
        make fragments transparent. The GPU can be told how transluscent colors
        returned by the fragment shader should be blended, and based upon that
        get a final result.
      </p>
      <GlslCodeHighlight code={fragmentShaderSource.trim()} type="Fragment" />
      <p>
        As seen in this fragment shader code, the color of the fragment is set
        using whatever color value is received, and the alpha value of the color
        is set to 0.5. This means that the fragment is 50% opaque.
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
        language="js"
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
        While this configuration is recommended for blending transparent colors,
        it has a requirement that can severly impact performance. Let's look at
        an example to see the limitations of the chosen color blending
        algorithm.
      </p>
      <Heading type="h2">Example - Red Square and Green Square</Heading>
      <TransparencyFirstExample />
      <p>
        Here, we're drawing two squares, one in red, and one in green. In this
        image, the red square is placed in front of the green square, but the
        green square is passed to the GPU first for rendering.
      </p>
      <p>
        The GPU first draws the green square onto the image. Once the green
        square is drawn, it begins drawing the red square on top. When the red
        square is being drawn, the parts of the red square that overlay on top
        of the green square require the colors of both to be blended together.
      </p>
      <p>
        The blending configuration that is being used, and was shown previously,
        tells the GPU to blend the colors in such a way that the new fragment
        color being added to the image should dominate over the color already
        present in the image.
      </p>
      <p>
        Since the red square is drawn after the green square, its color will
        dominate over the green, making the color of the overlay section skew
        more towards red.
      </p>
      <p>
        This is in line with our expectations, since the red square is also in
        front of the green square depth-wise, which should result in the common
        area looking red with a green hue.
      </p>
      <p>
        However, what if we wish to draw the image with the green square in
        front? If we swap the vertex positions of the two squares, we get the
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
        over already existing colors in the image.
      </p>
      <p>
        This means that the algorithm operates under the assumption that an
        object already drawn onto the image is present behind the object that is
        being drawn next.
      </p>
      <p>
        Since the red square is being drawn second, its colors will dominate
        over the green due to the blending operation selected - the operation
        assumes that the red square is actually in front of the green square due
        to it being drawn second.
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
        drawing two squares that are completely separated and can be sorted with
        ease.
      </p>
      <p>
        However, in cases of objects with multiple polygons that connect or
        cross-over each other, each polygon needs to be sorted in the correct
        order.
      </p>
      <p>
        This issue can further be aggravated by a moving camera. Since all
        transparent polygons have to be sorted by depth w.r.t. the camera, a
        moving camera requires sorting each polygon in model-view-space, which
        is expensive.
      </p>
      <p>
        As we can see, the scope of transparency becomes exponentially more
        difficulty with increasing complexity. This is why transparent objects
        aren't abundantly found in video games, where real-time rendering is
        crucial for a good experience.
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
        impact, and also provides links on order-independent transparency
        techniques that can achieve the same effect, although they are not
        simple to implement.
      </p>
      <p>
        There are also other possible configuration options to use that don't
        have such performance degrading requirements, but each blending
        algorithm produces a different output, so we recommend experimenting to
        see which configuration works best for your use-case.
      </p>
      <Heading type="h2">Summary</Heading>
      <ul>
        <li>
          Transparency on the shader side is simple to add, through the use of
          the 4th component of the color value, which represents the alpha (or
          opacity) of the color.
        </li>
        <li>
          The GPU needs to be told how colors should be blended together to form
          a final color. This is required for color transparency, since
          translucent colors need to be blended to form a resultant.
        </li>
        <li>
          While graphics APIs have multiple functions to blend colors in various
          ways, some of these have caveats that can cause significant
          performance degregation if an accurate result is required.
        </li>
        <li>
          To learn more about how transparency in various graphics APIs, check
          out the links below:
          <ul>
            <li>
              <a
                href="https://www.opengl-tutorial.org/intermediate-tutorials/tutorial-10-transparency/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenGL/WebGL
              </a>
              .
            </li>
            <li>
              <a
                href="http://www.directxtutorial.com/Lesson.aspx?lessonid=9-4-10"
                target="_blank"
                rel="noopener noreferrer"
              >
                DirectX
              </a>
              .
            </li>
          </ul>
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/advanced/color-banding-dithering/"
      next="/advanced/shadow-mapping/"
    />
  </Layout>
)

export default TransparencyPage
