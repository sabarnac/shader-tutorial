import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import React from "react";

import Content from "../../components/content";
import GlslCodeHighlight from "../../components/glsl-code-highlight";
import Heading from "../../components/heading";
import TexturingFirstExample from "../../components/intermediates/color-mapping/first-example";
import {
  firstFragmentShaderSource,
  firstVertexShaderSource,
} from "../../components/intermediates/color-mapping/first-example-shaders";
import TexturingSecondExample from "../../components/intermediates/color-mapping/second-example";
import { secondFragmentShaderSource } from "../../components/intermediates/color-mapping/second-example-shaders";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import Seo from "../../components/seo";

const ColorMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Intermediates - Color Mapping"
      description="A look into the how color textures are used to color objects in shaders."
      keywords={["color", "mapping", "texturing", "shader", "intermediates"]}
    />
    <Content>
      <h1>Shader Intermediates - Color Mapping</h1>
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
        However, as we learnt in the{" "}
        <Link to="/intermediate/mapping/">mapping</Link> chapter, we can use a
        texture to add much more detail to an object through the process of UV
        mapping.
      </p>
      <p>
        We can use the process of mapping to map colors of a fragment from the
        color data stored in a texture/color map. This process is called color
        mapping.
      </p>
      <p>
        Color mapping is also referred to as texturing due to the fact that
        textures only hold color data, and are primarily used to color fragments
        in an image.
      </p>
      <p>
        Let's look at an example of color mapping where an image is used as a
        texture to color the faces of a cube.
      </p>
      <Heading type="h2">An example - A cube</Heading>
      <TexturingFirstExample />
      <Heading type="h3">How it works</Heading>
      <p>
        The following texture is used to color the each face of the rendered
        cube:
      </p>
      <div className="image util text-center">
        <StaticImage
          src="../../images/intermediates/texture.png"
          alt="Cube Face Texture"
          style={{ maxWidth: "65%" }}
        />
      </div>
      <p>
        The vertices of each face are mapped to the corners of the texture. You
        can look at the cube details below the rendered image to see the UV
        coordinates of the vertices of a single face.
      </p>
      <p>
        <em>
          Note: For OpenGL/WebGL, the origin for UV coordinates is the
          lower-left corner of an image. For DirectX, the origin for UV
          coordinates is the upper-left corner of an image. When translating
          shader code between these languages, take care of the Y-axis values of
          the UV coordinates.
        </em>
      </p>
      <p>
        These UV coordinates are passed as part of the vertex data to the GPU.
        When these coordinates are passed to the fragment shader through the
        vertex shader, the GPU interpolates the UV coordinates of the fragments.
      </p>
      <p>
        For example, a fragment in the center of the face is equi-distant from
        all four vertices of the face. Since the vertices are mapped to the
        corners of the texture, the fragment will receive an interpolated UV
        coordinate at the center of the texture.
      </p>
      <p>
        Using these interpolated UV coordinates, the color of the texture at
        that point can be read by the fragment shader, which will represent the
        final color of that fragment, since the UV coordinate represents the
        location of the fragment within the texture.
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
        In the vertex shader code above, the UV coordinates of the vertex is
        provided through the <code>vertexUv</code> attribute, which is then
        passed to the fragment shader through <code>uv</code>, allowing the GPU
        to interpolate the UV coordinates for each fragment.
      </p>
      <p>
        In the fragment shader, the pixel color value of the texture at the
        given UV coordinates is retrieved through the 2D sampler{" "}
        <code>colorTextureSampler</code>, which is then the final color assigned
        to the fragment.
      </p>
      <p>
        <code>colorTextureSampler</code> is defined as <code>sampler2D</code>{" "}
        because the texture is a 2D image which is being sampled for color
        values at specific coordinates.
      </p>
      <Heading type="h2">Another example - A (mostly) pulsing cube</Heading>
      <TexturingSecondExample />
      <Heading type="h3">How it works</Heading>
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
      <Heading type="h2">Additional Notes</Heading>
      <p>
        If you're working with OpenGL/WebGL, there is one thing you will need to
        remember when working with textures.
      </p>
      <p>
        Typically when images are read, their starting coordinates are at the
        top-left of the image. This means that the origin coordinates{" "}
        <code>(0, 0, 0)</code> represents the top-left most pixel of the image.
      </p>
      <p>
        However, in OpenGL/WebGL the starting coordinate is instead the
        bottom-left of the image. This means that if you try to load an image
        the same way in OpenGL as in DirectX, you will find that the image is
        flipped vertically when sampling and rendering it in your shader.
      </p>
      <p>As a result, you have two possible options:</p>
      <ul>
        <li>
          Flip the image vertically when loading it in OpenGL to keep things
          consistent in the shader.
        </li>
        <li>
          Invert the Y-axis of your UV coordinates when sampling from the image
          texture.
        </li>
      </ul>
      <p>
        Since our tutorial uses WebGL, we need to use one of these options to
        prevent textures from appearing inverted. We've gone with the first
        option to keep the shader logic more consistent. If you're using
        OpenGL/WebGL, you'll need to keep this in mind as well.
      </p>
      <Heading type="h2">Summary</Heading>
      <ul>
        <li>
          Through the process of UV mapping, we can define the color of each
          fragment of an object through the use of a texture.
        </li>
        <li>
          Each vertex is assigned a UV coordinate on the texture, which is then
          interpolated by the GPU for each fragment.
        </li>
        <li>
          The fragment shader can then read the color value of the texture at
          the interpolated UV coordinate for the fragment to determine and set
          the final color of that fragment.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/intermediates/mapping/"
      next="/intermediates/lighting/"
    />
  </Layout>
);

export default ColorMappingPage;
