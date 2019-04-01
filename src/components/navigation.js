import { Link } from "gatsby"
import React from "react"

const Navigation = () => (
  <nav>
    <ul>
      <li className="skip-nav">
        <a href="#main">
          <small>Skip Navigation</small>
        </a>
      </li>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <Link to="/basics/">Basics</Link>
        <ul>
          <li>
            <Link to="/basics/introduction/">Introduction</Link>
          </li>
          <li>
            <Link to="/basics/render-pipeline/">Render Pipeline</Link>
          </li>
          <li>
            <Link to="/basics/vertex-shader/">Vertex Shader</Link>
          </li>
          <li>
            <Link to="/basics/fragment-shader">Fragment Shader</Link>
          </li>
          <li>
            <Link to="/basics/texturing-branching">
              Texturing And Branching
            </Link>
          </li>
          <li>
            <Link to="/basics/lighting">Lighting</Link>
          </li>
        </ul>
      </li>
      <li>
        <hr />
      </li>
      <li>
        <Link to="/faq">FAQ</Link>
      </li>
    </ul>
  </nav>
)

export default Navigation
