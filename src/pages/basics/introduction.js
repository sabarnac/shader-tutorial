import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"

const IntroductionPage = () => (
  <Layout>
    <SEO title="Introduction" keywords={["shader", "introduction"]} />
    <h2>Introduction</h2>
    <h3>What is a shader?</h3>
    <p>
      A shader is a program that is primarily used to shade an image, generating
      color information while applying any lighting and darkening effects on
      that image.
    </p>
    <p>
      While shaders are still used for this purpose, they can now also be used
      to perform other types of graphical and compute tasks.
    </p>
    <p>
      Graphics cards didn't always support programmable shaders. Initially, GPUs
      would have a "fixed-function" pipeline, where one would call specific
      "function units", which could only perform specific actions on a provided
      set of data. This was later replaced with the current shading system used
      by most GPUs today.
    </p>
    <h3>What are the different types of shaders?</h3>
    <p>
      There are two shaders that are primarily used when rendering 2D/3D
      applications:
    </p>
    <ul>
      <li>Vertex Shader</li>
      <li>Fragment Shader</li>
    </ul>
    <p>
      Along with these, there are other kinds of shaders that can be used to
      perform certain other specific tasks:
    </p>
    <ul>
      <li>Tessellation Shaders</li>
      <li>Geometry Shader</li>
      <li>Compute Shader</li>
    </ul>
    <p>
      Compute shaders can be used for both general purpose GPU (GPGPU) as well
      as for rendering applications.
    </p>
    <p>
      A visual overview of what a GPU rendering pipeline looks like is shown
      below:
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
      <em>
        Note: Compute shaders aren't present in the image because they are not
        part of the standard GPU rendering pipeline. However, they *can* be used
        as an intermediate step at any point in the pipeline.
      </em>
    </p>
    <p>
      An overview of the rendering pipeline can be read from{" "}
      <a
        href="https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      .
    </p>
    <p>
      Currently, all shaders work under the{" "}
      <a
        href="https://en.wikipedia.org/wiki/Unified_shader_model"
        target="_blank"
        rel="noopener noreferrer"
      >
        Unified Shader Model
      </a>
      , where every shader type is practically the same in the functions and
      APIs they have access to. This makes them simpler to implement in hardware
      and easy to program in software as well.
    </p>
    <h3>What do I need to know before getting started?</h3>
    <p>
      A beginner understanding of matrix and vector math will be helpful when
      going through this tutorial. A recommendation is to go through{" "}
      <a
        href="https://opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/"
        target="_blank"
        rel="noopener noreferrer"
      >
        this chapter
      </a>{" "}
      of{" "}
      <a
        href="https://opengl-tutorial.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        OpenGL Tutorial
      </a>{" "}
      (and previous ones if you need a better understanding of what has happened
      before) to learn about the necessary maths behind it.
    </p>
    <p>
      Even if you have a basic understanding of the maths, it is still
      recommended to go through it since it provides important contextual
      information that will be useful throughout the tutorial. As stated in that
      chapter, that information is extremely important and you will have to burn
      it into your head.
    </p>
    <p>
      As an added bonus, if you ever wanted an introduction to OpenGL
      programming, that website is a great start.
    </p>
    <PageChange next="/basics/vertex-shader/" />
  </Layout>
)

export default IntroductionPage
