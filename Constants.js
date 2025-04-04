/**
 * @file Constants.js
 * @copyright Copyright (C) 2025 Jeremie Choquette
 *
 * This file is part of the SRGraph project.
 *
 * SRGraph is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SRGraph is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with SRGraph.  If not, see <https://www.gnu.org/licenses/>.
 */

export const Lorentz = (x,t,v,gamma) => {
    let xp = gamma*(x-v*t);
    let tp = gamma*(t-v*x);
    return {x:xp,t:tp};
}


export const get_gamma = (v) =>{
    return 1.0/Math.sqrt(1-v**2);
}

export const linspace = (start, stop, num) => 
    Array.from({ length: num }, (_, i) => start + (i / (num - 1)) * (stop - start));
