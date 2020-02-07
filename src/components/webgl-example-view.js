import React, { useCallback, useEffect, useState } from "react";

const wrapExample = ExampleComponent => {
  return () => {
    const [hidden, setHidden] = useState(false)
    const [height, setHeight] = useState(480)

    useEffect(() => {
      setHidden(true)
    }, [])

    const exampleRef = useCallback(div => {
      if (div !== null) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              setHidden(true)
            }
          })
        })
        observer.observe(div)
        setHeight(div.getBoundingClientRect().height)

        return () => observer.unobserve(div)
      }
    }, [])

    return hidden ? (
      <div
        style={{
          padding: "2rem",
          margin: "2rem 0",
          border: "1px solid #dddddd",
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          className="example-view-link"
          onClick={() => {
            setHidden(false)
          }}
        >
          Show example
        </button>
      </div>
    ) : (
      <div
        style={{
          padding: "2rem",
          margin: "2rem 0",
          border: "1px solid #dddddd",
        }}
        ref={exampleRef}
      >
        <ExampleComponent />
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <button
            className="example-view-link"
            onClick={() => {
              setHidden(true)
            }}
          >
            Hide example
          </button>
        </div>
      </div>
    )
  }
}

export default wrapExample
