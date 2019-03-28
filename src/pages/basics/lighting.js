import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import LightingNoLightExample from "../../components/basics/lighting/no-light-example.js"
import LightingFirstExample from "../../components/basics/lighting/first-example"
import LightingSecondExample from "../../components/basics/lighting/second-example"
import LightingThirdExample from "../../components/basics/lighting/third-example"
import LightingFourthExample from "../../components/basics/lighting/fourth-example"
import LightingIssueExample from "../../components/basics/lighting/issue-example"

const ShaderTexturingPage = () => {
  return (
    <Layout>
      <SEO
        title="Shader Basics - Lighting"
        keywords={[
          "lighting",
          "shader",
          "basics",
          "diffuse",
          "specular",
          "ambient",
        ]}
      />
      <h2>Shader Basics - Lighting</h2>
      <p>
        While adding textures to color your objects helps to add more detail,
        simulating the lighting of the environment on the object adds further
        detail and makes it appear in place with the rest of the world.
      </p>
      <p>
        There are primarily components of lighting that come into effect when
        simulating light falling on an object:
      </p>
      <ul>
        <li>The diffuse component</li>
        <li>The ambient component</li>
        <li>The specular component</li>
      </ul>
      <p>
        The{" "}
        <a
          href="https://www.opengl-tutorial.org/beginners-tutorials/tutorial-8-basic-shading/"
          rel="noopener noreferrer"
          target="_blank"
        >
          following chapter
        </a>{" "}
        of the{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          rel="noopener noreferrer"
          target="_blank"
        >
          OpenGL Tutorial
        </a>
      </p>
      <p>
        Let's look at each component, and how they effect the look of the object
        when simulating lighting.
      </p>
      <p>
        But before that, let's look at how the cube appears with no lighting for
        reference.
      </p>
      <LightingNoLightExample />
      <h3>The Diffuse Component</h3>
      <LightingFirstExample />
      <LightingSecondExample />
      <LightingThirdExample />
      <LightingIssueExample />
      <LightingFourthExample />
      <PageChange previous="/basics/texturing-branching/" />
    </Layout>
  )
}

export default ShaderTexturingPage
