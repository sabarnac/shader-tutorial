uniform highp vec2 resolution;

void main() {
  highp vec2 tilingResolution = vec2(12.0, 9.0);
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp vec2 blockCenter = vec2(0.5, 0.5);
  highp vec2 blockCoordinates = fract(coordinates * tilingResolution);

  highp float distanceFromCenter = distance(blockCenter, blockCoordinates);
  highp float centerFactor = 1.0 - distanceFromCenter;

  highp float fragmentColor = pow(centerFactor, 3.0);
  gl_FragColor = vec4(vec3(fragmentColor), 1.0);
}