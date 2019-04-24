highp float diagonal1Factor = step(0.5, randomFactor) * diagonal1Color;
highp float diagonal2Factor = invert_step(0.5, randomFactor) * diagonal2Color;
// highp float diagonal1Factor = step(0.4, randomFactor) * diagonal1Color;
// highp float diagonal2Factor = invert_step(0.6, randomFactor) * diagonal2Color;
highp float diagonalFactor = max(diagonal1Factor, diagonal2Factor);