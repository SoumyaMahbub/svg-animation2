import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const OperationsContainer = () => {

    const selectedLayer = useSelector((state) => state.selLayer);
    const fileName = useSelector((state) => state.fileName);
    const svgJson = useSelector((state) => state.svgJson);
    const dispatch = useDispatch();
    const [options, setOptions] = useState([])
    let selLayerIdx;
    let selLayerName;

    useEffect(() => {
        dispatch({type: "REMOVELAYERLIST"})
    }, [fileName])

    useEffect(() => {
        if (Object.keys(selectedLayer).length === 0) {
            setOptions([]);
        }else {
            selLayerIdx = svgJson['layers'].findIndex(layer => layer === selectedLayer);
        }
    }, [selectedLayer])

    return (
        <div className="w-100 bg-white p-4" style={{ height: '300px' }}>
            <h6 className="mb-3">Selected Layer: {selectedLayer ? selectedLayer.name : ''}</h6>

            <div className={selectedLayer.name ? "input-group mb-3" : "invisible input-group mb-3"}>
                <span className="input-group-text fs-10p">Subtitle</span>
                <input type="text" className="form-control fs-10p" placeholder="Write subtitle for layer here" />
            </div>

            <div className="d-flex">

                <div className={selectedLayer.name ? "d-flex w-25 flex-shrink-0 mb-2" : "invisible d-flex w-25 flex-shrink-0 mb-2"}>
                    <select className="form-select d-inline align-middle fs-10p me-2" defaultValue="1">
                        <option value="1">Choose layer To erase</option>
                    </select>
                    <button className="btn btn-dark d-inline align-middle fs-10p">Add Erase Layer</button>  
                </div>

                <div className={selectedLayer.type === 'erase' ? "mx-4" : selectedLayer.type === 'group' ? "mx-4" : "invisible mx-4"}>
                    <h6 className="mb-0">Mode: </h6>
                    <div className="form-check fs-10p form-check-inline">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="sequentialRadio" />
                        <label className="form-check-label" htmlFor="sequentialRadio">
                            Sequential
                        </label>
                    </div>
                    <div className="form-check fs-10p form-check-inline">
                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="parallelRadio" checked />
                        <label className="form-check-label" htmlFor="parallelRadio">
                            Parallel
                        </label>
                    </div>

                </div>
            
            </div>

            <div className={selectedLayer.style === "stroke" ? "d-flex fs-10p" : "invisible d-flex fs-10p"}>

                <div id="stroke-width-group" className="d-flex flex-column me-2">
                    <label className="text-secondary" htmlFor="stroke-width-input">Stroke width:</label>
                    <input className="mt-2" id="strke-width-input" type="number" min="0" max="10" value={selectedLayer.strokeWidth ? selectedLayer.strokeWidth : ''} />
                </div>

                <div id="stroke-color-group" className="d-flex flex-column mx-2">
                    <label className="text-secondary" htmlFor="stroke-color-input">Stroke color:</label>
                    <input className="mt-2" id="strke-color-input" type="text" value={selectedLayer.strokeColor ? selectedLayer.strokeColor : ''} />
                </div>

                <div id="stroke-linecap-group" className="d-flex flex-column mx-2">
                    <label className="text-secondary" htmlFor="stroke-linecap-input">Stroke linecap:</label>
                    <input className="mt-2" id="strke-linecap-input" type="text" value={selectedLayer.strokeLineCap ? selectedLayer.strokeLineCap : ''} />
                </div>

                <div id="stroke-linejoin-group" className="d-flex flex-column mx-2">
                    <label className="text-secondary" htmlFor="stroke-linejoin-input">Stroke linejoin:</label>
                    <input className="mt-2" id="strke-linejoin-input" type="text" value={selectedLayer.strokeLineJoin ? selectedLayer.strokeLineJoin : ''} />
                </div>

            </div>

            <div className={selectedLayer.style === "fill" ? "d-flex fs-10p" : "invisible d-flex fs-10p"}>

                <div id="fill-color-group" className="d-flex flex-column me-2">
                    <label className="text-secondary" htmlFor="fill-color-input">fill Color:</label>
                    <input className="mt-2" id="fill-color-input" type="text" value={selectedLayer.fillColor} />
                </div>

            </div>

        </div>
    )
}

export default OperationsContainer
