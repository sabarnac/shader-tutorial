uniform highp vec2 resolution;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec2 tilingResolution = vec2(12.0, 9.0);
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp vec2 blockCenter = vec2(0.5, 0.5);
  highp vec2 tileCoord = floor(coordinates * tilingResolution);
  highp vec2 tileCenter = tileCoord + blockCenter;

  highp float fragmentColor = random(tileCenter / tilingResolution);
  gl_FragColor = vec4(vec3(fragmentColor), 1.0);
}