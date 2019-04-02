import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import { Link } from "gatsby"

const BasicsIndexPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Basics - Content"
      description="Table of Contents for the Shader Basics section."
      keywords={["shader", "basics", "content"]}
    />
    <Content>
      <h2>Table of Contents</h2>
      <ul className="toc">
        <li>
          <Link to="/basics/introduction/">Shader Basics - Introduction</Link>
        </li>
        <li>
          <Link to="/basics/render-pipeline/">
            Shader Basics - The GPU Render Pipeline
          </Link>
        </li>
        <li>
          <Link to="/basics/vertex-shader/">Shader Basics - Vertex Shader</Link>
        </li>
        <li>
          <Link to="/basics/fragment-shader">
            Shader Basics - Fragment Shader
          </Link>
        </li>
        <li>
          <Link to="/basics/texturing-branching">
            Shader Basics - Texturing And Branching
          </Link>
        </li>
        <li>
          <Link to="/basics/lighting">Shader Basics - Lighting</Link>
        </li>
      </ul>
    </Content>
  </Layout>
)

export default BasicsIndexPage