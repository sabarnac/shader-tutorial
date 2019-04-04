import React from "react"

import Layout from "../../components/layout"
import Content from "../../components/content"
import SEO from "../../components/seo"
import PageChange from "../../components/page-change"
import { renderEquation } from "../../components/util"

const MathematicsPage = ({ location: { pathname } }) => (
  <Layout>
    <SEO
      pathname={pathname}
      title="Shader Basics - A Primer On Needed Mathematics"
      description="A look into the mathematics that is required and extremely useful for shading."
      keywords={["shader", "basics", "gpu", "mathematics", "maths"]}
    />
    <Content>
      <h2>Shader Basics - A Primer On Necessary Mathematics</h2>
      <p>
        A lot of the functionality of shaders is dependent on mathematical
        functions and calculations. Knowing what mathematical functions are
        useful for various operations is useful for creating visual effects.
      </p>
      <p>
        There are three main areas of mathematics that are very important to
        learn and understand:
      </p>
      <ul>
        <li>Vectors</li>
        <li>Matrices</li>
        <li>Trignometry</li>
      </ul>
      <p>
        While these aren't the only areas or mathematical concepts used within
        shaders, they are part of the fundamentals required to understand how
        and why certain things are done the way they are.
      </p>
      <p>
        Let's start with going through these main areas of mathematics, and then
        discuss other needed concepts.
      </p>
      <p>
        We recommend going through these even if you know about the concepts of
        these areas, since an explanation into why they're used is also
        provided.
      </p>
      <h3>Vector Mathematics</h3>
      <p>
        A vector is generally understood to be an object or piece of data that
        has a certain amount of magnitude and a direction and shows what it
        would take to "carry" a point from one position to another.
      </p>
      <p>
        A vector is made out of multiple components.In 3D vectors, there are
        three components that store the magnitudes of the vector in the X-axis,
        Y-axis, and Z-axis, which together provide information about the
        direction of a vector.
      </p>
      <p>
        A vector specifically represents a direction from an initial point A to
        a point B, and the magnitude required to move from the former point to
        the later.
      </p>
      <p>
        If we take our initial point as {renderEquation(`A = (1, 2, 3)`)} and
        the final point {renderEquation(`B = (3, 5, 8)`)}, where the first value
        is the point location in the X-axis, and the second value is the point
        location in the Y-axis.
      </p>
      <p>
        The vector representing moving from the first point to the second would
        be {renderEquation(`vec (AB) = (x_B - x_A, y_B - y_A, z_B - z_A)`)},
        which is{" "}
        {renderEquation(`vec (AB) = (3 - 1, 5 - 2, 8 - 3) = (2, 3, 5)`)}
      </p>
      <p>
        Vectors are useful as a representation of the data to be processed.
        Recalling the GPU render pipeline, the first shader stage - the vertex
        shader - requires data about the vertices of the object which it then
        operates on.
      </p>
      <p>
        The most fundamental thing required to be known about a vertex is its
        position. This can best be represented through vectors.
      </p>
      <p>
        We know that a vector is data that represents moving a point from one
        place to another. If the initial point is always the origin{" "}
        {renderEquation(`O = (0, 0, 0)`)}, then you'll notice that all resulting
        vectors represent the position of the final point.
      </p>
      <p>
        The reason for this is quite simple. Every point you plot is always
        respective to the origin. So when a point is plotted at{" "}
        {renderEquation(`A = (1, 2, 3)`)}, that point is placed relative to an
        origin point which is always at {renderEquation(`O = (0, 0, 0)`)}.
      </p>
      <p>
        This means that any vector that represents the amount needed to carry
        the origin to a point will have a value representing that final point.
      </p>
      <p>
        While points can be used to represent points, they can also be used to
        represent direction. For example, a vector{" "}
        {renderEquation(`vec A = (0, 1, 0)`)} has only a value for the Y-axis.
        This could be interpreted as some direction that acts along the Y-axis.
      </p>
      <p>
        Similarly, a vector {renderEquation(`vec A = (1, 1, 0)`)} represents a
        direction that acts along the X-and Y-axis equally. And a vector{" "}
        {renderEquation(`vec A = (0.333, 1.0, 0.5)`)} represents a direction
        that acts fully on the Y-axis, about a half as much on the Z-axis, and
        only a third as much on the X-axis.
      </p>
      <p>
        Since vectors can be used to represent both points and directions, a
        method is required to distinguish between the two. For this, an extra
        coordinate is added to all vectors, called the {renderEquation(`w`)}{" "}
        coordinate.
      </p>
      <p>
        This means that when a point or direction needs to be represented in a
        certain number of dimensions, the size of the vector representing it
        will always be 1 plus the number of dimensions of the point or
        direction, where the last value is {renderEquation(`w`)}.
      </p>
      <p>
        For points, the value for {renderEquation(`w`)} coordinate is always 1,
        and for directions it's always 0. The reason for this will be discussed
        in the next section, where we'll talk about matrices.
      </p>
      <h3>Matrix Mathematics</h3>
      <p>
        Matrices are objects or data that are written as a rectangular array of
        values. This means that matrices have two dimensions, with data moving
        vertically and horizontally.
      </p>
      <p>
        If this is a bit confusing, here is an example of what a matrix looks
        like:
      </p>
      <p className="util text-center">
        {renderEquation(`a = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]`)}
      </p>
      <p>
        When a particular value in a matrix is being referenced, it is written
        as {renderEquation(`a_(ij)`)}, where {renderEquation(`i`)} represents
        the row number, and {renderEquation(`j`)} represents the column number.
      </p>
      <p>
        While vectors are very good at representing data, a method is required
        to manipulate this data so that we can perform calculations based of the
        initial vector data provided.
      </p>
      <p>
        This task is most suitable for matrices, that allow for manipulation in
        very interesting ways. Let's discuss a few types of matrices that are
        used, and the how and why behind them.
      </p>
      <p>
        We'll be teaching about the absolutely required concepts to learn about
        matrices. To learn more about them, check out{" "}
        <a
          href="https://www.opengl-tutorial.org/assets/faq_quaternions/"
          target="_blank"
          rel="noopener noreferrer"
        >
          this reference
        </a>{" "}
        by the{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenGL Tutorial
        </a>
        , which provides great explanations into the mathematics of matrices,
        more than could ever be covered here.
      </p>
      <h4>Matrix Multiplication</h4>
      <p>
        When multiplying two matrices, the number of columns from the first
        matrix has to match the number of rows of the second, or else they
        cannot be multiplied.
      </p>
      <p>
        The reason for this can be seen when we see the process of how matrices
        are multiplied.
      </p>
      <p>
        Let us take two matrices,{" "}
        {renderEquation(
          `a = [[a_(11), a_(12), a_(13)], [a_(21), a_(22), a_(23)]]`
        )}{" "}
        and{" "}
        {renderEquation(
          `b = [[b_(11), b_(12)], [b_(21), b_(22)], [b_(31), b_(32)]]`
        )}
        .
      </p>
      <p>
        The multiplication of these two matrices would be{" "}
        {renderEquation(
          `c = [[a_(11)b_(11) + a_(12)b_(21) + a_(13)b_(31), a_(11)b_(12) + a_(12)b_(22) + a_(13)b_(32)], [a_(21)b_(11) + a_(22)b_(21) + a_(23)b_(31), a_(21)b_(12) + a_(22)b_(22) + a_(23)b_(32)]]`
        )}
      </p>
      <p>This may seem very complex, but we can break it down.</p>
      <p>
        First, let's look at what the size of the final matrix is. The matrix{" "}
        {renderEquation(`c`)} would have the same number of rows as matrix{" "}
        {renderEquation(`a`)}, and the same number of columns as matrix{" "}
        {renderEquation(`b`)}. This means the matrix {renderEquation(`c`)}{" "}
        should be:
      </p>
      <p className="util text-center">
        {renderEquation(`c = [[c_(11), c_(12)], [c_(21), c_(22)]]`)}
      </p>
      <p>
        Now lets look at what the value of each cell is, starting with{" "}
        {renderEquation(`c_(11)`)}.
      </p>
      <p>
        Take the first column of matrix {renderEquation(`b`)} and rotate it 90
        degrees counter-clockwise so that it becomes a row{" "}
        {renderEquation(`[b_(11), b_(21), b_(31)]`)}.
      </p>
      <p>
        Each cell of this row is then multiplied against the cells in the same
        position in the first row of matrix {renderEquation(`a`)}, so{" "}
        {renderEquation(`a_(11)b_(11), a_(12)b_(21), a_(13)c_(31)`)}.
      </p>
      <p>
        The result of these is finally added, which becomes the value of{" "}
        {renderEquation(`c_(11)`)}.
      </p>
      <p>
        For the value of {renderEquation(`c_(12)`)}, take the first column of
        matrix {renderEquation(`b`)} and perform the same process against the
        second row of matrix {renderEquation(`a`)}.
      </p>
      <p>
        For {renderEquation(`c_(21)`)}, the process is performed using the
        second column of matrix {renderEquation(`b`)} and the first row of
        matrix {renderEquation(`a`)}. Finally, for {renderEquation(`c_(22)`)},
        the process is performed using the second column of matrix{" "}
        {renderEquation(`b`)} and the second row of matrix {renderEquation(`a`)}
        .
      </p>
      <p>
        If this is a bit hard to remember, think of it this way. For the value
        of {renderEquation(`c_(11)`)}, first put a finger on the first cell of
        the first column of matrix {renderEquation(`b`)}, and a finger on the
        first cell of the first row of matrix {renderEquation(`a`)}.
      </p>
      <p>
        Multiply the two values, then move the finger on matrix{" "}
        {renderEquation(`b`)} down to the next cell, and the finger on matrix{" "}
        {renderEquation(`a`)} right to the next cell. Multiply the two pointed
        values, and add it to the previous result. Keeping going until you hit
        the end of both.
      </p>
      <p>
        A trick to remember which column and row from both matrices is needed
        for a cell is to check the position of the cell.
      </p>
      <p>
        For a cell {renderEquation(`c_(ij)`)}, it's value will be performing the
        explained process using the {renderEquation(`i`)} column from the second
        matrix, and the {renderEquation(`j`)} row from the first matrix.
      </p>
      <p>
        If you notice carefully, this process will only work if the number of
        columns in the first matrix has to equal the number of rows in the
        second matrix.
      </p>
      <p>
        If this rule isn't satisfied, there will be some cells that don't have a
        cell from the other matrix that they can be multiplied with.
      </p>
      <p>
        Another important note is that multiplication of matrices is not
        commutative, meaning that {renderEquation(`a times b != b times a`)}.
      </p>
      <h4>Identity Matrix</h4>
      <p>
        The identity matrix is similar to the number 1 in a certain way. When 1
        is multiplied with a number we'll call {renderEquation(`x`)}, the final
        result is the {renderEquation(`x`)} itself. This means that the number 1
        has helped retain the "identity" of that value multiplied with it.
      </p>
      <p>
        The identity matrix is the same, but with matrices. Any matrix
        multiplied with an identity matrix will result in the original matrix
        itself, unaltered.
      </p>
      <p>
        An identity matrix always has the same number of rows and columns. An
        example of a 4x4 identity matrix is:
      </p>
      <p className="util text-center">
        {renderEquation(
          `i = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]`
        )}
      </p>
      <p>
        You can verify the the concept discussed about the identity matrix by
        taking any matrix with 4 columns and multiplying this identity matrix
        against it. A fun fact is that multiplication with an identity matrix is
        actually commutative.
      </p>
      <h4>Translation Matrix</h4>
      <p>
        A translation matrix is a matrix that is used to "translate" or move a
        vector by a certain amount.
      </p>
      <p>A translation matrix is written in the form:</p>
      <p className="util text-center">
        {renderEquation(
          `t = [[1, 0, 0, X], [0, 1, 0, Y], [0, 0, 1, Z], [0, 0, 0, 1]]`
        )}
      </p>
      <p>
        {renderEquation(`X`)}, {renderEquation(`Y`)}, and {renderEquation(`Z`)}{" "}
        represent the amount the vector needs to be moved in the X, Y, and Z
        axis respectively.
      </p>
      <p>
        A translation matrix is similar to an identity matrix, except for the
        last column. This also means it has the same number of rows and columns.
      </p>
      <p>
        Similar to how the size of a vector is the number of dimensions plus 1,
        the size of a translation matrix (and the other matrices that will be
        explained) is the same.
      </p>
      <p>
        A concept discussed about the {renderEquation(`w`)} value for vectors is
        that for points it is always 1, and for directions it is always 0. The
        reason for this will be obvious as we discuss translation matrices.
      </p>
      <p>
        Let's take a point {renderEquation(`vec a = [[1], [2], [3], [1]]`)}{" "}
        (last value is {renderEquation(`w`)}, which is 1 for a point), which
        we'll represent as a matrix. Let's move this point 2 units in the
        X-axis, 3 units in the Y-axis, and -1 units in the Z-axis.
      </p>
      <p>
        The translation matrix for this would be{" "}
        {renderEquation(
          `t = [[1, 0, 0, 2], [0, 1, 0, 3], [0, 0, 1, -1], [0, 0, 0, 1]]`
        )}
        .
      </p>
      <p>
        To translate the point, we multiply the translation matrix and the
        matrix representing the point vector in the order{" "}
        {renderEquation(`a_(translated) = t times a`)}.
      </p>
      <p>So the final translated point will be:</p>
      <p className="util text-center">
        {renderEquation(
          `a_(translated) = [[1, 0, 0, 2], [0, 1, 0, 3], [0, 0, 1, -1], [0, 0, 0, 1]] times [[1], [2], [3], [1]]`
        )}
        <br />
        {renderEquation(
          `a_(translated) = [[1 times 1 + 0 times 2 + 0 times 3 + 2 times 1], [0 times 1 + 1 times 2 + 0 times 3 + 3 times 1], [0 times 1 + 0 times 2 + 1 times 3 + -1 times 1], [0 times 1 + 0 times 2 + 0 times 3 + 1 times 1]]`
        )}
        <br />
        {renderEquation(
          `a_(translated) = [[1 + 0 + 0 + 2], [0 + 2 + 0 + 3], [0 + 0 + 3 + -1], [0 + 0 + 0 + 1]]`
        )}
        <br />
        {renderEquation(`a_(translated) = [[3], [5], [2], [1]]`)}
      </p>
      <p>
        So the final translated point is{" "}
        {renderEquation(`a_(translated) = (3, 5, 2, 1)`)}, which you can verify
        yourself if it is correct or not.
      </p>
      <p>
        What if instead of a point, the vector was a direction? The vector would
        be the same, with the only difference being the value of the component{" "}
        {renderEquation(`w`)}, which would be 0 for directions. Performing the
        same multiplication process, we get:
      </p>
      <p className="util text-center">
        {renderEquation(
          `a_(translated) = [[1, 0, 0, 2], [0, 1, 0, 3], [0, 0, 1, -1], [0, 0, 0, 1]] times [[1], [2], [3], [0]]`
        )}
        <br />
        {renderEquation(
          `a_(translated) = [[1 times 1 + 0 times 2 + 0 times 3 + 2 times 0], [0 times 1 + 1 times 2 + 0 times 3 + 3 times 0], [0 times 1 + 0 times 2 + 1 times 3 + -1 times 0], [0 times 1 + 0 times 2 + 0 times 3 + 1 times 0]]`
        )}
        <br />
        {renderEquation(
          `a_(translated) = [[1 + 0 + 0 + 0], [0 + 2 + 0 + 0], [0 + 0 + 3 + 0], [0 + 0 + 0 + 0]]`
        )}
        <br />
        {renderEquation(`a_(translated) = [[1], [2], [3], [0]]`)}
      </p>
      <p>
        From the calculation, we see that the result of the translation is the
        original direction itself. This is correct, since it makes no sense for
        a direction to be translated.
      </p>
      translation
      <p>
        A direction can be rotated to point somewhere else, but a direction
        cannot be moved from one point to another, since a direction does not
        represent a position in space.
      </p>
      <p>
        By setting the {renderEquation(`w`)} of a direction to 0, we can ensure
        that only the operations that makes sense to apply to a direction can
        actual be performed. In this instance, since translating a direction is
        not possible, the {renderEquation(`w`)} prevents any modification.
      </p>
      <h4>Scaling Matrix</h4>
      <p>
        A scaling matrix "scales" a vector with respect to the origin. If a
        vector has certain X, Y, and Z values, scaling the vector would be
        multiplying each of those values by a certain amount.
      </p>
      <p>A scaling matrix is written in the form:</p>
      <p className="util text-center">
        {renderEquation(
          `s = [[X, 0, 0, 0], [0, Y, 0, 0], [0, 0, Z, 0], [0, 0, 0, 1]]`
        )}
      </p>
      <p>
        {renderEquation(`X`)}, {renderEquation(`Y`)}, and {renderEquation(`Z`)}{" "}
        represent the amount the vector needs to be scaled in the X, Y, and Z
        axis respectively.
      </p>
      <p>
        Let's take a point {renderEquation(`vec a = [[1], [2], [3], [1]]`)}.
        Let's scale this point 2 units in the X-axis, 3 units in the Y-axis, and
        0.5 units in the Z-axis (negative values aren't used because scaling
        negatively doesn't make sense).
      </p>
      <p>
        The scaling matrix for this would be{" "}
        {renderEquation(
          `s = [[2, 0, 0, 0], [0, 3, 0, 0], [0, 0, 0.5, 0], [0, 0, 0, 1]]`
        )}
        .
      </p>
      <p>
        To scale the point, we multiply the translation matrix and the matrix
        representing the point vector in the order{" "}
        {renderEquation(`a_(scaled) = s times a`)}.
      </p>
      <p>So the final translated point will be:</p>
      <p className="util text-center">
        {renderEquation(
          `a_(scaled) = [[2, 0, 0, 0], [0, 3, 0, 0], [0, 0, 0.5, 0], [0, 0, 0, 1]] times [[1], [2], [3], [1]]`
        )}
        <br />
        {renderEquation(
          `a_(scaled) = [[2 times 1 + 0 times 2 + 0 times 3 + 0 times 1], [0 times 1 + 3 times 2 + 0 times 3 + 0 times 1], [0 times 1 + 0 times 2 + 0.5 times 3 + 0 times 1], [0 times 1 + 0 times 2 + 0 times 3 + 1 times 1]]`
        )}
        <br />
        {renderEquation(
          `a_(scaled) = [[2 + 0 + 0 + 0], [0 + 6 + 0 + 0], [0 + 0 + 1.5 + 0], [0 + 0 + 0 + 1]]`
        )}
        <br />
        {renderEquation(`a_(scaled) = [[2], [6], [1.5], [1]]`)}
      </p>
      <p>
        So the final scaled point is{" "}
        {renderEquation(`a_(scaled) = (2, 6, 1.5, 1)`)}.
      </p>
      <p>
        An interesting point to note is that directions can actually be scaled.
        While the case for this is rare, and the concept of scaling a direction
        doesn't make sense either, this operation can be useful in certain
        situations. This may be explored in a later chapter.
      </p>
      <h4>Rotation Matrix</h4>
      <p>
        A rotation matrix is used to rotate a certain vector around a certain
        axis by a certain number of degrees or radians. Similar to scaling
        matrices, they can be applied to both points and directions.
      </p>
      <p>
        The concepts of a rotation matrix are a little hard to explain, so we
        recommend that you go through{" "}
        <a
          href="https://www.opengl-tutorial.org/assets/faq_quaternions/#Q26"
          target="_blank"
          rel="noopener noreferrer"
        >
          this reference
        </a>{" "}
        by{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenGL Tutorial
        </a>{" "}
        to understand the concepts of a rotation matrix.
      </p>
      <p>
        There is also a section on{" "}
        <a
          href="https://www.opengl-tutorial.org/assets/faq_quaternions/#Q47"
          target="_blank"
          rel="noopener noreferrer"
        >
          quaternions
        </a>
        , which provide a different way of creating rotation matrices, and make
        rotations simpler to deal with. It is highly recommended to go through
        this section as well.
      </p>
      <h4>Other Matrices</h4>
      <p>
        There are other types of matrices, such as shearing matrices, which
        allow for other types of manipulations to be performed on vectors.
      </p>
      <p>
        As noted in the start of this section, the{" "}
        <a
          href="https://www.opengl-tutorial.org/assets/faq_quaternions/"
          target="_blank"
          rel="noopener noreferrer"
        >
          reference guide
        </a>{" "}
        by{" "}
        <a
          href="https://www.opengl-tutorial.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenGL Tutorial
        </a>{" "}
        is a great way to learn about all these other concepts in detail, as
        they provide a great explanation about the concepts and usages of
        matrices.
      </p>
      <h3>Trignometry</h3>
      <p>
        Similar to matrix mathematics, trignometry is useful for performing
        manipulations on vector data. However, the benefit trignometry of
        trignometry lies in the fact that it allows the formation of patterns in
        manipulation.
      </p>
      <p>
        Let's take the example of the trignometric functions{" "}
        {renderEquation(`sin(theta)`)} and {renderEquation(`cos(theta)`)}. These
        functions, when given a certain angle, produce a certain value between 1
        to -1.
      </p>
      <p>
        If we take {renderEquation(`sin(theta)`)}, at 0 degrees, it gives the
        result 0. As the angle increases to 90 degrees, the result of the
        function becomes 1.
      </p>
      <p>
        When the angle exceeds 90 degrees and goes to 180 degrees, the result of
        the function goes back to 0. Further increasing the angle to 270 degrees
        results in the value decreasing to -1.
      </p>
      <p>
        Finally, as the angle increases to 360 degrees, the result goes back to
        0, resetting the loop. {renderEquation(`cos(theta)`)} behaves in a
        similar way.
      </p>
      <p>
        Lets visualize what is plotted by these functions on a graph as the
        angle passed to it keeps increasing.
      </p>
      <p className="util text-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3b/Circle_cos_sin.gif"
          alt="Sine Cosine Visual"
        />
        <br />
        <a
          href="https://commons.wikimedia.org/wiki/File:Circle_cos_sin.gif"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </p>
      <p>
        As seen from the plot, the line drawn by both functions is a wave that
        is always continuous. This allows the ability to draw patterns and
        shapes since the lines drawn by these functions is continuous and
        smooth, allowing for proper transitions and tiles to be drawn through
        some clever math.
      </p>
      <p>
        A moving sine wave can be drawn as simply as just passing the time
        elapsed since a certain starting point as the {renderEquation(`theta`)}{" "}
        to {renderEquation(`sin(theta)`)}. Building up on this, a pattern or
        shape can be built by setting the input of the function to specific
        values, or by combining the results of multiple functions as well.
      </p>
      <p>
        Other trignometric functions such as {renderEquation(`tan(theta)`)} and{" "}
        {renderEquation(`cot(theta)`)} can also be used, although not all
        trignometric functions (like the aforementioned two) produce continuous
        lines with increasing angles. This property can still be useful in
        certain scenarios.
      </p>
      <h3>Other Mathematic Concepts</h3>
      <p>
        Similar to how trignometric functions can be used to produce patterns
        and shapes, operations such as {renderEquation(`"floor(x)" = floor(x)`)}
        , {renderEquation(`"ceil(x)" = ceil(x)`)},{" "}
        {renderEquation(`"abs(x)" = abs(x)`)},{" "}
        {renderEquation(`"power(x, n)" = x^n`)}, etc. are also useful for the
        same purpose.
      </p>
      <p>
        Functions such as these can be referred to as pattern functions or shape
        functions, since they can help produce patterns and shapes in images.
      </p>
      <h3>Summary</h3>
      <ul>
        <li>
          There are three primary areas of math that should be learnt that are
          used in shader programming:
          <ul>
            <li>Vectors</li>
            <li>Matrices</li>
            <li>Trignometry</li>
          </ul>
        </li>
        <li>
          Vector mathematics is useful for representing data, such as points and
          directions.
        </li>
        <li>
          Matrix mathematics is useful for manipulating data in specific ways,
          such as moving, rotating, scaling points and directions.
        </li>
        <li>
          Trignometry is useful for manipulating data in specific patterns, such
          as rotating a point along the circumference of a circle, producing a
          smooth wave, or generating certain shapes.
        </li>
        <li>
          There are other mathematical functions and operations outside of
          trignometry that allow for manipulating data in patterns, with each
          having their own specific properties.
        </li>
      </ul>
    </Content>
    <PageChange
      previous="/basics/render-pipeline/"
      next="/basics/vertex-shader/"
    />
  </Layout>
)

export default MathematicsPage
