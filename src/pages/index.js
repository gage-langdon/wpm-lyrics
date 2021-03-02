import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import WpmGame from "../components/wpm-game"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <WpmGame />
  </Layout>
)

export default IndexPage
