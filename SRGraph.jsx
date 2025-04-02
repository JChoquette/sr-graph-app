import  { React, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const SRGraph = () => {
    const svgRef = useRef();
    const [lines, setLines] = useState([{ slope: 1, intercept: 0 }]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 400, height = 400;
        const margin = 40;
        const xScale = d3.scaleLinear().domain([-10, 10]).range([margin, width - margin]);
        const yScale = d3.scaleLinear().domain([-10, 10]).range([height - margin, margin]);

        // Draw axes
        const xAxis = d3.axisBottom(xScale).ticks(10);
        const yAxis = d3.axisLeft(yScale).ticks(10);
        
        svg.append("g")
            .attr("transform", `translate(0,${height / 2})`)
            .call(xAxis);
        
        svg.append("g")
            .attr("transform", `translate(${width / 2},0)`)
            .call(yAxis);

        // Draw lines
        lines.forEach(({ slope, intercept }) => {
            svg.append("line")
                .attr("x1", xScale(-10))
                .attr("y1", yScale(-10 * slope + intercept))
                .attr("x2", xScale(10))
                .attr("y2", yScale(10 * slope + intercept))
                .attr("stroke", "black");
        });
    }, [lines]);

    return <svg ref={svgRef} width={400} height={400}></svg>;
};

export default SRGraph;
