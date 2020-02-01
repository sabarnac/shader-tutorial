varying highp vec3 diffuseLight;
varying highp vec4 depthCoord;

uniform highp float ambientFactor;
uniform sampler2D shadowTextureSampler;

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 depthProjectionCoords = depthCoord.xyz * 0.5 + 0.5;

  highp vec4 visibleFragmentCoord = texture2D(shadowTextureSampler, depthProjectionCoords.xy);
  highp float fragmentVisibility = ceil(clamp(visibleFragmentCoord.z - depthProjectionCoords.z, 0.0, 1.0));

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}