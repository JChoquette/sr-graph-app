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
                fill={data.color} r={4}
            />
            {original}
        </g>
    );
};

export default Event;