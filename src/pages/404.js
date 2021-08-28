import React from "react"

import Content from "../components/content"
import Heading from "../components/heading"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = ({ location: { pathname } }) => (
  <Layout>
    <Seo
      pathname={pathname}
      title="Page Not Found"
      description="The page you are looking for does not exist."
      keywords={["not", "found"]}
    />
    <Content>
      <Heading type="h2">Page Not Found</Heading>
      <p>The page you requested for doesn't seem to exist.</p>
    </Content>
  </Layout>
)

export default IndexPage
