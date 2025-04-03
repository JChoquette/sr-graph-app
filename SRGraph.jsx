import React, { useState } from "react";
import Observer from "./Observer.jsx";
import Event from "./Event.jsx";

const get_gamma = (v) =>{
    return 1.0/Math.sqrt(1-v**2);
}

const item_inputs = {
    observer:[
        {name:"speed",label:"Speed"},
        {name:"x0",label:"x_0"},
    ],
    event:[
        {name:"x",label:"x"},
        {name:"t",label:"t"},
    ],
    extended:[
        {name:"speed",label:"Speed"},
        {name:"x0",label:"x_0"},
        {name:"length",label:"Length"},
    ],

}

const SRGraph = () => {
    //Graph basic parameters and scaling
    const width = 500, height = 500;
    const xScale = (x) => ((x + 10) / 20) * width;
    const yScale = (y) => height - ((y + 10) / 20) * height; // Flip y-axis
    const xUnscale = (px) => (px / width) * 20 - 10; // Convert pixels back to graph x-coordinates
    const yUnscale = (py) => 10 - (py / height) * 20; // Convert pixels back to graph y-coordinates

    //State variables
    const [v, setV] = useState(0); // State variable for the slider
    const [observers, setObservers] = useState([
        { id: 1, speed: 0.0, x0: 0, color: "#FF0000" },
        { id: 2, speed: 0.5, x0: 0, color: "#0000FF" },
    ]);
    const [events, setEvents] = useState([
    ]);
    const [extendeds, setExtendeds] = useState([
    ]);
    const [nextId, setNextId] = useState(3); // Unique ID counter for new observers
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const item_map = {
        event:[events,setEvents],
        observer:[observers,setObservers],
        extended:[extendeds,setExtendeds],
    }

    // Function to update a observer's values
    const updateItem = (type, id, key, value) => {
        let item_values = item_map[type];
        let item_array = item_values[0];
        let itemFunction = item_values[1];
        itemFunction(item_array.map(item => 
            item.id === id ? { ...item, [key]: key === "color" ? value: parseFloat(value) } : item
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
        itemFunction([...item_array, { id: nextId, speed: 0, x0: 0, x:0, t:0, color:"#00FF00" }]);
        setNextId(nextId + 1);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setCursorPos({ x: xUnscale(mouseX), y: yUnscale(mouseY) });
    };

    let gamma = get_gamma(v);

    return (
        <div style={{ display: "flex" }}>
            {/* Graph Area */}
            <div>
                <div>
                <svg width={width} height={height} onMouseMove={handleMouseMove}>
                    {/* Axes */}
                    <line x1={0} x2={width} y1={yScale(0)} y2={yScale(0)} stroke="black" />
                    <line x1={xScale(0)} x2={xScale(0)} y1={0} y2={height} stroke="black" />

                    {/* Render each observer */}
                    {observers.map((observer, index) => (
                        <Observer key={index} v={v} gamma={gamma} data={observer} xScale={xScale} yScale={yScale} />
                    ))}
                    {events.map((event, index) => (
                        <Event key={index} v={v} gamma={gamma} data={event} xScale={xScale} yScale={yScale} />
                    ))}
                </svg>
                </div>
                {/* Display cursor coordinates */}
                <p>Cursor: ({cursorPos.x.toFixed(2)}, {cursorPos.y.toFixed(2)})</p>
                {/* Slider */}
                <input 
                    type="range" 
                    min="-0.99" 
                    max="0.99" 
                    step="0.01" 
                    value={v} 
                    onChange={(e) => setV(parseFloat(e.target.value))}
                />
                <p>v = {v}</p>
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
                 {/* Event Controls */}
                <div style={{ marginLeft: "20px" }}>
                    <ItemControls 
                        type={"extended"} 
                        items={extendeds} 
                        addItem={addItem} 
                        updateItem={updateItem} 
                        removeItem={removeItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default SRGraph;

const ItemControls = ({type,items,addItem,updateItem,removeItem}) => {

    return (
        <div>
            <h3>{type}</h3>
            {items.map(item => (
                <div key={item.id} style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                    {item_inputs[type].map(input=>
                        <ItemInput type={type} item={item} updateItem={updateItem} name={input.name} label={input.label}/>
                    )}
                    {/* Color Picker */}
                    <input 
                        type="color" 
                        value={item.color} 
                        onChange={(e) => updateItem(type, item.id, "color", e.target.value)}
                    />
                    <button onClick={() => removeItem(type, item.id)}>Remove</button>
                </div>
            ))}
            <button onClick={()=>addItem(type)}>Add {type}</button>
        </div>
    );
}

const ItemInput = ({type, item,updateItem,name,label}) =>{
    return(
        [
            <span> {label}: </span>,
            <input 
                type="number" step="0.1" 
                value={item[name]} 
                onChange={(e) => updateItem(type, item.id, name, e.target.value)}
            />
        ]
    );
}