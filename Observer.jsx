/**
 * @file Observer.jsx
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


const Observer = ({ data, v, gamma, xScale, yScale }) => {
    const t1 = -10, t2 = 10;
    const x1 = t1*data.speed + data.x0;
    const x2 = t2*data.speed + data.x0;
    const e1 = Constants.Lorentz(x1,t1,v,gamma);
    const e2 = Constants.Lorentz(x2,t2,v,gamma);

    let axis;
    if(data.show_axis){
        const xa1 = -10, xa2 = 10;
        const ta1 = (xa1)*data.speed;
        const ta2 = (xa2)*data.speed;
        const ea1 = Constants.Lorentz(xa1,ta1,v,gamma);
        const ea2 = Constants.Lorentz(xa2,ta2,v,gamma);
        axis = (
            <line 
                x1={xScale(ea1.x)} y1={yScale(ea1.t)} 
                x2={xScale(ea2.x)} y2={yScale(ea2.t)} 
                stroke={data.color} strokeWidth="1" opacity={0.5} 
            />
        )
    }
    let original;
    if(data.show_original){
        original = (
            <line 
                x1={xScale(x1)} y1={yScale(t1)} 
                x2={xScale(x2)} y2={yScale(t2)} 
                stroke={data.color} strokeWidth="2" 
                opacity={0.8} strokeDasharray="5,5"
            />
        )
    }

    return (
        <g>
            <line 
                x1={xScale(e1.x)} y1={yScale(e1.t)} 
                x2={xScale(e2.x)} y2={yScale(e2.t)} 
                stroke={data.color} strokeWidth="2" 
            />
            {axis}
            {original}
        </g>
    );
};

export default Observer;