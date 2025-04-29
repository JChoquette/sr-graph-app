/**
 * @file Event.jsx
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

import React from "react";
import * as Constants from "./Constants.js"


const Event = ({ data, v, gamma, xScale, yScale }) => {
    const measurement_gamma = Constants.get_gamma(data.speed);
    const e_orig = Constants.Lorentz(data.x,data.t,-data.speed,measurement_gamma);
    const e = Constants.Lorentz(e_orig.x,e_orig.t,v,gamma);

    let original;
    if(data.show_original){
        original = (
            <circle 
                cx={xScale(e_orig.x)} cy={yScale(e_orig.t)} 
                fill={data.color} r={4} opacity={0.5}
            />
        )
    }

    return (
        <g>
            <circle 
                cx={xScale(e.x)} cy={yScale(e.t)} 
                fill={data.color} r={6}
            />
            {original}
        </g>
    );
};

export default Event;