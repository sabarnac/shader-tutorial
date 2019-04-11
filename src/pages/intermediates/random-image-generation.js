import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import RandomImageGenerationFirstExample from "../../components/intermediates/random-image-generation/first-example"
import RandomImageGenerationSecondExample from "../../components/intermediates/random-image-generation/second-example"

const TexturingBranchingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Random Image Generation"
      description="A look into the how images can be generated using noise combined with certain algorithms."
      keywords={[
        "random",
        "image",
        "generation",
        "noise",
        "shader",
        "intermediates",
      ]}
    />
    <Content>
      <h2>Shader Intermediates - Random Image Generation</h2>
      <RandomImageGenerationFirstExample />
      <RandomImageGenerationSecondExample />
      <p>
        Looking at the fragment shader code, there is an addition of a new
        function called <code>random</code>. This function generates a random
        number between 0 and 1 using a given 2D coordinate, which means it
        produces the same random number for the same coordinate.
      </p>
      <p>
        <em>
          Note: This random number generator function was taken from{" "}
          <a
            href="https://github.com/PistonDevelopers/shaders/wiki/Some-useful-GLSL-functions"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          . There are many other useful GLSL functions available there, and
          functions of similar functionality can be found for other shading
          languages.
        </em>
      </p>
      <h3>Summary</h3>
    </Content>
    <PageChange
      previous="/intermediates/texturing-branching/"
      next="/intermediates/lighting-dithering/"
    />
  </Layout>
)

export default TexturingBranchingPage
