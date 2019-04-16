uniform highp vec2 resolution;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

highp float invert_step(float edge, float x) {
  return 1.0 - step(edge, x);
}

void main() {
  highp vec2 tilingResolution = vec2(12.0, 9.0);
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp vec2 blockCenter = vec2(0.5, 0.5);
  highp vec2 blockCoordinates = fract(coordinates * tilingResolution);
  highp vec2 tileCoord = floor(coordinates * tilingResolution);
  highp vec2 tileCenter = tileCoord + blockCenter;

  highp float randomFactor = random(tileCenter / tilingResolution);

  highp vec2 coordFromCenter = blockCenter - blockCoordinates;
  highp float distanceFromDiagonal1 = abs(coordFromCenter.x - coordFromCenter.y);
  highp float distanceFromDiagonal2 = abs(coordFromCenter.x + coordFromCenter.y);

  highp float diagonal1Factor = step(0.5, randomFactor) * (1.0 - distanceFromDiagonal1);
  highp float diagonal2Factor = invert_step(0.5, randomFactor) * (1.0 - distanceFromDiagonal2);
  // highp float diagonal1Factor = step(0.4, randomFactor) * (1.0 - distanceFromDiagonal1);
  // highp float diagonal2Factor = invert_step(0.6, randomFactor) * (1.0 - distanceFromDiagonal2);
  highp float diagonalFactor = max(diagonal1Factor, diagonal2Factor);

  highp float fragmentColor = pow(diagonalFactor, 3.0);
  gl_FragColor = vec4(vec3(fragmentColor), 3);
}