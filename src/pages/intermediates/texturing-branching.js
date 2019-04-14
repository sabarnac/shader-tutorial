import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import TexturingBranchingFirstExample from "../../components/intermediates/texturing-branching/first-example"
import TexturingBranchingSecondExample from "../../components/intermediates/texturing-branching/second-example"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "../../components/intermediates/texturing-branching/first-example-shaders"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import { Link } from "gatsby"
import { secondFragmentShaderSource } from "../../components/intermediates/texturing-branching/second-example-shaders"

const TexturingBranchingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Textures And Branching"
      description="A look into the how textures are used to color objects in shaders."
      keywords={[
        "texture",
        "branching",
        "branch",
        "texturing",
        "uv",
        "shader",
        "intermediates",
      ]}
    />
    <Content>
      <h2>Shader Intermediates - Textures And Branching</h2>
      <p>
        So far we've passed direct color information of vertices to the fragment
        shader, which was then interpolated for each fragment and then set as
        the pixel color.
      </p>
      <p>
        As learnt in the{" "}
        <Link to="/basics/fragment-shader">previous chapter</Link>, color
        information can only be mapped to the vertices of an object, with color
        values of parts of the object between the vertices being interpolated.
      </p>
      <p>
        However, now we wish to color an object using an image. This requires
        the image to be stored as a texture on the GPU and the texture being
        overlayed onto the object correctly.
      </p>
      <p>Let's first learn about how a texture is overlayed onto an object.</p>
      <h3>UV Mapping</h3>
      <p>
        The process of overlaying a texture (2D plane) onto an object (3D
        system) is known as UV mapping. Just as how the axes of a 3D system is
        denoted as X, Y, and Z, the axes of a texture are denoted as U, and V
        (because the other three are already taken).
      </p>
      <p>
        By mapping a vertex of an object to a particular texture coordinate
        (giving the vertex a "UV coordinate"), a texture can be overlayed onto
        an object by pinning points of the texture that to their mapped
        vertices.
      </p>
      <h3>An example - A cube</h3>
      <TexturingBranchingFirstExample />
      <h4>How it works</h4>
      <p>
        GPUs follow an operation similar to UV mapping. They can accept a
        texture, and the vertices, along with their mapped UV coordinates, are
        provided.
      </p>
      <p>
        These coordinates are then passed through the vertex shader to the
        fragment shader, with the GPU interpolating the coordinates as need for
        each fragment.
      </p>
      <p>
        The fragment shader can then take these coordinates and pull the
        required pixel color value from the texture and set that as the final
        color of the image.
      </p>
      <GlslCodeHighlight
        code={firstVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={firstFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        In the vertex shader, the UV coordinates of the vertex is provided
        through the <code>vertexUv</code> attribute, which is then passed to the
        fragment shader <code>uv</code>, allowing the GPU to interpolate the UV
        coordinates for each fragment.
      </p>
      <p>
        In the fragment shader, the pixel color value of the texture at the
        given UV coordinates is retrieved through the 2D sampler{" "}
        <code>textureSampler</code>, which is then the final color assigned to
        the fragment.
      </p>
      <p>
        <code>textureSampler</code> is defined as <code>sampler2D</code> because
        the texture is a 2D image which is being sampled for color values at
        specific coordinates.
      </p>
      <h3>Another example - A (mostly) pulsing cube</h3>
      <TexturingBranchingSecondExample />
      <h4>How it works</h4>
      <p>
        Similar to how the pulsing triangle was made in the last example of the{" "}
        <Link to="/basics/fragment-shader">previous chapter</Link>, a{" "}
        <code>colorShift</code> value is subtracted from the color values
        retrieved from the texture (except for alpha), and then set as the final
        color of the fragment.
      </p>
      <p>
        One unique change is the white edges of the cube, which do not pulse and
        always stay constant.
      </p>
      <GlslCodeHighlight
        code={secondFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        In the code, a new function <code>getColorShiftFactor</code> accepts an
        RGB <code>color</code> variable, and using a formula, decides whether
        the color shift should be factored by 0 or 1.
      </p>
      <p>
        If 0 is returned, the final color shift value is nullified, not
        affecting the value of the texture color when it is set to the final
        fragment color value.
      </p>
      <p>
        If 1 is returned, the final color shift value is in full effect,
        affecting the texture color value as it normally would when setting the
        final fragment color value.
      </p>
      <p>The color shift factor formula works as follows:</p>
      <ul>
        <li>
          Combine the values of the red, green, and blue components of the
          texture color.
        </li>
        <li>Subtract this value from 3.0</li>
        <li>
          Ceil the difference at or above it (ex: it would change the number 2.1
          to 3).
        </li>
        <li>Clamp the resultant value so that it is within the range 0 - 1</li>
      </ul>
      <p>
        When a color is white, it's RGB components would all be at their highest
        value, which is 1. As a result, their sum would be 3. When this sum is
        subtracted from the value 3, any color value that is not white would
        result in a difference greater than 0.
      </p>
      <p>
        This will result in the ceiling value of any color that is not white be
        least 1 or higher, which is then clamped to 1.
      </p>
      <p>
        As a result, this equation ensures that all texture color values that
        are white have a color shift factor of 0, and the rest have a value of
        1.
      </p>
      <h3>Branching in shaders</h3>
      <p>
        A question that might come up is why not just use conditions to check if
        a color is white, and depending on the result, just return 0 or 1
        accordingly. The reason this is not done is because using branches (if
        conditions) is generally discouraged in shader code.
      </p>
      <p>
        The reasons for this is when a GPU hits a branch, the common behavior of
        GPUs is to run the code for all resulting scenarios, and then discard
        the results of the scenario that wasn't the selected one. This can
        significantly impact performance.
      </p>
      <p>
        Since the GPU relies on many parallel calculations being executable at
        once, having branches forces the GPU to waste time running multiple
        scenarios for the same fragment, instead of using those resources
        performing calculations for other fragments.
      </p>
      <p>
        However, using branches is not always discouraged. Some examples are:
      </p>
      <ul>
        <li>
          If you're branching based on the value of a uniform, since such a
          branch will always have the same result irrespective of which vertex
          or fragment you're operating on, this shouldn't lead to a performance
          bottleneck.
        </li>
        <li>
          Similar to the last point, if you're branches are consistent (always
          have the same outcome), there shouldn't be a performance bottleneck.
        </li>
        <li>
          If branches are value selection branches (
          <code>result = simpleCondition ? value1 : value2</code>) or similar,
          then GPUs can optimize them to not perform any branching.
        </li>
        <li>
          If you're branches are consistent over a group of pixels (ex: 8x8
          group), there should not be a major performance penalty
          <strong>*</strong>.
        </li>
        <li>
          For certain cases of branching, they may be optimized to not have a
          big impact on performance<strong>*</strong>.
        </li>
      </ul>
      <p>
        <strong>
          * - This is GPU and driver dependent, so such code would require
          extensive testing to verify.
        </strong>
      </p>
      <p>
        <em>
          Note: <code>clamp</code> (and some other built-in functions) don't
          have a performance impact although they are expected to cause
          branching, because either OpenGL optimizes such functions, or the GPU
          has special hardware or driver code optimizations to ensure that such
          code would not have any performance impact. Some of such functions
          (such as <code>clamp</code>) have been supported by GPUs before they
          added support for branching in shader code.
        </em>
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          Textures are mapped onto objects through a process called UV mapping.
        </li>
        <li>
          GPUs perform a similar process by receiving UV texture coordinates of
          vertices, and interpolating them for each fragment, which is then used
          to select the correct pixel color from the texture and use it.
        </li>
        <li>
          Branching is generally discouraged to be performed in shaders and can
          negatively impact performance except for certain scenarios.
        </li>
        <li>
          Test to see if a branch in the code does affect performance, but
          remember that it can be GPU and driver dependent. Preferrable use
          branches only when you have to.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/intermediates/color-2/"
      next="/intermediates/image-generation/"
    />
  </Layout>
)

export default TexturingBranchingPage
