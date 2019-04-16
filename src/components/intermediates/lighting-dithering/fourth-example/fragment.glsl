varying highp vec2 uv;
varying highp vec3 diffuseFactor;
varying highp vec3 specularFactor;

uniform highp vec2 resolution;
uniform highp float noiseGranularity;
uniform highp float ambientFactor;
uniform sampler2D textureSampler;

highp float random(vec2 coords) {
   return fract(sin(dot(coords.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  highp vec4 textureColor = texture2D(textureSampler, uv);
  gl_FragColor.rgb = (textureColor.rgb * ambientFactor) + (textureColor.rgb * diffuseFactor) + (specularFactor);
  gl_FragColor.rgb += mix(-noiseGranularity, noiseGranularity, random(gl_FragCoord.xy / resolution));
  gl_FragColor.a = textureColor.a;
}