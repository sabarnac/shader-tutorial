import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import React, { useMemo } from "react"

import ImageManifest from "../../content/image-manifest.json"

const ImageQuery = graphql`
  query {
    imageMax: allFile(
      filter: { internal: { mediaType: { regex: "images/" } } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(quality: 100) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
    image960: allFile(
      filter: { internal: { mediaType: { regex: "images/" } } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(maxWidth: 960, quality: 100) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
    image768: allFile(
      filter: { internal: { mediaType: { regex: "images/" } } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(maxWidth: 768, quality: 100) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
    image600: allFile(
      filter: { internal: { mediaType: { regex: "images/" } } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(maxWidth: 600, quality: 100) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
    image480: allFile(
      filter: { internal: { mediaType: { regex: "images/" } } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(maxWidth: 480, quality: 100) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
    image50: allFile(
      filter: { internal: { mediaType: { regex: "images/" } } }
    ) {
      edges {
        node {
          relativePath
          childImageSharp {
            fluid(maxWidth: 50, quality: 100) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
  }
`

const Image = ({ src, style, ...props }) => {
  const { width: imageWidth, height: imageHeight } = ImageManifest[src]

  const {
    imageMax,
    image960,
    image768,
    image600,
    image480,
    image50,
  } = useStaticQuery(ImageQuery)

  const results = useMemo(() => [
    { width: 0, query: imageMax },
    { width: 960, query: image960 },
    { width: 768, query: image768 },
    { width: 600, query: image600 },
    { width: 480, query: image480 },
    { width: 50, query: image50 },
  ], [imageMax, image960, image768, image600, image480, image50]);

  const sources = useMemo(() => {
    const images = results
      .map(({ width, query: { edges } }) => ({
        width,
        node: edges.find(({ node }) => src === node.relativePath).node,
      }))
      .filter(result => !!result.node)
      .map((result, i) => ({
        ...result.node.childImageSharp.fluid,
        media: `(max-width: ${result.width}px)`,
      }))

    const uniqueImages = images.reduce(
      (info, image) => {
        return info.srcs.indexOf(image.src) !== -1
          ? info
          : {
              srcs: [...info.srcs, image.src],
              images: [...info.images, image],
            }
      },
      { srcs: [], images: [] }
    ).images

    uniqueImages[0].media = undefined

    return uniqueImages
  }, [results, src])

  return (
    <Img
      fluid={sources}
      width={imageWidth}
      height={imageHeight}
      loading="lazy"
      style={{
        margin: "0",
        width: imageWidth,
        display: "inline-block",
        ...style,
      }}
      {...props}
    />
  )
}

export default Image
