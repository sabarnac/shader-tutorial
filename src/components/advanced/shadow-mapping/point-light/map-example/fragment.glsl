varying highp vec3 vertexPosition_worldSpace;

uniform highp vec4 lightPosition_worldSpace;
uniform highp float farPlane;

void main() {
  gl_FragColor = vec4(vec3(distance(vertexPosition_worldSpace, lightPosition_worldSpace.xyz) / farPlane), 1.0);
}