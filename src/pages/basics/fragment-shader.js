import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import fragment1Img from "../../images/basics/fragment-1.png"
import fragment2Img from "../../images/basics/fragment-2.png"
import fragment3Img from "../../images/basics/fragment-3.png"
import FragmentShaderFirstExample from "../../components/basics/fragment-shader/first-example"
import { firstFragmentShaderSource } from "../../components/basics/fragment-shader/first-example-shaders"
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
        And, similar to the vertex shader, since it is executed per fragment on
        all fragments generated by the GPU pipeline, any operation that requires
        modification of the color of the fragment (like brightening due to
        lights or darkening due to shadows, absorbing other colors due to
        reflections, etc.) can be done through the fragment shader, as long as
        the final result is a color value
      </p>
      <h3>What Is A Fragment</h3>
      <p>
        Once the vertex shader has produced the final set of vertices that have
        been plotted onto the screen, and some post-processing is done on them,
        the vertices are then converted into a set of primitives (points, lines
        and/or triangles). These triangles are then broken down into things
        called fragments.
      </p>
      <p>
        An extremely simple explanation is that a fragment is a sample of the
        primitive at the location of a pixel, so whatever the fragment is at a
        particular pixel location, that fragment would basically represent that
        pixel. However, a pixel can consist of multiple fragments, because,
        depending upon what area of the primitive the pixel covers, there can be
        multiple values present within the pixel, which have to either be
        combined, or just one selected at random.
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
        should be. In order to do this, we can take a sample from somewhere in
        the area the pixel covers, and assume that as the final color of the
        pixel. This sample is what is considered a "fragment".
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
        should be. In the case of the circle, by taking 4 "fragments" (one from
        each corner), we can see that 3 of those fragments would return white,
        and one would return red, so averaging it out should return 25% red, 75%
        white, resulting in the image, which is a lot closer to reality compared
        to the first result:
      </p>
      <p className="util text-center">
        <img
          alt="Fragment Example Part 3"
          style={{ width: "65%" }}
          src={fragment3Img}
        />
      </p>
      <p>
        Fragments can also be overlapped by other fragments, similar to how
        objects can be overlapped by other objects. Which fragments are
        overlapping others is determined by their depth position, or position in
        the Z-axis, which, as we know, is generated by the vertex shader. If a
        fragment is overlapped by another fragment, then it is discarded when
        rendering the final image.
      </p>
      <h3>A Simple Example - The Triangle Returns</h3>
      <p>
        Let's go back to our standard triangle examples. Previously we had only
        the edges of the triangle drawn to provide an explanation on how vertex
        shaders work. This time we'll be coloring the entire triangle red.
      </p>
      <FragmentShaderFirstExample />
      <GlslCodeHighlight code={firstFragmentShaderSource.trim()} />
      <p>
        Looking at the code, you'll see the fragment shader is extremely simple,
        it just generates a <code>vec4</code> of <code>1.0, 0.0, 0.0, 0.0</code>
        , which corresponds to R, G, B, and A values respectively. The color is
        then assigned to the special output variable defined in WebGL called{" "}
        <code>gl_FragColor</code> (OpenGL Fragment Color)
      </p>
      <p>
        Once the vertex shader returns the vertices in clip-space, and any
        objects are culled out (in this case none since the triangle is within
        the view itself), the object is then rasterized into fragments, and
        then, depending on the type of primitive the object is said to be, the
        appropriate fragments are colored.
      </p>
      <p>
        In the vertex shader examples, WebGL was told that the three vertices
        provided were part of a line loop, which is basically coordinates that
        define a line that loops back around to the start. So when OpenGL would
        call the fragment shader, it would color the fragments of the lines that
        joined the first and second vertex, the second and third vertex, and
        (since it was defined to be a loop), the third and first vertex.
      </p>
      <p>
        In this case, since WebGL is told the vertices belong to a triangle, the
        3 vertices are taken and used to create a triangle, and that triangle is
        then split into fragments, with each fragment then colored by the
        fragment shader.
      </p>
      <p>
        What if we wanted to define our own color values that should be used to
        color the pixels? Just like with the vertex shader, we can pass our own
        needed values to the fragment shader. These values have to be passed
        through the vertex shader, meaning that when the vertex shader receives
        the value, it has to set that value to another variable, which is then
        received by the fragment shader.
      </p>
      <p>
        One very important note is that you can only define the color values of
        each vertex, and not each fragment or pixel, since where the vertices of
        the triangle will finally be placed is unknown, as well as how much of
        the screen area it will cover. So if we can only define color values for
        each vertex, how will the fragment shader know what the color it should
        receive for pixels that are inside the triangle? Let's take a look at
        the result first.
      </p>
      <FragmentShaderSecondExample />
      <FragmentShaderThirdExample />
      <PageChange previous="/basics/vertex-shader/" />
    </Layout>
  )
}

export default FragmentShaderPage
