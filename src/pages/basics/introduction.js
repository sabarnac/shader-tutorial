import React from "react"

import Content from "../../components/content"
import Heading from "../../components/heading"
import Layout from "../../components/layout"
import PageChange from "../../components/page-change"
import Seo from "../../components/seo"

const IntroductionPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Shader Basics - Introduction"
      description="An introduction to GPU shaders and general information on them."
      keywords={["shader", "basics", "introduction"]}
    />
    <Content>
      <h1>Shader Basics - Introduction</h1>
      <Heading type="h2">What is a shader?</Heading>
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
      <Heading type="h2">Where are shaders used?</Heading>
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
      <Heading type="h2">
        Can shaders only be used for visual effects and rendering?
      </Heading>
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
        have the result stored in a grayscale image that can go from 0 (black)
        to 256 (white).
      </p>
      <p>
        Sometimes this is even done on normal data just to visualize how it
        looks as an image, since certain data drawn out can bring out certain
        patterns that may not necessarily be obvious.
      </p>
      <Heading type="h2">
        What do I need to know before getting started?
      </Heading>
      <p>
        You will need to have a basic understanding of vector math, matrix math,
        and trignometry. Any other pre-requisite will have links or explanations
        provided before it is used.
      </p>
    </Content>
    <PageChange next="/basics/render-pipeline/" />
  </Layout>
)

export default IntroductionPage
