varying highp vec4 vertexPositionFromLight;

varying highp vec4 vertexPosition_worldSpace;
varying highp vec3 vertexNormal_viewSpace;
varying highp vec3 lightDirection_viewSpace;

uniform highp vec3 lightColor;
uniform highp float lightIntensity;
uniform highp vec4 lightDirection_worldSpace;
uniform highp float ambientFactor;
uniform sampler2D shadowMapTextureSampler;

// Float to RGBA encoder from https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl
// which is based from https://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/
highp float decodeFloatFromRgba(highp vec4 v) {
  // We need to convert our RGBA vec4 value back to the 32-bit float it represents.

  // To do this, we just need to reverse the process we did originally. Since each component represents
  // an 8-bit chunk of the original float, we just need to shift each component the appropriate number of
  // bits and then just add them all up together to get the original float back.

  // First we generate a decoding vector that will shift the float by the appropriate bits for each
  // vector component.
  const highp vec4 bitsToDecode = vec4(
    1.0 / 1.0,       // Shifting the number  0 [255.0 ^ 0] bits for this component.
    1.0 / 255.0,     // Shifting the number  8 [255.0 ^ 1] bits for this component.
    1.0 / 65025.0,   // Shifting the number 16 [255.0 ^ 2] bits for this component.
    1.0 / 16581375.0 // Shifting the number 24 [255.0 ^ 3] bits for this component.
  );

  // Once done, we multiply this vector against the RGBA vector to shift each component the appropriate
  // number of places and add them all up together: (x1 * x2) + (y1 * y2) + (z1 * z2) + (w1 * w2).
  // Luckily we have a vector operation that does this called the dot product, so we can just use that
  // and return the result.
  return dot(v, bitsToDecode);
}

highp vec3 getDiffuseLighting() {
  highp vec3 lightColorIntensity = lightColor * lightIntensity;
  highp float diffuseStrength = clamp(dot(vertexNormal_viewSpace, lightDirection_viewSpace), 0.0, 1.0);
  
  // highp float distanceFromLight = distance(vertexPosition_worldSpace, lightPosition_worldSpace);
  return (lightColorIntensity * diffuseStrength) /* / (distanceFromLight * distanceFromLight) */;
}

void main() {
  highp vec4 surfaceColor = vec4(1.0);
  highp vec4 ambientColor = vec4(surfaceColor);

  highp vec3 diffuseLight = getDiffuseLighting();

  highp vec3 shadowMapCoords = (vertexPositionFromLight.xyz / vertexPositionFromLight.w) * 0.5 + 0.5;
  highp float closestDepth = decodeFloatFromRgba(texture2D(shadowMapTextureSampler, shadowMapCoords.xy));

  highp float currentDepth = shadowMapCoords.z;
  highp float fragmentVisibility = currentDepth > closestDepth ? 0.0 : 1.0;

  gl_FragColor.rgb = (ambientColor.rgb * ambientFactor) + (fragmentVisibility * surfaceColor.rgb * diffuseLight);
  gl_FragColor.a = surfaceColor.a;
}