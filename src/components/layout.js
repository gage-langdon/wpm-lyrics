/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"
import "@fontsource/pt-mono"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div
      style={{
        backgroundColor: "#3d405b",
        color: "#f4f1de",
        fontFamily: "PT Mono",
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0 1.0875rem 1.45rem`,
        }}
      >
        {/* <div>
          <h1>WPM</h1>
          <h2>Learn to type while singing your favorite songs</h2>
        </div> */}
        <main>{children}</main>
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <a
            href="https://gage-langdon.com"
            style={{
              marginLeft: "auto",
              color: "white",
              opacity: ".40",
              textDecoration: "none",
            }}
          >
            @gage-langdon
          </a>
        </div>
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
