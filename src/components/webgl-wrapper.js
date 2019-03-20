import { mat4 } from "gl-matrix"

export default class WebGlWrapper {
  _isSupported = false
  _canvas = null
  _canvasDimensions = {
    width: 0,
    height: 0,
    aspect: 1.0,
    fov: (45 * Math.PI) / 180,
    zNear: 0.1,
    zFar: 100.0,
  }
  _projectionMatrix = mat4.create()
  _viewMatrix = mat4.create()
  _modelMatrix = mat4.create()

  constructor(canvas, triangleModelPosition) {
    this._canvas = canvas
    this._canvasDimensions = {
      ...this._canvasDimensions,
      width: this._canvas.width,
      height: this._canvas.height,
      aspect: this._canvas.width / this._canvas.height,
    }

    this._webgl = this._canvas.getContext("webgl")
    if (this._webgl === null) {
      this._isSupported = false
      this._showNotSupported()
    }
    this._isSupported = true

    this._startSetup(triangleModelPosition)
  }

  _showNotSupported = () => {
    console.error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    )
    const ctx = this._canvas.getContext("2d")
    if (ctx === null) {
      const x = this._canvasDimensions.width / 2
      const y = this._canvasDimensions.height / 2
      ctx.font = "24px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("WebGL not supported", x, y)
      ctx.fillText("Please use a browser that supports WebGL", x, y + 25)
    }
  }

  _startSetup = triangleModelPosition => {
    this._webgl.clearColor(0.0, 0.0, 0.0, 1.0)
    this._webgl.clearDepth(1.0)
    this._webgl.clear(
      this._webgl.COLOR_BUFFER_BIT | this._webgl.DEPTH_BUFFER_BIT
    )

    this._webgl.depthFunc(this._webgl.LEQUAL)
    this._canvasDimensions.aspect =
      this._webgl.canvas.clientWidth / this._webgl.canvas.clientHeight

    const { fov, aspect, zNear, zFar } = this._canvasDimensions

    mat4.perspective(this._projectionMatrix, fov, aspect, zNear, zFar)
    mat4.lookAt(
      this._viewMatrix,
      [0.0, 0.0, 5.0],
      [0.0, 0.0, 0.0],
      [0.0, 1.0, 0.0]
    )
    mat4.translate(this._modelMatrix, triangleModelPosition, [0.0, 0.0, 0.0])
  }

  _loadShaderSource = (shaderType, shaderSource) => {
    const shader = this._webgl.createShader(shaderType)
    this._webgl.shaderSource(shader, shaderSource)
    this._webgl.compileShader(shader)

    if (!this._webgl.getShaderParameter(shader, this._webgl.COMPILE_STATUS)) {
      console.error(
        `An error occurred compiling the shaders: ${this._webgl.getShaderInfoLog(
          shader
        )}`
      )
      this._webgl.deleteShader(shader)
      return null
    }

    return shader
  }

  get isSupported() {
    return this._isSupported
  }

  createShaderProgram = (vertexShaderSource, fragmentShaderSource) => {
    const vertexShader = this._loadShaderSource(
      this._webgl.VERTEX_SHADER,
      vertexShaderSource
    )
    const fragmentShader = this._loadShaderSource(
      this._webgl.FRAGMENT_SHADER,
      fragmentShaderSource
    )

    if (vertexShader === null || fragmentShader === null) {
      return null
    }

    const shaderProgram = this._webgl.createProgram()
    this._webgl.attachShader(shaderProgram, vertexShader)
    this._webgl.attachShader(shaderProgram, fragmentShader)
    this._webgl.linkProgram(shaderProgram)

    if (
      !this._webgl.getProgramParameter(shaderProgram, this._webgl.LINK_STATUS)
    ) {
      console.error(
        `Unable to initialize the shader program: ${this._webgl.getProgramInfoLog(
          shaderProgram
        )}`
      )
      return null
    }

    return shaderProgram
  }

  getDataLocations = (shaderProgram, programInfo) => {
    const dataLocation = {}
    for (let type in programInfo) {
      const locationDetails = programInfo[type]

      dataLocation[type] = {
        attributeLocations: {},
        uniformLocations: {},
      }

      for (let dataAttribute in locationDetails.attributeLocations) {
        dataLocation[type].attributeLocations[
          dataAttribute
        ] = this._webgl.getAttribLocation(shaderProgram, dataAttribute)
      }

      for (let dataAttribute in locationDetails.uniformLocations) {
        dataLocation[type].uniformLocations[
          dataAttribute
        ] = this._webgl.getUniformLocation(shaderProgram, dataAttribute)
      }
    }

    return dataLocation
  }

  createStaticDrawArrayBuffer = (bufferData, buffer) => {
    if (buffer === null) {
      buffer = this._webgl.createBuffer()
    }

    this._webgl.bindBuffer(this._webgl.ARRAY_BUFFER, buffer)
    this._webgl.bufferData(
      this._webgl.ARRAY_BUFFER,
      new Float32Array(bufferData),
      this._webgl.STATIC_DRAW
    )

    this._webgl.bindBuffer(this._webgl.ARRAY_BUFFER, null)

    return buffer
  }

  renderScene = renderer => {
    const renderInfo = {
      gl: this._webgl,
      projectionMatrix: this._projectionMatrix,
      viewMatrix: this._viewMatrix,
      modelMatrix: this._modelMatrix,
    }
    renderer(renderInfo)
  }

  destroy = () => {
    this._canvas = null
    this._canvasDimensions = {
      width: 0,
      height: 0,
      aspect: 1.0,
      fov: (45 * Math.PI) / 180,
      zNear: 0.1,
      zFar: 100.0,
    }
    this._webgl = null
    this._isSupported = false
  }
}
