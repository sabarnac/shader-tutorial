highp float getColorShiftFactor(highp vec3 color) {
  return clamp(ceil(3.0 - (color.r + color.g + color.b)), 0.0, 1.0);
}

void main() {
  highp float colorShift = cos(time / 500.0);
  highp vec4 textureColor = texture2D(colorTextureSampler, uv);
  highp float finalColorShift = getColorShiftFactor(textureColor.rgb) * colorShift;
  gl_FragColor = vec4(clamp(textureColor.rgb - finalColorShift, 0.0, 1.0), textureColor.a);
}