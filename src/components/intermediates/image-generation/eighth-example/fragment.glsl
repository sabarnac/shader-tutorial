uniform highp vec2 resolution;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec2 tilingResolution = vec2(12.0, 9.0);
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp vec2 blockCoordinates = fract(coordinates * tilingResolution);
  highp vec2 tileCoord = floor(coordinates * tilingResolution);

  highp vec2 randomizedBlockCenter = vec2(mix(0.1, 0.9, random(tileCoord / tilingResolution)));

  highp float distanceFromCenter = distance(randomizedBlockCenter, blockCoordinates);
  highp float centerFactor = 1.0 - distanceFromCenter;

  highp float fragmentColor = pow(centerFactor, 2.0);
  gl_FragColor = vec4(vec3(fragmentColor), 3);
}