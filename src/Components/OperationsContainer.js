import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const OperationsContainer = () => {

    const selLayer = useSelector((state) => state.selLayer);
    const layers = useSelector((state) => state.svgJson.layers)
    const layerList = useSelector((state) => state.layerList);
    const [options, setOptions] = useState([])

    useEffect(() => {
        setOptions([]);
        if (Object.keys(selLayer).length !== 0) {
            const selLayerIdx = layerList.indexOf(selLayer.name);
            const layersBeforeSel = layerList.slice(0, selLayerIdx + 1);
            let valueCounter = 1;
            layersBeforeSel.forEach((layer) => {
                const key = valueCounter;
                setOptions(prevState => [...prevState, <option key={key} value={key}>{layer}</option>])
                valueCounter++;
            })
        }
    }, [selLayer])

    const findLayerIdx = (layers, ) => {
        layers.forEach((layer, idx) => {
            if (layer.name === selLayer.name) {
                console.log(idx);
            } 
        })
    }

    const addEraseLayer = () => {
    //     eraseLayerJson = {type: 'erase',
    //                       name: 'erase_' +   
    // }
        findLayerIdx(layers)
    }

    return (
        <div className="w-100 bg-white p-4" style={{ height: '225px' }}>

            <div className={selLayer.name ? "input-group mb-3" : "invisible input-group mb-3"}>
                <span className="input-group-text fs-10p">Subtitle</span>
                <input type="text" className="form-control fs-10p" placeholder="Write subtitle for layer here" />
            </div>

            <div className="d-flex">

                <div className={selLayer.name ? "d-flex w-25 flex-shrink-0 mb-2" : "invisible d-flex w-25 flex-shrink-0 mb-2"}>
                    <select id="erase-layer-select" className="form-select d-inline align-middle fs-10p me-2" defaultValue="1">
                        {options}
                    </select>
                    <button className="btn btn-dark d-inline align-middle fs-10p" onClick={addEraseLayer}>Add Erase Layer</button>  
                </div>

                <div className={selLayer.type === 'erase' ? "mx-4" : selLayer.type === 'group' ? "mx-4" : "invisible mx-4"}>
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

            <div className={selLayer.style === "stroke" ? "d-flex fs-10p" : "invisible d-flex fs-10p"}>

                <div id="stroke-width-group" className="d-flex flex-column me-2">
                    <label className="text-secondary" htmlFor="stroke-width-input">Stroke width:</label>
                    <input className="mt-2" id="strke-width-input" type="number" min="0" max="10" value={selLayer.strokeWidth ? selLayer.strokeWidth : ''} />
                </div>

                <div id="stroke-color-group" className="d-flex flex-column mx-2">
                    <label className="text-secondary" htmlFor="stroke-color-input">Stroke color:</label>
                    <input className="mt-2" id="strke-color-input" type="text" value={selLayer.strokeColor ? selLayer.strokeColor : ''} />
                </div>

                <div id="stroke-linecap-group" className="d-flex flex-column mx-2">
                    <label className="text-secondary" htmlFor="stroke-linecap-input">Stroke linecap:</label>
                    <input className="mt-2" id="strke-linecap-input" type="text" value={selLayer.strokeLineCap ? selLayer.strokeLineCap : ''} />
                </div>

                <div id="stroke-linejoin-group" className="d-flex flex-column mx-2">
                    <label className="text-secondary" htmlFor="stroke-linejoin-input">Stroke linejoin:</label>
                    <input className="mt-2" id="strke-linejoin-input" type="text" value={selLayer.strokeLineJoin ? selLayer.strokeLineJoin : ''} />
                </div>

            </div>

            <div className={selLayer.style === "fill" ? "d-flex fs-10p" : "invisible d-flex fs-10p"}>

                <div id="fill-color-group" className="d-flex flex-column me-2">
                    <label className="text-secondary" htmlFor="fill-color-input">fill Color:</label>
                    <input className="mt-2" id="fill-color-input" type="text" value={selLayer.fillColor} />
                </div>

            </div>

        </div>
    )
}

export default OperationsContainer
