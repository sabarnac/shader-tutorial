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
      A shader is basically a program that is primarily used to shade an image,
      generating color information while applying any lighting and darkening
      effects on that image.
    </p>
    <p>
      While shaders are still used for this purpose, they can now also be used
      to perform other types of graphical and compute tasks.
    </p>
    <p>
      Graphics cards didn't always support programmable shaders. Initially, GPUs
      would have a fixed-function pipeline, where one would call specific "fixed
      function units", which could only perform specific actions on a provided
      set of data. This was later taken over by the current system of shaders
      used today.
    </p>
    <h3>What Types of shaders are there?</h3>
    <p>
      There are two primary shaders that are always used when rendering 2D/3D
      applications:
    </p>
    <ol>
      <li>Vertex Shader</li>
      <li>Fragment Shader</li>
    </ol>
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
      The rendering pipeline using all the stated shaders is visualized below:
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
        Note: Compute shaders aren't present in the pipeline image because they
        are not part of the standard GPU pipeline workflow. However, they *can*
        be used as an intermediate step at any point in the pipeline.
      </em>
    </p>
    <p>
      An overview of the rendering pipeline can be read about{" "}
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
      APIs they have access to, with the main differences between them being
      code implementation specific (what that shader specifically does and when
      it is executed). This makes them simpler to implement in hardware and easy
      to program in software as well.
    </p>
    <h3>Why are shaders necessary?</h3>
    <p>
      Fixed-function pipelines do have the benefit of being very fast, since
      they have dedicated hardware for each function unit to execute their
      tasks. However, this limits what can be done to shade an image, and also
      there is a limit of how many fixed function units you can build into a
      GPU.
    </p>
    <p>
      Providing a programmable system where a programmer can decide how an image
      should be shaded allows programmers more freedom, while also reducing
      hardware requirements, since a single programmable unit can perform the
      function of any fixed function units.
    </p>
    <h3>What do I need to know before getting started?</h3>
    <p>
      A beginner understanding of matrix and vector math will be helpful when
      going through this tutorial. A recommendation is to go through{" "}
      <a
        href="https://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/"
        target="_blank"
        rel="noopener noreferrer"
      >
        this chapter
      </a>{" "}
      of OpenGL Tutorial (and previous ones if you need a better understanding
      of what has happened before) to learn about the necessary maths behind it.
      Even if you have a basic understanding of the maths, it is still
      recommended to go through it since it provides important contextual
      information that will be useful throughout the tutorial. As stated in that
      chapter, that information is extremely important and you will have to burn
      it into your head.
    </p>
    <p>
      As an added bonus, if you ever wanted to an introduction to OpenGL
      programming, that website is a great start.
    </p>
    <PageChange next="/basics/vertex-shader/" />
  </Layout>
)

export default IntroductionPage
