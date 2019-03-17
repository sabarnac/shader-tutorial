module.exports = {
  siteMetadata: {
    title: `GPU Shader Tutorial`,
    description: `Learn about GPU shaders in a simple, relatively easy-to-digest format.`,
    author: `@disappointin_af`,
  },
  pathPrefix: "/shader-tutorial",
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/shader-tutorial/`,
        background_color: `#000000`,
        theme_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
}
