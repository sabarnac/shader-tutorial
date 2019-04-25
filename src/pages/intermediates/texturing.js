import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import TexturingFirstExample from "../../components/intermediates/texturing/first-example"
import TexturingSecondExample from "../../components/intermediates/texturing/second-example"
import {
  firstVertexShaderSource,
  firstFragmentShaderSource,
} from "../../components/intermediates/texturing/first-example-shaders"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import { Link } from "gatsby"
import { secondFragmentShaderSource } from "../../components/intermediates/texturing/second-example-shaders"

const TexturingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Textures"
      description="A look into the how textures are used to color objects in shaders."
      keywords={["texture", "texturing", "uv", "shader", "intermediates"]}
    />
    <Content>
      <h2>Shader Intermediates - Textures</h2>
      <p>
        So far we've passed direct color information of vertices to the fragment
        shader, which was then interpolated for each fragment and then set as
        the pixel color.
      </p>
      <p>
        As learnt in the{" "}
        <Link to="/basics/fragment-shader/">fragment shader basics</Link>, color
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
      <TexturingFirstExample />
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
      <TexturingSecondExample />
      <h4>How it works</h4>
      <p>
        Similar to how the pulsing triangle was made in the last example of the{" "}
        <Link to="/basics/fragment-shader/">fragment shader basics</Link>, a{" "}
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
      <h3>Summary</h3>
      <ul>
        <li>
          Textures are mapped onto objects through a process called UV mapping.
        </li>
        <li>
          GPUs map a texture to an object through UV mapping.
          <ul>
            <li>A UV coordinate is received for each vertex.</li>
            <li>The UV coordinate is interpolated for each fragment.</li>
            <li>
              The UV coordinate is used to get the right color value from a
              pixel in a texture, which is then used to color the fragment.
            </li>
          </ul>
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/intermediates/image-generation/"
      next="/intermediates/lighting/"
    />
  </Layout>
)

export default TexturingPage
