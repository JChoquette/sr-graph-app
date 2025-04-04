import React from "react";
import * as Constants from "./Constants.js"


const Segment = ({ data, v, gamma, xScale, yScale }) => {
    const e1 = Constants.Lorentz(data.x1,data.t1,v,gamma);
    const e2 = Constants.Lorentz(data.x2,data.t2,v,gamma);

    let axis;
    if(data.show_axis){
        let speed = (data.x2-data.x1)/(data.t2-data.t1);
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
                x1={xScale(data.x1)} y1={yScale(data.t1)} 
                x2={xScale(data.x2)} y2={yScale(data.t2)} 
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

export default Segment;