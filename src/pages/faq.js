import React from "react"

import Layout from "../components/layout"
import Content from "../components/content"
import SEO from "../components/seo"

const FaqPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="FAQ"
      keywords={[
        "gpu",
        "shader",
        "tutorial",
        "faq",
        "frequently",
        "asked",
        "questions",
      ]}
    />
    <Content>
      <h2>FAQ</h2>
      <dl className="faq-list">
        <dt>How can one contact you with regards to the website?</dt>
        <dd>
          <p>
            If you have anything you wish to say related to the website
            (feedback, issues, improvements, questions), feel free to open up an
            issue at the{" "}
            <a
              href="https://github.com/sabarnac/shader-tutorial/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>
        </dd>
        <dt>How can I run these GPU shader code snippets?</dt>
        <dd>
          <p>
            There are multiple GPU shader sandbox websites available, like{" "}
            <a
              href="http://shadertoy.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shadertoy
            </a>{" "}
            where you can run these examples. Some modifications may be required
            to be made depending on which website you choose to use, but as long
            as the concepts taught are applied properly, you should see proper
            results.
          </p>
          <p>
            There are plans to{" "}
            <a
              href="https://github.com/sabarnac/shader-tutorial/issues/9"
              target="_blank"
              rel="noopener noreferrer"
            >
              add links below the examples to shader sandbox websites
            </a>{" "}
            to allow users to experiment with the code shown.
          </p>
        </dd>
        <dt>Why was GLSL chosen as the language to teach the concepts with?</dt>
        <dd>
          <p>
            The procedural nature and the syntax of the language make it easy to
            explain concepts efficiently. This also allows the concepts shown
            through the language to be transplated into other languages with
            relative ease, since the procedural nature of the code is very easy
            to convert into other programming language paradigms.
          </p>
          <p>
            This may seem to go against goal of being language agnostic since
            only one language is used, but the tutorial focuses on the concepts
            shown within the code written in that language, which does allow the
            tutorial to be language agnostic.
          </p>
          <p>
            However, there are plans to{" "}
            <a
              href="https://github.com/sabarnac/shader-tutorial/issues/2"
              target="_blank"
              rel="noopener noreferrer"
            >
              add in code snippets in other languages
            </a>
            that are hidden by default, and can be viewed by clicking a link
            that reveals them.
          </p>
        </dd>
        <dt>
          Do you have references for where one can learn about programming using
          graphics APIs in general?
        </dt>
        <dd>
          <p>
            The site where I personally first started learning about graphics
            API programming (OpenGL to be specific) was{" "}
            <a
              href="https://www.opengl-tutorial.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenGL Tutorial
            </a>
            , which has been referenced multiple times in this website.
          </p>
          <p>
            The{" "}
            <a
              href="https://www.glprogramming.com/red/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenGL Red Handbook
            </a>
            , as well as{" "}
            <a
              href="https://learnopengl.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn OpenGL
            </a>{" "}
            are other good sources for learning OpenGL and GLSL programming.
          </p>
          <p>
            I currently do not have any sources for DirectX and HLSL
            programming, but I will update this section when I do find reliable
            ones.
          </p>
        </dd>
        <dt>Are all the materials shown on the website your own?</dt>
        <dd>
          <p>
            No, not all of the materials shown are owned by me. Some are sourced
            from other areas, which I do try to provide a link or reference to.
          </p>
          <p>
            If you find any material that is not owned by me and is not properly
            linked to the source, open an issue at the{" "}
            <a
              href="https://github.com/sabarnac/shader-tutorial/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>
        </dd>
      </dl>
    </Content>
  </Layout>
)

export default FaqPage
