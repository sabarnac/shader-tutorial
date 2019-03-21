import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import VertexShaderFirstExample from "../../components/basics/vertex-shader/first-example"
import { firstVertexShaderSource } from "../../components/basics/vertex-shader/first-example-shaders"
import { secondVertexShaderSource } from "../../components/basics/vertex-shader/second-example-shaders"
import PageChange from "../../components/page-change"
import VertexShaderSecondExample from "../../components/basics/vertex-shader/second-example"

console.log(firstVertexShaderSource)

const VertexShaderPage = () => {
  return (
    <Layout>
      <SEO
        title="Basics Of A Vertex Shader"
        keywords={["vertex", "shader", "basics"]}
      />
      <h2>Basics Of A Vertex Shader</h2>
      <h3>What Is A Vertex Shader</h3>
      <p>
        Vertex shaders are a shader <em>stage</em> whose task is to handle
        processing individual vertices provided from a dataset to the shader.
        They are supposed to take a single 3D vertex and plot it onto the 2D
        plane that represents the screen, optionally, with a 3rd axis value
        which is used to signify it's depth value, which is stored in a buffer
        (called the Z-buffer or depth-buffer).
      </p>
      <p>
        Since this shader is executed per vertex on all vertexes passed to the
        shader pipeline, any operation that requires modifications to the vertex
        can be performed during this shader stage, as long as the final output
        is where the vertex is to be plotted in a 2D plane.
      </p>
      <h3>A Simple Example - A Triangle</h3>
      <p>Let's look at an example of a simple vertex shader below.</p>
      <VertexShaderFirstExample />
      <p>
        Here we can see for the provided set of vertex positions, a shape is
        drawn. The points on the canvas where the vertices are plotted on to are
        done so by the vertex shader.
      </p>
      <h4>How It Works</h4>
      <p> Let's look at the code for the vertex shader</p>
      <pre>{firstVertexShaderSource.trim()}</pre>
      <p>
        Even though this is WebGL (which is similar to OpenGL), the concepts
        applied in this vertex shader can be mapped across other languages as
        well. First, we have the <code>vertexPosition</code> attribute. This is
        the attribute that basically receives the initial vertex coordinates as
        it's primary input, the one that it should transform into a coordinate
        that can be plotted onto the screen. Do note that the type of it is set
        to <code>vec4</code>, which basically means it's a vector of size 4. Do
        note that vertices passed to the vertex shader need not be limited to
        just this type, but a <code>vec4</code> type would provide the most
        detail about a certain vertex.
      </p>
      <p>
        The <code>void main</code> function is the primary function that is
        executed when the vertex shader (and any shader for that matter) is to
        executed, and should contain the primary shader code to be executed.
        This is similar to C/C++, where the <code>main</code> function in the
        primary entry is the one that is executed when starting the application.
      </p>
      <p>
        Next we have the <code>modelMatrix</code>, <code>viewMatrix</code>, and{" "}
        <code>projectionMatrix</code> attributes, that are passed separately to
        the vertex shader. Unlike the <code>vertexPosition</code> attribute,
        where it actually is set to a single coordinate from a list of
        coordinates, the values passed to these two properties are shared as a
        whole to the vertex shader, and will always be the same value no matter
        what vertex you are currently operating on. This makes them useful for
        passing values that can be used to calculate the final vertex position,
        and are also why they are actually called uniforms (because they are
        values passed that are uniform throughout all vertex shader instances
        that are operating on separate vertices). Similar to the{" "}
        <code>vertexPosition</code> attribute, the types of these uniforms is{" "}
        <code>mat4</code>, which means a matrix of size 4x4. Again, they need
        not be limited to this type, and can be a matrix of size upto 4x4, or
        even a vector of size upto 4.
      </p>
      <p>A simple explanation of these uniforms is below:</p>
      <dl>
        <dt>
          <h5>modelMatrix</h5>
        </dt>
        <dd>
          This matrix is used to represent where the vertex exists within the
          world. It represents the center of the model being drawn by the
          shader, which has been translated, rotated, and/or scaled into the
          necessary position in the world. Multiplying the vertex coordinate
          with this matrix will provide the result of where the vertex exists in
          the world w.r.t. to the center of the model it belongs to.
        </dd>
        <dt>
          <h5>viewMatrix</h5>
        </dt>
        <dd>
          This matrix is used to represent where the vertex exists relative to
          the view (which is the camera/screen). Once the vertex position is
          known in the world (by multiplying it with the{" "}
          <code>modelMatrix</code>), it's position relative to the camera can be
          determined by multiplying it with this matrix.
        </dd>
        <dt>
          <h5>projectionMatrix</h5>
        </dt>
        <dd>
          This matrix is used to represent the projection of the view onto the
          camera. Since objects can overlap each other, and the size of objects
          can differ based on how far or how close they are to the camera, a
          calculation is required to determine how the perspective of the camera
          can affect the view to calculate the actual final coordinates of the
          vertices. By multiplying the projection matrix onto the result of the
          previous calculations, we are able to map the vertex onto the
          perspective of the camera, taking into account it's height, width,
          aspect ratio, the farthest it can see, and the closest it can see.
          This final calculation provides us the homogenous coordinates (where
          any vertex in view will have it's x, y, and z coordinate within the
          range of -1 to 1), which can then be used to plot that vertex onto the
          screen.
        </dd>
      </dl>
      <p>
        This is why the vertex shader performs the operation{" "}
        <code>
          gl_Position = projectionMatrix * viewMatrix * modelMatrix *
          vertexPosition;
        </code>
        . We take the vertex position and first multiply it with the model
        matrix to determine where that vertex lies w.r.t the center of the model
        in the world. This result is then multiplied with the view matrix to
        determine where the vertex is positioned w.r.t the camera, and finally
        that is multiplied with the projection matrix to determine where the
        vertex is located within the perspective of the camera. This final
        result is the output of the vertex shader, which, in WebGL, is stored in
        the special variable <code>gl_Position</code>.
      </p>
      <h3>Another Example - A Rotating Triangle</h3>
      <p>
        Since the vertex shader determines where each vertex is to be plotted on
        the screen, by passing it transformations to the vertices, it can move
        the positions of the vertices as needed. For example, with the below
        render:
      </p>
      <VertexShaderSecondExample />
      <h4>How It Works</h4>
      <p>
        By passing a <code>modelMatrix</code> that's rotated based on the
        current time, the vertex shader will rotate all the vertices by the set
        amount when rendering each frame. The <code>modelMatrix</code> is
        rotated because it is the matrix that represents the model as a whole,
        so transforming this matrix is akin to transforming the model (scale,
        rotation, and translation), and thereby every vertex of that model.
      </p>
      <p>
        The reason the model matrix rotation is done on the CPU is to avoid
        redundancy. Instead of having the vertex shader recalculate the rotation
        for every vertex every frame, the CPU can calculate it just once every
        frame and then pass it to the vertex shader to apply it.
      </p>
      <p>
        This principle can (and should) also be applied to the model, view, and
        projection matrices we multiply to the vertex. By multiplying all these
        3 matrices in advance on the CPU, and then passing to the vertex shader,
        we save on unnecessary calculations being done for every vertex every
        frame. Which means our vertex shader code should ideally look like this:
      </p>
      <pre>{secondVertexShaderSource.trim()}</pre>
      <h3>Summary</h3>
      <p>
        The vertex shader receives a vertex from a list of vertices and plots it
        onto the 2D screen, and optionally stating it's depth. Since the vertex
        determines where the vertex has to be plotted, it can manipulate and
        transform the vertex to be placed wherever required, as long as the
        correct transformation matrices are passed to the vertex shader which it
        will use to calculate the final coordinates of the vertex.
      </p>
      <PageChange
        previous="/basics/introduction/"
        next="/basics/fragment-shader/"
      />
    </Layout>
  )
}

export default VertexShaderPage
