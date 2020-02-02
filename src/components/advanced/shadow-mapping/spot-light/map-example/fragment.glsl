uniform highp float nearPlane;
uniform highp float farPlane;

highp float linearizeDepth(highp float depth)
{
    highp float z = depth * 2.0 - 1.0; // Back to NDC 
    return ((2.0 * nearPlane * farPlane) / (farPlane + nearPlane - z * (farPlane - nearPlane))) / farPlane;
}

void main() {
  gl_FragColor = vec4(vec3(linearizeDepth(gl_FragCoord.z)), 1.0);
}