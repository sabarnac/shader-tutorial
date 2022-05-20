uniform highp vec2 resolution;

const highp float NOISE_GRANULARITY = 0.5/255.0;

highp float random(highp vec2 coords) {
   return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec2 coordinates = gl_FragCoord.xy / resolution;

  highp float fragmentColor = mix(0.05, 0.35, 1.0 - coordinates.y);
  fragmentColor += mix(-NOISE_GRANULARITY, NOISE_GRANULARITY, random(coordinates));
  gl_FragColor = vec4(vec3(fragmentColor), 1.0);
}