import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { Link, withPrefix } from "gatsby"
import VertexShaderFirstExample from "../../components/basics/vertex-shader/first-example"
import { vertexShaderSource } from "../../components/basics/vertex-shader/first-example-shaders"

const VertexShaderPage = () => {
  return (
    <Layout>
      <SEO
        title="Basics Of A Vertex Shader"
        keywords={["vertex", "shader", "basics"]}
      />
      <h2>Basics Of A Vertex Shader</h2>
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
      <p>Let's look at an example of a simple vertex shader below.</p>
      <VertexShaderFirstExample />
      <p>
        Here we can see for the provided set of vertex positions, a shape is
        drawn. The points on the canvas where the vertices are plotted on to are
        done so by the vertex shader.
      </p>
      <p> Let's look at the code for the vertex shader</p>
      <pre>{vertexShaderSource.trim()}</pre>
      <p>
        Even though this is WebGL (which is similar in terms of flow and
        function to OpenGL), the concepts applied in this vertex shader can be
        mapped across other languages as well. First, we have the{" "}
        <code>vertexPosition</code> attribute. This is the attribute that
        basically receives the initial vertex coordinates as it's primary input,
        the one that it should transform into a coordinate that can be plotted
        onto the screen. Do note that the type of it is set to <code>vec4</code>
        , which basically means it's a vector of size 4. Do note that vertices
        passed to the vertex shader need not be limited to just this type, but a{" "}
        <code>vec4</code> type would provide the most detail about a certain
        vertex.
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
          <h4>modelMatrix</h4>
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
          <h4>viewMatrix</h4>
        </dt>
        <dd>
          This matrix is used to represent where the vertex exists relative to
          the view (which is the camera/screen). Once the vertex position is
          known in the world (by multiplying it with the{" "}
          <code>modelMatrix</code>), it's position relative to the camera can be
          determined by multiplying it with this matrix.
        </dd>
        <dt>
          <h4>projectionMatrix</h4>
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
      <p>
        <Link to="/basics/fragment-shader/">Go To Next Chapter.</Link>
      </p>
      <script src={withPrefix("/scripts/basics/vertex-shader-example.js")} />
    </Layout>
  )
}

export default VertexShaderPage
