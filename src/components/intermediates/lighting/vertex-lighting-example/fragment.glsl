varying highp vec3 diffuseLight;

void main() {
  highp vec3 surfaceColor = vec3(1.0);
  
  gl_FragColor.rgb = surfaceColor.rgb * diffuseLight;
  gl_FragColor.a = 1.0;
}