import { vec2, mat4 } from "gl-matrix"

export default class WebGlWrapper {
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
  _orthoMatrix = mat4.create()
  _viewMatrix = mat4.create()
  _modelMatrix = mat4.create()

  constructor(canvas, modelPosition, disableDepth = false) {
    this._canvas = canvas
    this._canvasDimensions = {
      ...this._canvasDimensions,
      width: this._canvas.width,
      height: this._canvas.height,
      aspect: this._canvas.width / this._canvas.height,
    }

    this._webgl =
      this._canvas.getContext("webgl") ||
      this._canvas.getContext("experimental-webgl")
    if (this._webgl === null) {
      this._showNotSupported()
    }

    this._startSetup(modelPosition, disableDepth)
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

  _startSetup = (modelPosition, disableDepth) => {
    if (!disableDepth) {
      this._webgl.enable(this._webgl.DEPTH_TEST)
      this._webgl.depthFunc(this._webgl.LEQUAL)
    } else {
      this._webgl.disable(this._webgl.DEPTH_TEST)
      this._webgl.depthMask(false)
    }

    if (disableDepth) {
      this._webgl.enable(this._webgl.BLEND)
      this._webgl.blendFunc(
        this._webgl.SRC_ALPHA,
        this._webgl.ONE_MINUS_SRC_ALPHA
      )
    }

    this._clearScreen()

    this._canvasDimensions.aspect =
      this._webgl.canvas.clientWidth / this._webgl.canvas.clientHeight

    const { fov, aspect, zNear, zFar } = this._canvasDimensions

    mat4.ortho(this._orthoMatrix, -2 * aspect, 2 * aspect, -2, 2, zNear, zFar)
    mat4.perspective(this._projectionMatrix, fov, aspect, zNear, zFar)
    mat4.lookAt(
      this._viewMatrix,
      [0.0, 0.0, 5.0],
      [0.0, 0.0, 0.0],
      [0.0, 1.0, 0.0]
    )
    mat4.translate(this._modelMatrix, modelPosition, [0.0, 0.0, 0.0])
  }

  _clearScreen = () => {
    this._webgl.clearColor(0.0, 0.0, 0.0, 1.0)
    this._webgl.clearDepth(1.0)
    this._webgl.clear(
      this._webgl.COLOR_BUFFER_BIT | this._webgl.DEPTH_BUFFER_BIT
    )
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

  _isPowerOf2 = value => {
    return (value & (value - 1)) === 0
  }

  _createBuffer = (
    bufferData,
    buffer,
    bufferType,
    drawType,
    dataType = this._webgl.FLOAT
  ) => {
    if (buffer === null) {
      buffer = this._webgl.createBuffer()
    }

    let rawBufferArray
    switch (dataType) {
      case this._webgl.UNSIGNED_SHORT:
        rawBufferArray = new Uint16Array(bufferData)
        break
      default:
        rawBufferArray = new Float32Array(bufferData)
    }

    this._webgl.bindBuffer(bufferType, buffer)
    this._webgl.bufferData(bufferType, rawBufferArray, drawType)

    this._webgl.bindBuffer(bufferType, null)

    return buffer
  }

  _resizeCanvas = () => {
    if (this._canvas.width !== this._canvas.clientWidth) {
      this._canvas.width = this._canvas.clientWidth
      this._canvas.height = (this._canvas.clientWidth * 3) / 4
    }

    this._webgl.viewport(
      0,
      0,
      this._webgl.canvas.width,
      this._webgl.canvas.height
    )

    this._canvasDimensions.width = this._canvas.width
    this._canvasDimensions.height = this._canvas.height
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

  createImageTexture = (imageSrc, texture) => {
    if (texture === null) {
      texture = this._webgl.createTexture()
    }

    this._webgl.bindTexture(this._webgl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = this._webgl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = this._webgl.RGBA
    const srcType = this._webgl.UNSIGNED_BYTE
    const pixel = new Uint8Array([255, 255, 255, 255])
    this._webgl.texImage2D(
      this._webgl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    )

    const image = new Image()
    image.addEventListener("load", () => {
      this._webgl.bindTexture(this._webgl.TEXTURE_2D, texture)

      this._webgl.texImage2D(
        this._webgl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      )

      if (this._isPowerOf2(image.width) && this._isPowerOf2(image.height)) {
        this._webgl.generateMipmap(this._webgl.TEXTURE_2D)
      } else {
        this._webgl.texParameteri(
          this._webgl.TEXTURE_2D,
          this._webgl.TEXTURE_WRAP_S,
          this._webgl.CLAMP_TO_EDGE
        )
        this._webgl.texParameteri(
          this._webgl.TEXTURE_2D,
          this._webgl.TEXTURE_WRAP_T,
          this._webgl.CLAMP_TO_EDGE
        )
        this._webgl.texParameteri(
          this._webgl.TEXTURE_2D,
          this._webgl.TEXTURE_MIN_FILTER,
          this._webgl.LINEAR
        )
      }

      this._webgl.bindTexture(this._webgl.TEXTURE_2D, null)
    })
    image.src = imageSrc

    this._webgl.bindTexture(this._webgl.TEXTURE_2D, null)

    return texture
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
    return this._createBuffer(
      bufferData,
      buffer,
      this._webgl.ARRAY_BUFFER,
      this._webgl.STATIC_DRAW
    )
  }

  createElementArrayBuffer = (elementData, buffer) => {
    return this._createBuffer(
      elementData,
      buffer,
      this._webgl.ELEMENT_ARRAY_BUFFER,
      this._webgl.STATIC_DRAW,
      this._webgl.UNSIGNED_SHORT
    )
  }

  renderScene = renderer => {
    this._resizeCanvas()

    const renderInfo = {
      gl: this._webgl,
      projectionMatrix: this._projectionMatrix,
      viewMatrix: this._viewMatrix,
      modelMatrix: this._modelMatrix,
      resolution: vec2.fromValues(
        this._canvasDimensions.width,
        this._canvasDimensions.height
      ),
    }
    this._clearScreen()
    renderer(renderInfo)
  }

  renderSceneOrtho = renderer => {
    this._resizeCanvas()

    const renderInfo = {
      gl: this._webgl,
      orthoMatrix: this._orthoMatrix,
      viewMatrix: this._viewMatrix,
      modelMatrix: this._modelMatrix,
      resolution: vec2.fromValues(
        this._canvasDimensions.width,
        this._canvasDimensions.height
      ),
    }
    this._clearScreen()
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
  }
}
