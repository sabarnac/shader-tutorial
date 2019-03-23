import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import fragment1Img from "../../images/basics/fragment-1.png"
import fragment2Img from "../../images/basics/fragment-2.png"
import fragment3Img from "../../images/basics/fragment-3.png"
import FragmentShaderFirstExample from "../../components/basics/fragment-shader/first-example"
import { firstFragmentShaderSource } from "../../components/basics/fragment-shader/first-example-shaders"
import {
  secondVertexShaderSource,
  secondFragmentShaderSource,
} from "../../components/basics/fragment-shader/second-example-shaders"
import { thirdFragmentShaderSource } from "../../components/basics/fragment-shader/third-example-shaders"
import GlslCodeHighlight from "../../components/glsl-code-highlight"
import FragmentShaderSecondExample from "../../components/basics/fragment-shader/second-example"
import FragmentShaderThirdExample from "../../components/basics/fragment-shader/third-example"

const FragmentShaderPage = () => {
  return (
    <Layout>
      <SEO
        title="Basics Of A Fragment Shader"
        keywords={["fragment", "shader", "basics"]}
      />
      <h2>Basics Of A Fragment Shader</h2>
      <h3>What Is A Fragment Shader</h3>
      <p>
        Similar to how a vertex shader operates on a vertex of the object and
        tells where it's final coordinates are on the screen, a fragment shader
        operates on a "fragment" of the object and tells what the color of that
        fragment is supposed to be.
      </p>
      <p>
        Since it is executed per fragment on all fragments generated by the GPU
        pipeline, any operation that requires modification of the color of the
        fragment (like brightening due to lights or darkening due to shadows)
        can be done through the fragment shader.
      </p>
      <h3>What Is A Fragment</h3>
      <p>
        Once the vertex shader has produced the final set of vertices that have
        been plotted onto the screen (or what is called "screen-space"), the
        vertices are then converted into a set of "base primitives" (points,
        lines and/or triangles). These base primitives are then broken down into
        things called fragments.
      </p>
      <p>
        A fragment is a sample of a primitive that contains certain information
        for filling up a pixel, so whatever the fragment is at a particular
        pixel location, that fragment can represent that pixel.
      </p>
      <p>
        A pixel can consist of multiple fragments, because, depending upon what
        area of the primitive the pixel covers, there can be multiple values
        present within the pixel, which have to either be combined, or just one
        selected at random.
      </p>
      <p>
        Let us assume that we wish to render a circle on a screen of size 4x4
        pixels (total of 16 pixels), as shown by the image below:
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 1"
          style={{ width: "65%" }}
          src={fragment1Img}
        />
      </p>
      <p>
        After splitting the circle into 16 equal parts, we have to now decide
        what the color of each pixel should be. For pixels 6, 7, 10, and 11,
        this is easy, since the pixel is completely within the circle, so it
        just needs to be colored red.
      </p>
      <p>
        However, the other pixels contain both the circle, as well as the
        background, so a decision needs to be made as to what color that pixel
        should be.
      </p>
      <p>
        In order to do this, we can take a sample from somewhere in the area the
        pixel covers, and assume that as the final color of the pixel. This
        sample is what is considered a "fragment".
      </p>
      <p>
        If we only wanted to take one "fragment" per pixel, then we could just
        take a sample from the center of each pixel, meaning that in this
        scenario, the final image on the screen, would be:
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 2"
          style={{ width: "65%" }}
          src={fragment2Img}
        />
      </p>
      <p>
        You could also instead of just taking one "fragment", take multiple
        fragments, and interpolate from that what the ideal color of each pixel
        should be.
      </p>
      <p>
        In the case of the circle, by taking 4 "fragments" (one from each
        corner), we can see that two of those fragments would return white, and
        two would return red, which would average out to a reddist-pink, as
        shown below:
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 3"
          style={{ width: "65%" }}
          src={fragment3Img}
        />
      </p>
      <p>
        While not as accurate as our initial image, it is still closer to
        reality compared to the first result. If you're not sure how, let's see
        how these images look at 25px width and height.
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 2 Mini"
          style={{ width: "30px" }}
          src={fragment2Img}
        />
        <br />
        <img
          alt="Fragment Example Part 3 Mini"
          style={{ width: "30px" }}
          src={fragment3Img}
        />
      </p>
      <p>
        At a much smaller scale, the second result will look considerably more
        like a circle than the first result. This is also how anti-aliasing
        works, by using multiple samples to determine a more accurate color for
        each pixel.
      </p>
      <p>
        Along with this case, primitives can also overlap other primitives,
        which means fragments can overlap other fragments. This requires
        fragments to be discarded if they are covered, or combined with other
        fragments if some of them are not opaque.
      </p>
      <p>
        Do note that in DirectX, fragments are called pixels (and by extension,
        fragment shaders are called pixel shaders), but that name isn't
        technically accurate.
      </p>
      <h3>An Example - The Triangle Returns</h3>
      <p>
        Let's go back to our standard triangle example. Previously, we only had
        the edges of the triangle drawn to provide an explanation on how vertex
        shaders work. This time we'll be coloring the entire triangle.
      </p>
      <FragmentShaderFirstExample />
      <h4>How It Works</h4>
      <GlslCodeHighlight code={firstFragmentShaderSource.trim()} />
      <p>
        Looking at the code, you'll see the fragment shader is extremely simple,
        it just generates a <code>vec4</code> of <code>1.0, 0.0, 0.0, 0.0</code>
        , which corresponds to R, G, B, and A values respectively. The color is
        then assigned to the special output variable defined in WebGL called{" "}
        <code>gl_FragColor</code> (OpenGL Fragment Color)
      </p>
      <p>
        In the vertex shader examples, WebGL was told that the three vertices
        provided were part of a line loop, which is basically coordinates that
        define a line that loops back around to the start.
      </p>
      <p>
        So when OpenGL would call the fragment shader, it would color the
        fragments of the lines that joined the first and second vertex, the
        second and third vertex, and (since it was defined to be a loop), the
        third and first vertex.
      </p>
      <p>
        In this case, since WebGL is told the vertices belong to a triangle, the
        3 vertices are taken and used to create a triangle, and that triangle is
        then split into fragments, with each fragment then colored by the
        fragment shader.
      </p>
      <h3>Another Example - A Triangular Color Wheel</h3>
      <p>
        What if we wanted to define our own color values that should be used to
        color the pixels? Just like with the vertex shader, we can pass our own
        needed values to the fragment shader.
      </p>
      <p>
        These values have to be passed through the vertex shader, meaning that
        when the vertex shader receives the value, it has to set that value to
        another variable, which is then received by the fragment shader.
      </p>
      <p>
        One very important note is that you can only define the color values of
        each vertex, and not each fragment or pixel, since their number is an
        unknown (you won't know how many fragments may be generated, or pixels
        that the object may cover).
      </p>
      <p>
        So if we can only define color values for each vertex, how will the
        fragment shader know what color it should receive for pixels that are
        inside the triangle not defined by any vertex? Let's take a look at an
        example.
      </p>
      <FragmentShaderSecondExample />
      <h4>How It Works</h4>
      <p>
        As is visible from the result, since we set the colors of each vertex
        have been set to red, green, and blue, those corners of the triangles
        have been colored appropriately.
      </p>
      <p>
        However, the rest of the triangle seems to be a color mixture of all
        these colors in specific ratios. This is done through interpolation.
      </p>
      <p>
        When we set the colors of the vertices, and then the object/primitive is
        set into fragments, the fragments covering the vertices automatically
        get the color of that vertex, since that is what that fragment
        represents.
      </p>
      <p>
        The color of other fragments is determined by checking its position and
        distance relative to every vertex, and interpolating what its color
        value should be based upon the distance.
      </p>
      <p>
        So, for example, as a fragment moves further away from vertex 2 and
        moves closer to vertex 3, the green color component slowly fades away
        and is slowly overtaken by the blue component.
      </p>
      <p>Let's look at the code for the shaders in this example:</p>
      <p>
        <strong>Vertex Shader:</strong>
      </p>
      <GlslCodeHighlight code={secondVertexShaderSource.trim()} />
      <p>
        <strong>Fragment Shader:</strong>
      </p>
      <GlslCodeHighlight code={secondFragmentShaderSource.trim()} />
      <p>
        We pass the color of the vertices to their respective vertex shader by
        passing the color values as an attribute (since the color is different
        per vertex).
      </p>
      <p>
        The vertex shader then passes this on to the fragment shader through the{" "}
        <code>vec3</code> varying named <code>color</code>.
      </p>
      <p>
        The <code>color</code> is defined as a varying is because while it is
        fixed per vertex, it will need to be interpolated when passed to
        fragments, depending on their position relative to the vertices.
      </p>
      <p>
        It is also defined as <code>lowp</code> which just means the precision
        of it's value is low (we can ignore these sorts of qualifiers).
      </p>
      <p>
        As a result, when we pass the color of the vertices down to the fragment
        shaders, the value is interpolated based on the position of the
        fragment, and then passed to the fragment.
      </p>
      <p>
        Just as attributes are read-only for the vertex shader and can differ
        per vertex, varyings are read-only for the fragment shader and can
        differ per fragment (they are write only for the vertex shader).
      </p>
      <h3>A Final Example - A Pulsing Triangle Color Wheel</h3>
      <FragmentShaderThirdExample />
      <h4>How It Works</h4>
      <p>
        Similar to how we did the rotating triangle in the previous chapter, we
        determine how much to shift the color by relative to the current
        timestamp.
      </p>
      <p>
        This calculation is, similar to the rotating triangle, also done on the
        CPU since it only needs to be done once, and can save redundant
        calculations done repeatedly on the GPU.
      </p>
      <p>
        By subtracting the calculated color shift from the interpolated fragment
        color, we can have the color of the triangle oscillate from pure black,
        to the standard triangle color wheel, to pure white, and back again.
      </p>
      <p>
        The color shift value is passed directly as a uniform since it doesn't
        need to be interpolated and should instead be constant for every
        fragment of the object.
      </p>
      <GlslCodeHighlight code={thirdFragmentShaderSource.trim()} />
      <p>
        <em>
          <code>clamp</code> is a function that takes a specific value (
          <code>color - colorShift</code>) and makes sure it doesn't go outside
          of a certain range (<code>0.0</code> and <code>1.0</code>), "clamping"
          it to either end depending on if it is too large or too small. It also
          works with both vector (<code>vec2</code>, <code>vec3</code>,{" "}
          <code>vec4</code>) and scalar values (<code>float</code>,{" "}
          <code>int</code>)
        </em>
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          The fragment shader receives a fragment from a list of fragments and
          sets the appropriate color value for that fragment.
        </li>
        <li>
          At least one fragment that comes under a pixel is used when
          determining the color of that pixel.
        </li>
        <li>
          The fragment shader requires certain values in order to determine what
          the final color of the fragment should be.
          <ul>
            <li>
              If this data is passed through the vertex shader, its actual value
              will be interpolated by the GPU based on the distance of the
              fragment from each vertex of the primitive.
            </li>
            <li>
              If the data is passed as a uniform, then the GPU will not
              interpolate its actual value, since it is supposed to be uniform
              among all fragments.
            </li>
          </ul>
        </li>
      </ul>
      <PageChange
        previous="/basics/vertex-shader/"
        next="/basics/fragment-shader-2"
      />
    </Layout>
  )
}

export default FragmentShaderPage
