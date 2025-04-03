import React from "react";

const Lorentz = (x,t,v,gamma) => {
    let xp = gamma*(x-v*t);
    let tp = gamma*(t-v*x);
    return [xp,tp];
}

const Observer = ({ data, v, gamma, xScale, yScale }) => {
    const t1 = -10, t2 = 10;
    const x1 = t1*data.speed + data.x0;
    const x2 = t2*data.speed + data.x0;
    const e1 = Lorentz(x1,t1,v,gamma);
    const e2 = Lorentz(x2,t2,v,gamma);

    return (
        <g>
            <line 
                x1={xScale(e1[0])} y1={yScale(e1[1])} 
                x2={xScale(e2[0])} y2={yScale(e2[1])} 
                stroke={data.color} strokeWidth="2" 
            />
        </g>
    );
};

export default Observer;