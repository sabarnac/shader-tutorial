import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={["gpu", "shader", "tutorial"]} />
    <h2>Welcome!</h2>
    <p>
      The purpose of this website is to provide a simple understanding about the
      concept of GPU shaders, their purpose and function, types, and a look into
      how they work and can be used to perform a variety of operations that can
      create effects or perform certain actions that leverage the power of a
      GPU.
    </p>
    <p>
      The tutorials are designed to be simple, primarily on concepts and
      applications of such concepts, while being as language agnostic as
      possible. In cases where code will have to be shown, we will try to
      provide examples in pseudo-code, or in multiple shader languages.
    </p>
    <p>
      You can browse through the tutorial by clicking on the links in the
      sidebar.
    </p>
  </Layout>
)

export default IndexPage
