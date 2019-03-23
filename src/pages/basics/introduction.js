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
      color information while applying any lighting effects on
      said image.
    </p>
    <p>
      While shaders are mainly used for this purpose, they can now also be used
      to perform other types of computational tasks.
    </p>
    <p>
      Initally, graphics cards (GPUs) didn't support programmable shaders. Initially, GPUs
      would have a fixed-function pipeline(where one would call specific units),
      which could only perform specific actions. 
    </p>
    <p>  
      This was later replaced with the current shading system used today.
    </p>
    <h3>What are the different types of shaders?</h3>
    <p>
      There are two shaders that are primarily used when rendering 2D/3D
      applications:
    </p>
    <ul>
      <li>Vertex Shader: (Needs some detail)</li>
      <li>Fragment Shader: (Needs some detail)</li>
    </ul>
    <p>
      Along with these, there are other kinds of shaders that can be used to
      perform certain other specific tasks:
    </p>
    <ul>
      <li>Tessellation Shaders: (Needs some detail)</li>
      <li>Geometry Shader: (Needs some detail)</li>
      <li>Compute Shader: (Needs some detail)</li>
    </ul>

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
        Note: Compute shaders aren't present in the image as they are not
        part of the standard GPU rendering pipeline, however, they *can* be used
        as an intermediate step at any point. 
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
      , where every shader type is practically the same. 
      This makes them simpler to implement in hardware and easy to program in software as well.
    </p>
    <h3>What do I need to know before getting started?</h3>
    <p>
      (Make this a list)A beginner understanding of matrix and vector math will be helpful when
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
      Side note; if you ever wanted an introduction to OpenGL
      programming, that website is a great start.
    </p>
    <PageChange next="/basics/vertex-shader/" />
  </Layout>
)

export default IntroductionPage
