attribute vec4 vertexPosition;
attribute vec3 vertexNormal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying highp vec4 fragmentPosition_worldSpace;
varying highp vec3 fragmentNormal_worldSpace;

void main() {
  highp vec4 vertexPosition_worldSpace = modelMatrix * vertexPosition;
  gl_Position = projectionMatrix * viewMatrix * vertexPosition_worldSpace;
  
  fragmentPosition_worldSpace = vertexPosition;
  fragmentNormal_worldSpace = (modelMatrix * vec4(vertexNormal, 0.0)).xyz;
}