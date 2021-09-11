varying highp vec3 fragmentPosition_worldSpace;

uniform highp vec4 lightPosition_worldSpace;
uniform highp float farPlane;

void main() {
  gl_FragColor = vec4(vec3(distance(fragmentPosition_worldSpace, lightPosition_worldSpace.xyz) / farPlane), 1.0);
}