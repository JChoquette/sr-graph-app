/**
 * @file SRGraph.jsx
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

import React, { useState } from "react";
import Observer from "./Observer.jsx";
import Event from "./Event.jsx";
import Extended from "./Extended.jsx";
import Segment from "./Segment.jsx";
import * as Constants from "./Constants.js"
import './SR.css';

const starting_observers = [
    { id: 1, speed: 0.0, x0: 0, color: "#0000FF" },
    { id: 2, speed: 0.5, x0: 0, color: "#FF0000" },
]

const default_item = { 
     speed: 0,
     x0: 0, 
     x:0, 
     t:0, 
     length:2,
     x1:0,
     x2:2,
     t1:0,
     t2:4,
     color:"#00AA00" 
}

const item_labels = {
    observer:"Observers:",
    event:"Events:",
    extended:"Extended Objects:",
    segment:"Segments:",
}

const item_inputs = {
    observer:[
        {name:"speed",label:"Velocity"},
        {name:"x0",label:"x0"},
    ],
    event:[
        {name:"x",label:"x"},
        {name:"t",label:"t"},
        {name:"speed",label:"v (measurement frame)"},
    ],
    extended:[
        {name:"speed",label:"Velocity"},
        {name:"x0",label:"x0"},
        {name:"length",label:"Proper Length"},
    ],
    segment:[
        {name:"x1",label:"x_1"},
        {name:"t1",label:"t_1"},
        {name:"x2",label:"x_2"},
        {name:"t2",label:"t_2"},
    ],
}

const input_ranges = {
    x:{min:-10,max:10},
    t:{min:-10,max:10},
    x0:{min:-10,max:10},
    x1:{min:-10,max:10},
    t1:{min:-10,max:10},
    x2:{min:-10,max:10},
    t2:{min:-10,max:10},
    speed:{min:-1,max:1},

}

const SRGraph = () => {
    //Graph basic parameters and scaling
    const width = 600, height = 600;
    const xScale = (x) => ((x + 10) / 20) * width;
    const yScale = (y) => height - ((y + 10) / 20) * height; // Flip y-axis
    const xUnscale = (px) => (px / width) * 20 - 10; // Convert pixels back to graph x-coordinates
    const yUnscale = (py) => 10 - (py / height) * 20; // Convert pixels back to graph y-coordinates

    //State variables
    const [v, setV] = useState(0); // State variable for the slider
    const [observers, setObservers] = useState([
        ...starting_observers
    ]);
    const [events, setEvents] = useState([]);
    const [extendeds, setExtendeds] = useState([]);
    const [segments, setSegments] = useState([]);
    const [nextId, setNextId] = useState(3); // Unique ID counter for new observers
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const item_map = {
        event:[events,setEvents],
        observer:[observers,setObservers],
        extended:[extendeds,setExtendeds],
        segment:[segments,setSegments],
    }

    // Function to update a observer's values
    const updateItem = (type, id, key, value) => {
        let item_values = item_map[type];
        let item_array = item_values[0];
        let itemFunction = item_values[1];
        itemFunction(item_array.map(item => 
            item.id === id ? { ...item, [key]: (key === "color" || key === "show_axis" || key === "show_original") ? value: parseFloat(value) } : item
        ));
    };

    // Function to remove a observer
    const removeItem = (type,id) => {
        let item_values = item_map[type];
        let item_array = item_values[0];
        let itemFunction = item_values[1];
        itemFunction(item_array.filter(item => item.id !== id));
    };

    // Function to add a new observer
    const addItem = (type) => {
        let item_values = item_map[type];
        let item_array = item_values[0];
        let itemFunction = item_values[1];
        itemFunction([...item_array, {...default_item, id: nextId,}]);
        setNextId(nextId + 1);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setCursorPos({ x: xUnscale(mouseX), y: yUnscale(mouseY) });
    };

    const clearAll = () =>{
        setEvents([]);
        setExtendeds([]);
        setSegments([]);
        setObservers([...starting_observers]);
        setV(0);
    };

    let gamma = Constants.get_gamma(v);

    return (
        <div>
            <h2>Lorentz Transformation Simulation</h2>
            <div style={{ display: "flex" }}>
                {/* Graph Area */}
                <div>
                    <div>
                    <svg width={width} height={height} onMouseMove={handleMouseMove}>
                        {/* Axes */}
                        <line x1={xScale(-10)} x2={xScale(10)} y1={yScale(0)} y2={yScale(0)} stroke="black" />
                        <line x1={xScale(0)} x2={xScale(0)} y1={yScale(-10)} y2={yScale(10)} stroke="black" />
                        {/* Grid */}
                        {Constants.linspace(-10,10,11).map((number)=>[
                            <line x1={xScale(-10)} x2={xScale(10)} y1={yScale(number)} y2={yScale(number)} stroke="black" opacity={0.5}/>,
                            <line x1={xScale(number)} x2={xScale(number)} y1={yScale(-10)} y2={yScale(10)} stroke="black" opacity={0.5}/>
                        ])}
                        {/* X Axis Label */}
                        <text 
                            x={xScale(10)-30} 
                            y={yScale(0)-10} 
                            textAnchor="middle" 
                            fontSize="22"
                        >
                            x/c (s)
                        </text>

                        {/* Y Axis Label */}
                        <text 
                            x={xScale(0)+20} 
                            y={yScale(10)+20} 
                            textAnchor="middle" 
                            fontSize="22"
                        >
                            t (s)
                        </text>
                        {/* Render each observer */}
                        {observers.map((observer, index) => (
                            <Observer key={index} v={v} gamma={gamma} data={observer} xScale={xScale} yScale={yScale} />
                        ))}
                        {events.map((event, index) => (
                            <Event key={index} v={v} gamma={gamma} data={event} xScale={xScale} yScale={yScale} />
                        ))}
                        {extendeds.map((extended, index) => (
                            <Extended key={index} v={v} gamma={gamma} data={extended} xScale={xScale} yScale={yScale} />
                        ))}
                        {segments.map((segment, index) => (
                            <Segment key={index} v={v} gamma={gamma} data={segment} xScale={xScale} yScale={yScale} />
                        ))}
                        {/* Current cursor position */}
                        <g stroke="black" strokeWidth="1">
                            {/* Vertical line */}
                            <line x1={xScale(cursorPos.x)} y1={yScale(cursorPos.y) - 5} x2={xScale(cursorPos.x)} y2={yScale(cursorPos.y) + 5} />
                            {/* Horizontal line */}
                            <line x1={xScale(cursorPos.x) - 5} y1={yScale(cursorPos.y)} x2={xScale(cursorPos.x) + 5} y2={yScale(cursorPos.y)} />
                            <text
                                x={xScale(-10)+10}
                                y={yScale(-10)-20}
                                fontsize="18"
                            >
                                Cursor: ({cursorPos.x.toFixed(2)}, {cursorPos.y.toFixed(2)})
                            </text>
                        </g>
                    </svg>
                    </div>
                    <div class="vslider">
                        <input 
                            type="range" 
                            min="-0.99" 
                            max="0.99" 
                            step="0.01" 
                            value={v} 
                            onChange={(e) => setV(parseFloat(e.target.value))}
                        />
                        <div>v = {v}</div>
                    </div>
                    <div class="bottom-options">
                        {/* Slider */}
                        <button onClick={()=>clearAll()}>Reset</button>
                    </div>
                </div>
                <div>
                     {/* Observer Controls */}
                    <div style={{ marginLeft: "20px" }}>
                        <ItemControls 
                            type={"observer"} 
                            items={observers} 
                            addItem={addItem} 
                            updateItem={updateItem} 
                            removeItem={removeItem}
                        />
                    </div>
                     {/* Event Controls */}
                    <div style={{ marginLeft: "20px" }}>
                        <ItemControls 
                            type={"event"} 
                            items={events} 
                            addItem={addItem} 
                            updateItem={updateItem} 
                            removeItem={removeItem}
                        />
                    </div>
                     {/* Extended Object Controls */}
                    <div style={{ marginLeft: "20px" }}>
                        <ItemControls 
                            type={"extended"} 
                            items={extendeds} 
                            addItem={addItem} 
                            updateItem={updateItem} 
                            removeItem={removeItem}
                        />
                    </div>
                     {/* Segment Controls */}
                    <div style={{ marginLeft: "20px" }}>
                        <ItemControls 
                            type={"segment"} 
                            items={segments} 
                            addItem={addItem} 
                            updateItem={updateItem} 
                            removeItem={removeItem}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SRGraph;

