import React, { useCallback, useState } from "react";

const wrapExample = ExampleComponent => {
  return () => {
    const [hidden, setHidden] = useState(true)

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
        return () => observer.unobserve(div)
      }
    }, [])

    return hidden ? (
      <div
        style={{
          padding: "2rem",
          margin: "2rem 0",
          textAlign: "center",
          border: "1px solid #dddddd",
        }}
      >
        <a
          href="#"
          onClick={ev => {
            ev.preventDefault()
            setHidden(false)
          }}
        >
          Show example
        </a>
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
          <a
            href="#"
            onClick={ev => {
              ev.preventDefault()
              setHidden(true)
            }}
          >
            Hide example
          </a>
        </div>
      </div>
    )
  }
}

export default wrapExample
