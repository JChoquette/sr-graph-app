/**
 * @file Extended.jsx
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
    const lines = Constants.linspace(t1,t2,41).map(t => ({
        x1:0,
        x2:data.length,
        t1:t,
        t2:t,
    }));

    const measurement_gamma = Constants.get_gamma(data.speed);

    let original_lines = lines.map(line=>{
        let e1 = Constants.Lorentz(line.x1,line.t1,-data.speed,measurement_gamma);
        let e2 = Constants.Lorentz(line.x2,line.t2,-data.speed,measurement_gamma);
        return {x1:e1.x+data.x0,x2:e2.x+data.x0,t1:e1.t,t2:e2.t}
    });

    let transformed_lines = original_lines.map(line=>{
        let e1 = Constants.Lorentz(line.x1,line.t1,v,gamma);
        let e2 = Constants.Lorentz(line.x2,line.t2,v,gamma);
        return {x1:e1.x,x2:e2.x,t1:e1.t,t2:e2.t}
    });

    let axis;
    if(data.show_axis){
        const xa1 = -10, xa2 = 10;
        const ta1 = (xa1)*data.speed;
        const ta2 = (xa2)*data.speed;
        const ea1 = Constants.Lorentz(xa1,ta1,v,gamma);
        const ea2 = Constants.Lorentz(xa2,ta2,v,gamma);
        console.log(ea1,ea2);
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
        original = [original_lines.map((line)=>
            <line 
                x1={xScale(line.x1)} y1={yScale(line.t1)} 
                x2={xScale(line.x2)} y2={yScale(line.t2)} 
                stroke={data.color} strokeWidth="2" 
                opacity={0.8} strokeDasharray="5,5"
            />
        ),

        <polygon 
            points={`${xScale(original_lines[0].x1)},${yScale(original_lines[0].t1)} ${xScale(original_lines[0].x2)},${yScale(original_lines[0].t2)} ${xScale(original_lines.at(-1).x2)},${yScale(original_lines.at(-1).t2)} ${xScale(original_lines.at(-1).x1)},${yScale(original_lines.at(-1).t1)}`} 
            fill={data.color} 
            stroke={data.color} 
            strokeWidth="1"
            opacity = {0.1} strokeDasharray="5,5"
        />]
    }

    return (
        <g>
            {transformed_lines.map((line)=>
                <line 
                    x1={xScale(line.x1)} y1={yScale(line.t1)} 
                    x2={xScale(line.x2)} y2={yScale(line.t2)} 
                    stroke={data.color} strokeWidth="4" 
                />
            )}
            <polygon 
                points={`${xScale(transformed_lines[0].x1)},${yScale(transformed_lines[0].t1)} ${xScale(transformed_lines[0].x2)},${yScale(transformed_lines[0].t2)} ${xScale(transformed_lines.at(-1).x2)},${yScale(transformed_lines.at(-1).t2)} ${xScale(transformed_lines.at(-1).x1)},${yScale(transformed_lines.at(-1).t1)}`} 
                fill={data.color} 
                stroke={data.color} 
                strokeWidth="1"
                opacity = {0.2}
            />
            {axis}
            {original}
        </g>
    );
};

export default Observer;