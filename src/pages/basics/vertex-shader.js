import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import VertexShaderFirstExample from "../../components/basics/vertex-shader/first-example"
import { firstVertexShaderSource } from "../../components/basics/vertex-shader/first-example-shaders"
import { secondVertexShaderSource } from "../../components/basics/vertex-shader/second-example-shaders"
import PageChange from "../../components/page-change"
import VertexShaderSecondExample from "../../components/basics/vertex-shader/second-example"
import GlslCodeHighlight from "../../components/glsl-code-highlight"

const VertexShaderPage = () => (
  <Layout>
    <SEO
      title="Shader Basics - Vertex Shader"
      description="A look into the basics of a GPU vertex shader."
      keywords={["vertex", "shader", "basics"]}
    />
    <Content>
      <h2>Shader Basics - Vertex Shader</h2>
      <h3>What is a vertex shader</h3>
      <p>
        Vertex shaders process vertices and tells what their coordinates are in
        "clip-space", which is a space that makes it easy for computers to
        understand which vertices are visible to the camera and which are not
        and have to be cut or "clipped" out.
      </p>
      <p>
        This makes it faster for GPUs during later stages since they have less
        data to work with.
      </p>
      <p>
        They perform this process by receiving a single vertex from the list of
        vertices as input, and return a result that determines where the vertex
        should be present within clip-space,
      </p>
      <p>
        Since this shader is executed per vertex on all vertices passed to the
        GPU pipeline, any operation that requires modifications to the vertex
        can be performed during in this shader, as long as the final output is
        where the vertex is to be placed in the clip-space.
      </p>
      <h3>An example - A triangle</h3>
      <p>Below is an example of the work simple vertex shader:</p>
      <VertexShaderFirstExample />
      <p>
        We can see that, for a provided set of vertex positions, a shape is
        drawn. The points on the canvas where the vertices are placed is
        determined by the vertex shader (in part).
      </p>
      <h4>How it works</h4>
      <p>Let's look at the code for the vertex shader</p>
      <GlslCodeHighlight
        code={firstVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <p>
        Even though this is WebGL (which is similar to OpenGL), the concepts
        applied here can be mapped across other languages as well.
      </p>
      <p>
        The <code>void main</code> function is the primary function that is
        executed when the vertex shader (and any shader for that matter) is to
        executed, and should contain the primary shader code to be executed.
        This is similar to C/C++, where the <code>main</code> function in the
        primary entry is the one that is executed when starting the application.
      </p>
      <p>
        The <code>vertexPosition</code> attribute is a property that receives
        the initial coordinates of vertex as it's primary input, the one that it
        should transform into the final clip-space coordinates.
      </p>
      <p>
        It is defined as an attribute as it is a description of a certain
        "attribute" of the vertex (in this case, its position), can change based
        on which vertex is being operated on, and are always read-only.
      </p>
      <p>
        Do note that the type of it is set to <code>vec4</code>, which means
        it's a vector of size 4, but vertices passed to the vertex shader need
        not be limited to just this type, but a <code>vec4</code> type would
        provide the most detail about the coordinates of a vertex.
      </p>
      <p>
        The <code>modelMatrix</code>, <code>viewMatrix</code>, and{" "}
        <code>projectionMatrix</code> uniforms are additional properties passed
        separately to the vertex shader. Unlike the <code>vertexPosition</code>{" "}
        attribute, these values need to be the same for every vertex of the
        object/primitive operated on, which is why it's defined as uniform (it's
        uniform/same for every data being operated on by shaders).
      </p>
      <p>
        Similar to the <code>vertexPosition</code> attribute, the types of these
        uniforms is <code>mat4</code>, which means a matrix of size 4x4. Again,
        they need not be limited to this type, and can be a matrix of size upto
        4x4, or even a vector of size upto 4.
      </p>
      <p>Here's a simple explanation of the uniform variables being used:</p>
      <dl>
        <dt>
          1. <strong>modelMatrix</strong>
        </dt>
        <dd>
          <p>
            This matrix is used to represent where the vertex exists within the
            world. It represents the center of the model being drawn by the
            shader, which has been translated, rotated, and/or scaled into the
            necessary position in the world.
          </p>
          <p>
            Multiplying the vertex coordinate with this matrix will provide the
            result of where the vertex exists in the world w.r.t. to the center
            of the model it belongs to.
          </p>
        </dd>
        <dt>
          2. <strong>viewMatrix</strong>
        </dt>
        <dd>
          <p>
            This matrix is used to represent where the vertex exists relative to
            your view, or more specifically the cameras view. Once the vertex
            position is known in the world (by multiplying it with the{" "}
            <code>modelMatrix</code>), it's position relative to the camera can
            be determined by multiplying it with this matrix.
          </p>
        </dd>
        <dt>
          3. <strong>projectionMatrix</strong>
        </dt>
        <dd>
          <p>
            This matrix is used to represent the perspective of the camera.
            Things like field-of-view, aspect ratio, and others can distort and
            affect the way objects look. Likewise, the scale of objects can
            differ depending on distance, which needs to be accounted for.
          </p>
          <p>
            By multiplying the projection matrix onto the result of the previous
            calculations, we are able to map the vertex onto the perspective of
            the camera, taking into account it's aspect ratio, field-of-view,
            and the farthest and closest it can see.
          </p>
          <p>
            This final calculation provides us the coordinates of the vertex in
            clip-space.
          </p>
        </dd>
      </dl>
      <p>
        From the above explanation, it should be more obvious why the operation{" "}
        <code>
          gl_Position = projectionMatrix * viewMatrix * modelMatrix *
          vertexPosition;
        </code>{" "}
        is performed.
      </p>
      <ol>
        <li>
          The vertex position is taken and multiplied with the model matrix to
          determine where that vertex lies w.r.t the center of the model in the
          world.
        </li>
        <li>
          The result is then multiplied with the view matrix to determine where
          the vertex is positioned w.r.t the camera
        </li>
        <li>
          Finally the result of the second operation is multiplied with the
          projection matrix to determine where the vertex is located within the
          perspective of the camera.
        </li>
      </ol>
      <p>
        This final result is the output of the vertex shader, which, in WebGL,
        is stored in the special variable <code>gl_Position</code>.
      </p>
      <h3>Another example - A rotating triangle</h3>
      <p>
        Since the vertex shader determines where each vertex is w.r.t the
        perspective space of the screen, by passing it the necessary
        transformations to apply to the vertices, it can move their positions as
        requried.
      </p>
      <VertexShaderSecondExample />
      <h4>How it works</h4>
      <p>
        By passing a <code>modelMatrix</code> that's rotated based on the
        current time, the vertex shader will rotate all the vertices by the set
        amount when rendering each frame.
      </p>
      <p>
        The <code>modelMatrix</code> is rotated because it is the matrix that
        represents the model as a whole, so transforming this matrix is akin to
        transforming the model (scale, rotation, and translation), and thereby
        every vertex of that model.
      </p>
      <p>
        The reason the model matrix rotation calculation is done on the CPU is
        to avoid redundant calculations. Instead of having the vertex shader
        recalculate the same rotation value for every vertex every frame, the
        CPU can calculate it just once every frame and then pass it to the
        vertex shader to apply it.
      </p>
      <p>
        This principle can also be applied to the model, view, and projection
        matrices we multiply to the vertex. By multiplying all these 3 matrices
        in advance on the CPU, and then passing to the vertex shader, we save on
        unnecessary calculations being done for every vertex every frame.
      </p>
      <p>The vertex shader code should now ideally look like this:</p>
      <GlslCodeHighlight
        code={secondVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <h3>Summary</h3>
      <ul>
        <li>
          The vertex shader receives a vertex from a list of vertices and plots
          it onto a space known as the clip-space.
        </li>
        <li>
          The vertex shader requires certain values provided to it about the
          model, view, and projection, in order to be able to determine where
          the final position of the vertex is.
        </li>
        <li>
          Since the shader determines where the vertex is present within this
          space, it can manipulate and transform the vertex to be placed
          wherever required.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/basics/render-pipeline/"
      next="/basics/fragment-shader/"
    />
  </Layout>
)

export default VertexShaderPage
