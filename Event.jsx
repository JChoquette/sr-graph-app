import React from "react";

const Lorentz = (x,t,v,gamma) => {
    let xp = gamma*(x-v*t);
    let tp = gamma*(t-v*x);
    return [xp,tp];
}

const Event = ({ data, v, gamma, xScale, yScale }) => {
    const e = Lorentz(data.x,data.t,v,gamma);
    console.log(data);

    return (
        <g>
            <circle 
                cx={xScale(e[0])} cy={yScale(e[1])} 
                fill={data.color} r={4}
            />
        </g>
    );
};

export default Event;