// Float to RGBA encoder from https://stackoverflow.com/questions/18453302/how-do-you-pack-one-32bit-int-into-4-8bit-ints-in-glsl-webgl
// which is based from https://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/
highp vec4 encodeFloatToRgba (highp float v) {
  // We need to store the 32-bit float as four 8-bit float chunks (which we store as a vec4).

  // To do this, we first need to be able to shift the float number such that we can get each
  // 8-bit float chunk under each component.

  // Since we don't have access to bit shift operators, we can instead use multiplication.
  // If we multiple a number by 0xff (255.0), we will have shifted that number 8 bits to the left.

  // Using this, for each component of the vec4, we can bit shift the 8-bits we need from the original
  // float value, subtract any additional precision we don't need to store under that component,
  // and then store that as the final RGBA value.

  // First we generate an encoding vector that will shift the float by the appropriate bits for each
  // vector component.
  const highp vec4 bitsToEncode = vec4(
    1.0,       // Shifting the number  0 [255.0 ^ 0] bits for this component.
    255.0,     // Shifting the number  8 [255.0 ^ 1] bits for this component.
    65025.0,   // Shifting the number 16 [255.0 ^ 2] bits for this component.
    16581375.0 // Shifting the number 24 [255.0 ^ 3] bits for this component.
  );

  // We multiply the float against the encoder vector above to get the appropriate number of bit-shifts
  // for each component. But for each of them we don't care about the integer parts, just the fractional
  // parts, so we use the `fract` function to discard the integer parts from each component.
  highp vec4 enc = fract(bitsToEncode * v);
  
  // Now each component doesn't just contain the bits of data for their respective positions, but also
  // the bits of data for each component after it. This needs to be subtracted so that each component
  // only contains the 8-bits of information of for its own component, discarding that additional data away
  // We do this by getting the vector for each succeeding component, dividing it by 255 so that the result
  // value now equals how it is actually stored in the current component, and then just subtract that result
  // from the original value to get the final vec4 where each component contains just the 8-bit chunk that
  // it represents.
  enc -= enc.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
  
  // Now we can return our final calculated RGBA vector.
  return enc;
}

void main() {
  gl_FragColor = encodeFloatToRgba(gl_FragCoord.z);
}