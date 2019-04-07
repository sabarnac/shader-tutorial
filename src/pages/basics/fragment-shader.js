import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
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
import { Link } from "gatsby"

const FragmentShaderPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Basics - Fragment Shader"
      description="A look into the basics of a GPU fragment shader."
      keywords={["fragment", "shader", "basics"]}
    />
    <Content>
      <h2>Shader Basics - Fragment Shader</h2>
      <h3>What is a fragment shader</h3>
      <p>
        Similar to how a vertex shader operates on vertices of an object, a
        fragment shader operates on a "fragment" of an object and tells what the
        color of that fragment is supposed to be.
      </p>
      <p>
        Since it is executed per fragment on all fragments generated by the GPU
        pipeline, any operation that requires modification of the color of the
        fragment (like brightening due to lights or darkening due to shadows)
        can be done through the fragment shader.
      </p>
      <h3>What is a fragment</h3>
      <p>
        As previously mentioned in the{" "}
        <Link to="/basics/render-pipeline">render pipeline overview</Link>, a
        fragment is a sample of a primitive that contains certain information
        required for coloring a pixel.
      </p>
      <p>
        A pixel can consist of multiple fragments, because, depending upon what
        area of the primitive the pixel covers, there can be multiple values
        present within the pixel, which have to either be combined, or just one
        selected at random.
      </p>
      <p>
        As an example, take a circle that is to be rendered on a screen of size
        8x8 pixels (total of 64 pixels), as shown by the image below:
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 1"
          style={{ width: "65%" }}
          src={fragment1Img}
        />
      </p>
      <p>
        After splitting the circle into 16 equal parts, a decision on what the
        color of each pixel should be needs to be made. For pixels with just a
        single color, they just adopt that color.
      </p>
      <p>
        However, the other pixels contain two colors, as they contain both the
        circle and the background. This requires a decision needs to be made as
        to what the final color of the pixel should be.
      </p>
      <p>
        In order to do this, a sample can be taken from somewhere in the area
        the pixel covers, and fix that as the final color of the pixel. This
        sample is what is considered a "fragment".
      </p>
      <p>
        If only one "fragment" is requuired per pixel, then a sample from the
        center of each pixel can be taken, resulting in the render below:
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 2"
          style={{ width: "65%" }}
          src={fragment2Img}
        />
      </p>
      <p>
        Instead, if multiple fragments are taken, a final color value for the
        pixel can be interpolated based on what the color of each fragment is.
      </p>
      <p>
        In the case of the circle, by taking 4 "fragments" (one from
        approximately each corner), the final color would be a reddish-pink,
        since two of these fragments would have the color red, and the other two
        would have the color white:
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
        how these images look at 30px width and height.
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
        At a much smaller scale, the second result looks considerably more like
        a circle than the first result. This is how certain anti-aliasing
        methods works.
      </p>
      <p>
        Along with this case, primitives can also overlap other primitives,
        which means fragments can overlap other fragments. This requires
        fragments to be discarded if they are covered, or combined with other
        fragments if some of them are not opaque (a fragment from a translucent
        glass over an object).
      </p>
      <p>
        Do note that in DirectX, fragments are called pixels (and by extension,
        fragment shaders are called pixel shaders), but that name isn't
        technically accurate.
      </p>
      <h3>An example - The triangle returns</h3>
      <p>
        Let's go back to our standard triangle example. Previously, we only had
        the edges of the triangle drawn to provide an explanation on how vertex
        shaders work. This time we'll be coloring the entire triangle.
      </p>
      <FragmentShaderFirstExample />
      <h4>How it works</h4>
      <GlslCodeHighlight
        code={firstFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        Looking at the code, you'll see the fragment shader is extremely simple,
        it just generates a <code>vec4</code> of <code>1.0, 0.0, 0.0, 0.0</code>
        , which corresponds to R, G, B, and A values respectively. The color is
        then assigned to the special output variable defined in WebGL called{" "}
        <code>gl_FragColor</code> (WebGL Fragment Color)
      </p>
      <p>
        In the vertex shader examples, WebGL was told that the three vertices
        provided were part of a line loop, meaning they are coordinates that
        define a line that loops back around to the start.
      </p>
      <p>
        So when WebGL would call the fragment shader, it would color the
        fragments of the lines that joined the first and second vertex, then the
        line connecting the second and third vertex, and (since it was defined
        to be a loop), the line connecting third and first vertex.
      </p>
      <p>
        In this case, since WebGL is told the vertices belong to a triangle, the
        3 vertices are taken and used to create a triangle, and that triangle is
        then split into fragments, with each fragment then colored by the
        fragment shader.
      </p>
      <h3>Another example - A triangular color wheel</h3>
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
      <h4>How it works</h4>
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
      <GlslCodeHighlight
        code={secondVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={secondFragmentShaderSource.trim()}
        type={"Fragment"}
      />
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
      <h3>A final example - A pulsing triangle color wheel</h3>
      <FragmentShaderThirdExample />
      <h4>How it works</h4>
      <p>
        Similar to how we did the rotating triangle in the previous chapter, we
        determine how much to shift the color by relative to the current
        timestamp.
      </p>
      <p>
        By subtracting the calculated color shift from the interpolated fragment
        color, we can have the color of the triangle oscillate from pure black,
        to the standard triangle color wheel, to pure white, and back again.
      </p>
      <GlslCodeHighlight
        code={thirdFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <p>
        The color shift is calculated in the shader by taking the time elapsed
        since the start of the animation as an input, dividing it by 500 so that
        the animation runs slower, and then finding the cosine of the elapsed
        time.
      </p>
      <p>
        The time is passed in milliseconds, and the <code>cos</code> function in
        glsl takes time in radians. So the animation depends on every half
        second passed.
      </p>
      <p>
        Since the division results in a floating point number, this number does
        change every frame, which results in the color shift value also updating
        accordingly.
      </p>
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
    </Content>
    <PageChange previous="/basics/color/" next="/basics/end" />
  </Layout>
)

export default FragmentShaderPage
