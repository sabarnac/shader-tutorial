import React, { useEffect, useRef, useState } from "react"

const wrapExample = (ExampleComponent) => {
  return () => {
    const [hidden, setHidden] = useState(false)
    const [height, setHeight] = useState(480)

    useEffect(() => {
      setHidden(true)
    }, [])

    const divRef = useRef()
    useEffect(() => {
      if (divRef.current !== null) {
        const div = divRef.current
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              setHidden(true)
            }
          })
        })
        observer.observe(div)
        setHeight(div.getBoundingClientRect().height)

        return () => observer.unobserve(div)
      }
    }, [divRef])

    return hidden ? (
      <div
        style={{
          padding: "2rem",
          margin: "2rem 0",
          border: "1px dashed #dddddd",
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
          border: "1px dashed #dddddd",
        }}
        ref={divRef}
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
