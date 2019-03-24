import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const IntroductionPage = () => (
  <Layout>
    <SEO title="Introduction" keywords={["shader", "introduction"]} />
    <h2>The GPU Render Pipeline</h2>
    <p>
      Before diving into shaders, an overview of the render pipeline is
      necessary to understand how shaders actually contribute to rendering an
      image.
    </p>
    <h3>An overview</h3>
    <p>
      GPUs, when rendering images, primarily work on a set of vertex data. If we
      have an object (for example, a teapot) that we wish to render an image of,
      the teapot first needs to be divided into small components called
      primitives.
    </p>
    <p>
      Primitives are basic shapes that can, when combined together, form
      objects. Like how atoms are the building blocks of physical objects,
      primitives can be considered the building blocks of digital objects.
    </p>
    <p>
      A primitive can be described by the vertices of that primitive, along with
      certain other information.
    </p>
    <p>
      So in order to tell the GPU to render an object, we have to provide the
      GPU the set of vertices that describe the primitives forming that object,
      along with what kind of primitives do the vertices form.
    </p>
    <p>
      Only one kind of primitive is generally used to form objects, although
      multiple can technically be used.
    </p>
    <p>
      Along with this, the GPU is also provided with a shader program that will
      aid the GPU in interpreting this data and visualizing it.
    </p>
    <p>
      The GPU is then told to perform an operation. It goes through a render
      pipeline, starting multiple instances of the shader program to process the
      data in parallel, processing the data during intermediate stages as
      required, and finally outputting a rendered image.
    </p>
    <p>
      Below is an overview of the render pipeline, showing the stages the GPU
      goes through to render the final image (note that stages in blue are
      programmable, stages in yellow are not):
    </p>
    <p className="util text-center">
      <img
        src="https://www.khronos.org/opengl/wiki_opengl/images/RenderingPipeline.png"
        alt="Render Pipeline Visual"
      />
      <br />
      <a
        href="https://www.khronos.org/opengl/wiki/File:RenderingPipeline.png"
        target="_blank"
        rel="noopener noreferrer"
      >
        Source
      </a>
    </p>
    <p>
      This may seem a little daunting at first, but let's walk through it step
      by step:
    </p>
    <dl>
      <dt>
        <h4>Vertex Specification</h4>
      </dt>
      <dd>
        <p>
          This is the set of data that the GPU will be working with. For
          rendering, the GPU primarily works with a set of vertices.
        </p>
        <p>
          Additional data can be be sent as well, but they have to be constant
          for all vertices passed to the GPU, or need to have a 1-to-1 relation
          with the vertices (each piece of data should relate to a vertex and
          vice-versa).
        </p>
      </dd>
      <dt>
        <h4>Vertex Shader</h4>
      </dt>
      <dd>
        <p>
          This is the first shader that is executed on the data provided to the
          GPU. It receives a single vertex as an input and provides a coordinate
          in "clip-space" as an output. More of this will be discussed in the
          chapter on the basics of the vertex shader.
        </p>
      </dd>
      <dt>
        <h4>Tesellation</h4>
      </dt>
      <dd>
        <p>
          Tessellation is an optional stage that can be performed on the
          resultant vertices with their coordinates to determine and
          "tessellate" the object being rendered. Tessellation is the process of
          splitting a primitive into sub-primitives in order to improve detail.
        </p>
        <p>
          The tessellation stage consists of two shaders, one that determines if
          a primitive needs to be tessellated, and one that performs the actual
          tessellation.
        </p>
      </dd>
      <dt>
        <h4>Geometry Shader</h4>
      </dt>
      <dd>
        <p>
          This is an optional shader that can receive a set of primitives, and
          outputs a set of primitives that can be same or different to the ones
          received by it.
        </p>
        <p>
          This is useful for a variety of tasks, from{" "}
          <a
            href="http://upvoid.com/devblog/2013/02/prototype-grass/"
            rel="noopener noreferrer"
            target="_blank"
          >
            generating grass on terrain geometry
          </a>{" "}
          to creating{" "}
          <a
            href="https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch11.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            volumetric shadows
          </a>
          .
        </p>
      </dd>
      <dt>
        <h4>Vertex Post-Processing</h4>
      </dt>
      <dd>
        <p>
          In this stage, the results from the processing done in the previous
          stages is saved in a separate buffer, allowing the results to be
          operated on by the initial stages as a feedback loop, or letting the
          CPU read the results.
        </p>
        <p>
          The data of the output from the previous stages is in the same order
          as the input data provided to it, so that the input data and output
          result can be related easily.
        </p>
        <p>
          The output undergoes clipping after the previous step, where every
          primitive completely outside the view of the screen is removed, every
          primitive completely inside is kept, and primitives in between are
          subdivided in such a way that they split into primitives that are
          completely outside and inside, allowing for the unneeded parts of the
          primitive to be removed.
        </p>
      </dd>
      <dt>
        <h4>Primitive Assembly</h4>
      </dt>
      <dd>
        <p>
          This stages takes the primitives that have to be rendered and splits
          them up into simple/base primitives (points, lines, or triangles). The
          reason for this is because these are the simplest and sets of
          primitives that the GPU can work with, as well as being the smallest
          type (they cannot be represented by shapes with fewer vertices).
        </p>
        <p>
          Culling is performed during this stage as well, to remove base
          primitives that won't be rendered onto the screen.
        </p>
      </dd>
      <dt>
        <h4>Rasterization</h4>
      </dt>
      <dd>
        <p>
          The final primitives are broken down into small samples called
          fragments, which contain information that is used to color the pixels
          of the rendered image. More of this will be discussed in the chapter
          on the basics of the fragment shader.
        </p>
      </dd>
      <dt>
        <h4>Fragment Shader</h4>
      </dt>
      <dd>
        <p>
          This shader processes the fragments generated by the rasterization
          process and determines what the color of each fragment is, which
          contributes to the final color of the pixel the fragment is under.
          More of this will be discussed in the chapter on the basics of the
          fragment shader.
        </p>
        <p>
          This stage is <em>*technically*</em> optional, but it is required if
          you want to render an actual image with some color.
        </p>
      </dd>
      <dt>
        <h4>Per-Sample Operations</h4>
      </dt>
      <dd>
        <p>
          This the final stage that consists of multiple tests in order to
          remove fragments that are not part of the final image. The tests are:
        </p>
        <ul>
          <li>
            <strong>Pixel ownership test</strong>: Tests if the pixel the
            fragment is under is "owned" by the renderer (applicable in cases
            where a window is overlapping the view).
          </li>
          <li>
            <strong>Scissor test</strong>: Tests if the fragment lies within a
            specific section of the screen.
          </li>
          <li>
            <strong>Stencil test</strong>: An optional test that, when enabled,
            checks if the fragment is blocked by a stencil image/mask.
          </li>
          <li>
            <strong>Depth test</strong>: Tests if the fragment's is below or
            above certain fragments, and whether they need to be discarded
            accordingly.
          </li>
        </ul>
        <p>
          A certain number of these steps can be performed before running the
          fragment shader under certain conditions to improve performance.
        </p>
        <p>
          After the tests are completed, the final color of the pixel is
          determined by blending the colors of all fragments part of the pixel
          that passed the tests.
        </p>
        <p>
          The result is then copied to a framebuffer, which is a buffer of the
          generated image, and can either be copied from the GPU by the CPU, or
          sent to the monitor to show to the user.
        </p>
      </dd>
    </dl>
    <p>
      The flow of the pipeline also allows for data to be passed from certain
      shaders to others, which can be used in interesting ways, which will be
      explored later.
    </p>
    <p>
      Understanding how a GPU renders is important, since this helps understand
      the purpose of each type of shader and why they perform the operations
      that they do.
    </p>
    <p>
      The basics section will be focusing primarily on vertex shaders and
      fragment shaders, which are vital for rendering an image on to the screen,
      or onto a buffer for use later. The next chapter will begin with the
      vertex shader.
    </p>
    <PageChange next="/basics/vertex-shader/" />
  </Layout>
)

export default IntroductionPage
