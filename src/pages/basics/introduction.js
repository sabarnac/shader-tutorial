import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const IntroductionPage = () => (
  <Layout>
    <SEO
      title="Shader Basics - Introduction"
      description="An introduction to GPU shaders and general information on them."
      keywords={["shader", "basics", "introduction"]}
    />
    <Content>
      <h2>Shader Basics - Introduction</h2>
      <h3>What is a shader?</h3>
      <p>
        A shader is a program that is primarily used to shade an image,
        generating color information while applying any lighting effects on said
        image.
      </p>
      <p>
        While shaders are mainly used for this purpose, they can now also be
        used to perform other types of computational tasks.
      </p>
      <p>
        Initally, graphics cards (GPUs) didn't support programmable shaders.
        GPUs would have a fixed-function pipeline (where one would call specific
        units), which could only perform specific actions.
      </p>
      <p>This was later replaced with the current shading system used today.</p>
      <h3>Where are shaders used?</h3>
      <p>They can be used in a lot of areas:</p>
      <ul>
        <li>Rendering video games.</li>
        <li>
          Creating neat{" "}
          <a
            href="https://www.shadertoy.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            visual effects
          </a>
          .
        </li>
        <li>Post-processing videos.</li>
      </ul>
      <p>They can be used to:</p>
      <ul>
        <li>
          Change hue, saturation, brightness, and/or contrast of an image.
        </li>
        <li>
          Produce effects like bloom, volumetric lighting, bokeh, cel shading.
        </li>
        <li>Perform edge-detection, motion-detection.</li>
        <li>Create even cool psychedelic effects.</li>
        <li>And much, much more.</li>
      </ul>
      <h3>Can shaders only be used for visual effects and rendering?</h3>
      <p>
        No, they can be used for other areas too. If you've ever heard of
        machine learning, you might be interested to know that they can be
        trained on GPUs. Machine learning models can run on the GPU using a
        certain type of shader.
      </p>
      <p>
        Considering the GPU is like a simple CPU with a lot of cores that can do
        some complicated math very fast, machine learning systems can run a
        thousand scenarios and improve themselves relatively quickly compared to
        if they ran on the CPU.
      </p>
      <p>
        There are also cases where you don't need to render an image, but there
        is a lot of parallel operations you want to run and the results of them
        can be stored in an image.
      </p>
      <p>
        For example, if you needed to perform a particular calculation on a 1000
        input values, and the output values will always be within a specific
        range (like 0 to 256), then you can run the calculation on the GPU, and
        have the result stored in a gray-scale image that can go from 0 (black)
        to 256 (white).
      </p>
      <p>
        Sometimes this is even done on normal data just to visualize how it
        looks as an image, since certain data drawn out can bring out certain
        patterns that may not necessarily be obvious.
      </p>
      <h3>What do I need to know before getting started?</h3>
      <p>
        Go through{" "}
        <a
          href="https://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/"
          target="_blank"
          rel="noopener noreferrer"
        >
          this chapter
        </a>{" "}
        of{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenGL Tutorial
        </a>{" "}
        to learn about the necessary details vector and matrix math, even if you
        have an understanding of it. This knowledge is vital as it provides a
        base for understanding all the math that'll be used later on.
      </p>
      <p>
        Side note: If you ever wanted an introduction to OpenGL programming,
        that website is a great start.
      </p>
    </Content>
    <PageChange next="/basics/render-pipeline/" />
  </Layout>
)

export default IntroductionPage
