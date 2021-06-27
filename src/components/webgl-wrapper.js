import { mat4, vec2 } from "gl-matrix"

export default class WebGlWrapper {
  _canvas = null
  canvasDimensions = {
    width: 0,
    height: 0,
    scale: window.devicePixelRatio || 1,
    aspect: 1.0,
    fov: (45 * Math.PI) / 180,
    zNear: 0.1,
    zFar: 50.0,
  }
  _projectionMatrix = mat4.create()
  _orthoMatrix = mat4.create()
  _viewMatrix = mat4.create()
  _modelMatrix = mat4.create()

  constructor(canvas, modelPosition, disableDepth = false, cullFace = false) {
    this.canvasDimensions = {
      ...this.canvasDimensions,
      width: canvas.width * 2,
      height: canvas.height * 2,
      aspect: canvas.width / canvas.height,
    }
    this._canvas = canvas
    this._cullFace = cullFace

    this._webgl = canvas.getContext("webgl2")
    if (this._webgl === null) {
      this._showNotSupported(canvas)
    }

    this._startSetup(modelPosition, disableDepth)
  }

  _showNotSupported = () => {
    console.error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    )
    const ctx = this._canvas.getContext("2d")
    ctx.scale(this.canvasDimensions.scale, this.canvasDimensions.scale)
    if (ctx === null) {
      const x = this.canvasDimensions.width / 2
      const y = this.canvasDimensions.height / 2
      ctx.font = "24px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("WebGL not supported", x, y)
      ctx.fillText("Please use a browser that supports WebGL", x, y + 25)
    }
  }

  _startSetup = (modelPosition, disableDepth) => {
    this._resizeCanvas()

    if (!disableDepth) {
      this._webgl.enable(this._webgl.DEPTH_TEST)
      this._webgl.depthFunc(this._webgl.LEQUAL)
    } else {
      this._webgl.disable(this._webgl.DEPTH_TEST)
      this._webgl.depthMask(false)

      this._webgl.enable(this._webgl.BLEND)
      this._webgl.blendFunc(
        this._webgl.SRC_ALPHA,
        this._webgl.ONE_MINUS_SRC_ALPHA
      )
    }

    this._setupCullFace()

    this._clearScreen()

    this.canvasDimensions.aspect = this._canvas.width / this._canvas.height

    this._webgl.viewport(0, 0, this._canvas.width, this._canvas.height)

    const { fov, aspect, zNear, zFar } = this.canvasDimensions

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

  _setupCullFace = () => {
    if (this._cullFace) {
      this._webgl.enable(this._webgl.CULL_FACE)
      this._webgl.cullFace(this._webgl.BACK)
    } else {
      this._webgl.disable(this._webgl.CULL_FACE)
    }
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

  _isPowerOf2 = (value) => {
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
    if (
      this._canvas.width !==
      this._canvas.clientWidth * this.canvasDimensions.scale
    ) {
      this._canvas.width =
        this._canvas.clientWidth * this.canvasDimensions.scale
      this._canvas.height =
        (this._canvas.clientWidth * this.canvasDimensions.scale * 3) / 4

      this.canvasDimensions.width = this._canvas.width * 2
      this.canvasDimensions.height = this._canvas.height * 2

      this._webgl.viewport(
        0,
        0,
        this.canvasDimensions.width,
        this.canvasDimensions.height
      )

      this.canvasDimensions.aspect =
        this._canvas.clientWidth / this._canvas.clientHeight
    }
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

    this._webgl.deleteShader(vertexShader)
    this._webgl.deleteShader(fragmentShader)

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
    this._webgl.texParameteri(
      this._webgl.TEXTURE_2D,
      this._webgl.TEXTURE_MAG_FILTER,
      this._webgl.LINEAR
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
      }

      this._webgl.bindTexture(this._webgl.TEXTURE_2D, null)
    })
    image.src = imageSrc

    this._webgl.bindTexture(this._webgl.TEXTURE_2D, null)

    return texture
  }

  createCubeMapTexture = (imageSrcMap, texture) => {
    if (texture === null) {
      texture = this._webgl.createTexture()
    }

    this._webgl.bindTexture(this._webgl.TEXTURE_CUBE_MAP, texture)

    const level = 0
    const internalFormat = this._webgl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = this._webgl.RGBA
    const srcType = this._webgl.UNSIGNED_BYTE
    const pixel = new Uint8Array([255, 255, 255, 255])
    const faces = [
      this._webgl.TEXTURE_CUBE_MAP_POSITIVE_X,
      this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      this._webgl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      this._webgl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ]

    faces.forEach((face) => {
      this._webgl.texImage2D(
        face,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
      )
    })

    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_WRAP_S,
      this._webgl.CLAMP_TO_EDGE
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_WRAP_T,
      this._webgl.CLAMP_TO_EDGE
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_WRAP_R,
      this._webgl.CLAMP_TO_EDGE
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_MIN_FILTER,
      this._webgl.LINEAR
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_MAG_FILTER,
      this._webgl.LINEAR
    )

    imageSrcMap.forEach(({ face, src }) => {
      const image = new Image()
      image.addEventListener("load", () => {
        this._webgl.bindTexture(this._webgl.TEXTURE_CUBE_MAP, texture)

        this._webgl.texImage2D(
          face,
          level,
          internalFormat,
          srcFormat,
          srcType,
          image
        )

        if (this._isPowerOf2(image.width) && this._isPowerOf2(image.height)) {
          this._webgl.generateMipmap(this._webgl.TEXTURE_CUBE_MAP)
        }

        this._webgl.bindTexture(this._webgl.TEXTURE_CUBE_MAP, null)
      })
      image.src = src
    })

    this._webgl.bindTexture(this._webgl.TEXTURE_CUBE_MAP, null)

    return texture
  }

  createRenderTargetTexture = (texture) => {
    this._resizeCanvas()

    if (texture === null) {
      texture = this._webgl.createTexture()
    }

    this._webgl.bindTexture(this._webgl.TEXTURE_2D, texture)

    const level = 0
    const internalFormat = this._webgl.RGBA
    const width = this.canvasDimensions.width
    const height = this.canvasDimensions.height
    const border = 0
    const srcFormat = this._webgl.RGBA
    const srcType = this._webgl.UNSIGNED_BYTE
    this._webgl.texImage2D(
      this._webgl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      null
    )

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
      this._webgl.NEAREST
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_2D,
      this._webgl.TEXTURE_MAG_FILTER,
      this._webgl.NEAREST
    )

    this._webgl.bindTexture(this._webgl.TEXTURE_2D, null)

    return texture
  }

  createCubeMapRenderTargetTexture = (texture) => {
    this._resizeCanvas()

    if (texture === null) {
      texture = this._webgl.createTexture()
    }

    this._webgl.bindTexture(this._webgl.TEXTURE_CUBE_MAP, texture)

    const level = 0
    const internalFormat = this._webgl.RGBA
    const width = this.canvasDimensions.width
    const height = this.canvasDimensions.width
    const border = 0
    const srcFormat = this._webgl.RGBA
    const srcType = this._webgl.UNSIGNED_BYTE
    const faces = [
      this._webgl.TEXTURE_CUBE_MAP_POSITIVE_X,
      this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      this._webgl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      this._webgl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    ]
    faces.forEach((face) => {
      this._webgl.texImage2D(
        face,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        null
      )
    })

    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_WRAP_S,
      this._webgl.CLAMP_TO_EDGE
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_WRAP_T,
      this._webgl.CLAMP_TO_EDGE
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_WRAP_R,
      this._webgl.CLAMP_TO_EDGE
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_MIN_FILTER,
      this._webgl.LINEAR
    )
    this._webgl.texParameteri(
      this._webgl.TEXTURE_CUBE_MAP,
      this._webgl.TEXTURE_MAG_FILTER,
      this._webgl.LINEAR
    )

    this._webgl.bindTexture(this._webgl.TEXTURE_CUBE_MAP, null)

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

  createTextureTargetFramebuffer = (
    renderTarget,
    frameBuffer,
    bindDepth = false
  ) => {
    this._resizeCanvas()

    if (frameBuffer === null) {
      frameBuffer = this._webgl.createFramebuffer()
    }

    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, frameBuffer)
    this._webgl.framebufferTexture2D(
      this._webgl.FRAMEBUFFER,
      this._webgl.COLOR_ATTACHMENT0,
      this._webgl.TEXTURE_2D,
      renderTarget,
      0
    )
    if (bindDepth) {
      const depthBuffer = this._webgl.createRenderbuffer()
      this._webgl.bindRenderbuffer(this._webgl.RENDERBUFFER, depthBuffer)
      this._webgl.renderbufferStorage(
        this._webgl.RENDERBUFFER,
        this._webgl.DEPTH_COMPONENT16,
        this.canvasDimensions.width,
        this.canvasDimensions.height
      )
      this._webgl.framebufferRenderbuffer(
        this._webgl.FRAMEBUFFER,
        this._webgl.DEPTH_ATTACHMENT,
        this._webgl.RENDERBUFFER,
        depthBuffer
      )
    }

    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, null)

    return frameBuffer
  }

  createCubeMapTargetFramebuffer = (
    renderTarget,
    cubeMapFace,
    frameBuffer,
    bindDepth = false
  ) => {
    this._resizeCanvas()

    const faces = {
      POSITIVE_X: this._webgl.TEXTURE_CUBE_MAP_POSITIVE_X,
      NEGATIVE_X: this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      POSITIVE_Y: this._webgl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      NEGATIVE_Y: this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      POSITIVE_Z: this._webgl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      NEGATIVE_Z: this._webgl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    }

    if (frameBuffer === null) {
      frameBuffer = this._webgl.createFramebuffer()
    }

    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, frameBuffer)
    this._webgl.framebufferTexture2D(
      this._webgl.FRAMEBUFFER,
      this._webgl.COLOR_ATTACHMENT0,
      faces[cubeMapFace],
      renderTarget,
      0
    )

    if (bindDepth) {
      const depthBuffer = this._webgl.createRenderbuffer()
      this._webgl.bindRenderbuffer(this._webgl.RENDERBUFFER, depthBuffer)
      this._webgl.renderbufferStorage(
        this._webgl.RENDERBUFFER,
        this._webgl.DEPTH_COMPONENT16,
        this.canvasDimensions.width,
        this.canvasDimensions.width
      )
      this._webgl.framebufferRenderbuffer(
        this._webgl.FRAMEBUFFER,
        this._webgl.DEPTH_ATTACHMENT,
        this._webgl.RENDERBUFFER,
        depthBuffer
      )
    }

    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, null)

    return frameBuffer
  }

  renderToCubeMapFramebuffer = (frameBuffer, renderer) => {
    this._webgl.viewport(
      0,
      0,
      this.canvasDimensions.width,
      this.canvasDimensions.width
    )
    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, frameBuffer)

    renderer()

    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, null)
    this._webgl.viewport(0, 0, this._canvas.width, this._canvas.height)
  }

  renderToFramebuffer = (frameBuffer, renderer) => {
    this._webgl.viewport(
      0,
      0,
      this.canvasDimensions.width,
      this.canvasDimensions.height
    )
    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, frameBuffer)

    renderer()

    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, null)
    this._webgl.viewport(0, 0, this._canvas.width, this._canvas.height)
  }

  renderScene = (renderer) => {
    this._resizeCanvas()

    const renderInfo = {
      gl: this._webgl,
      projectionMatrix: this._projectionMatrix,
      viewMatrix: this._viewMatrix,
      modelMatrix: this._modelMatrix,
      resolution: vec2.fromValues(
        this.canvasDimensions.width,
        this.canvasDimensions.height
      ),
    }
    this._clearScreen()
    renderer(renderInfo)
  }

  renderSceneOrtho = (renderer) => {
    this._resizeCanvas()

    const renderInfo = {
      gl: this._webgl,
      orthoMatrix: this._orthoMatrix,
      viewMatrix: this._viewMatrix,
      modelMatrix: this._modelMatrix,
      resolution: vec2.fromValues(
        this.canvasDimensions.width,
        this.canvasDimensions.height
      ),
    }
    this._clearScreen()
    renderer(renderInfo)
  }

  destroy = () => {
    this.canvasDimensions = {
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
