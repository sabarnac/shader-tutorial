import React from "react";

import Content from "../../components/content";
import GlslCodeHighlight from "../../components/glsl-code-highlight";
import SpecularMappingFirstExample from "../../components/intermediates/specular-mapping/first-example";
import { firstFragmentShaderSource, firstVertexShaderSource } from "../../components/intermediates/specular-mapping/first-example-shaders";
import Layout from "../../components/layout";
import PageChange from "../../components/page-change";
import SEO from "../../components/seo";
import normalTexture from "../../images/intermediates/normal.png";
import specularTexture from "../../images/intermediates/specular.png";
import texture from "../../images/intermediates/texture-2.png";

const SpecularMappingPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Intermediates - Specular Mapping"
      description="A look into the how specular map textures are used to enhance specular lighting detail to objects."
      keywords={["specular", "mapping", "texturing", "shader", "intermediates"]}
    />
    <Content>
      <h2>Shader Intermediates - Specular Mapping</h2>
      <h3>Example - Stone wall</h3>
      <p className="util text-center">
        <img
          alt="Stone Wall - Color Map"
          style={{ width: "65%" }}
          src={texture}
        />
        <br />
        Color/Diffuse map
      </p>
      <p className="util text-center">
        <img
          alt="Stone Wall - Normal Map"
          style={{ width: "65%" }}
          src={normalTexture}
        />
        <br />
        Normal map
      </p>
      <p className="util text-center">
        <img
          alt="Stone Wall - Specular Map"
          style={{ width: "65%" }}
          src={specularTexture}
        />
        <br />
        Specular map
      </p>
      <SpecularMappingFirstExample />
      <GlslCodeHighlight
        code={firstVertexShaderSource.trim()}
        type={"Vertex"}
      />
      <GlslCodeHighlight
        code={firstFragmentShaderSource.trim()}
        type={"Fragment"}
      />
      <h3>Summary</h3>
      <ul></ul>
    </Content>
    <PageChange previous="/intermediates/normal-mapping/" />
  </Layout>
)

export default SpecularMappingPage
