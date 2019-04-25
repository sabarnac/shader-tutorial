import React from "react"

import Layout from "../components/layout"
import Content from "../components/content"
import SEO from "../components/seo"
import { Link } from "gatsby"

const IndexPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Home"
      keywords={["gpu", "shader", "tutorial"]}
    />
    <Content>
      <h2>Welcome!</h2>
      <p>
        The purpose of this website is to provide a simple understanding about
        the concept of GPU shaders, their types, purpose, and how they work and
        can be used to perform a variety of operations that can create effects
        or perform certain actions that leverage the power of a GPU.
      </p>
      <p>
        The tutorials are supposed to provide an understanding on the concepts
        and functions of GPU shaders, while keeping things relatively simple and
        as language agnostic as possible.
      </p>
      <p>
        Do note that this tutorial was written from the perspective of 3D
        graphics. The concepts taught can still be used in other areas, and
        content may be updated to make the target application more general.
      </p>
      <p>
        You can browse through the tutorial by clicking on the links in the
        sidebar, or start from <Link to="/basics/introduction/">here</Link>.
      </p>
    </Content>
  </Layout>
)

export default IndexPage