const ItemControls = ({type,items,addItem,updateItem,removeItem}) => {

    return (
        <div>
            <h3>{item_labels[type]}</h3>
            {items.map(item => (
                <div class="item-control-row" key={item.id}>
                    {/* Color Picker */}
                    <input 
                        class="color-input"
                        type="color" 
                        value={item.color} 
                        onChange={(e) => updateItem(type, item.id, "color", e.target.value)}
                    />
                    {item_inputs[type].map(input=>
                        <ItemInput type={type} item={item} updateItem={updateItem} name={input.name} label={input.label}/>
                    )}
                    <div class="checkboxes">
                        {(type=="observer" || type=="extended") && 
                            <div>
                                <input type="checkbox" checked={item.show_axis} onChange={(e)=>{console.log(e);updateItem(type, item.id, "show_axis", e.target.checked);}}/>
                                <span>Show Axis</span>
                            </div>
                        }
                        <div>
                            <input type="checkbox" checked={item.show_original} onChange={(e)=>{console.log(e);updateItem(type, item.id, "show_original", e.target.checked);}}/>
                            <span>Show Untransformed</span>
                        </div>
                    </div>
                    <button onClick={() => removeItem(type, item.id)}>Remove</button>
                </div>
            ))}
            <button onClick={()=>addItem(type)}>Add {type}</button>
        </div>
    );
}

const ItemInput = ({type, item,updateItem,name,label}) =>{
    return(
        <div class="input-slider">
            <span> {label}: {item[name]}</span>
            <input 
                type="range" 
                min={input_ranges[name].min}
                max={input_ranges[name].max}
                step="0.01"  
                value={item[name]} 
                onChange={(e) => updateItem(type, item.id, name, e.target.value)}
            />
        </div>
    );
}