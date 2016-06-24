/**
 * Created by austin on 6/8/16.
 */

"use strict";

/**
 *
 * http://mathjs.org/examples/advanced/custom_argument_parsing.js.html
 *
 * @param {number} start
 * @param {number} end
 * @param {function} func
 * @param {number} [step=0.01]
 * @returns {number}
 */
export function integrate(start, end, func, step = 0.01) {
    let total = 0;
    for (let x = start; x < end; x += step) {
        total += func(x + step / 2) * step;
    }
    return total;
}