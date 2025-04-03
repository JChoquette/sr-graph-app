export const Lorentz = (x,t,v,gamma) => {
    let xp = gamma*(x-v*t);
    let tp = gamma*(t-v*x);
    return {x:xp,t:tp};
}


export const get_gamma = (v) =>{
    return 1.0/Math.sqrt(1-v**2);
}