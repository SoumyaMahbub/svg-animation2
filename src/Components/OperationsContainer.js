import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import $ from "jquery";

const OperationsContainer = () => {

    const dispatch = useDispatch();
    const selLayerObj = useSelector((state) => state.selLayer);
    const selLayer = selLayerObj.layer;
    const selLayerIdx = selLayerObj.idx;
    const svgJson = useSelector((state) => state.svgJson);
    const layers = svgJson.layers
    const layerList = useSelector((state) => state.layerList);
    const [options, setOptions] = useState([]);
    const [erasableLayers, setErasableLayers] = useState([...layerList]);
    let newOptions = [];

    // selected Layer change
    useEffect(() => {
        // set Erase Lyaer Options
        setOptions([]);
        if (Object.keys(selLayer).length !== 0) {
            const layersBeforeSel = layerList.slice(0, selLayerIdx[0]+1);
            let valueCounter = 1;
            newOptions = [];
            layersBeforeSel.forEach((layer) => {
                const key = valueCounter;
                newOptions.push(<option key={key} value={layer}>{layer}</option>);
                valueCounter++;
            })
            setOptions(newOptions);
        }

        // subtitle input value set
        const subtitle = selLayer.subtitleEn ? selLayer.subtitleEn : ""
        $('#subtitle-input').val(subtitle);

        // draw/erase mode check
        if (selLayer.type === 'erase' || selLayer.type === "group") {
            if (selLayer.drawMode === "sequential") {
                $('#sequentialRadio').prop("checked", true);
            } else {
                $('#parallelRadio').prop("checked", true);
            }
        }

    }, [selLayer]);

    const changeSingleLayer = (type, newSelLayerObj) => {
        let newLayers;
        // edit a layer
        if (type === "edit") {
            if (selLayerIdx[1] === "") {
                newLayers = [...layers.slice(0, selLayerIdx[0]), newSelLayerObj['layer'], ...layers.slice(selLayerIdx[0] + 1)];
            } else {
                const groupLayer = { ...layers[selLayerIdx[1]] };
                groupLayer['layers'].splice(selLayerIdx[0], 1, newSelLayerObj['layer']);
                newLayers = [...layers.slice(0, selLayerIdx[1]), groupLayer, ...layers.slice(selLayerIdx[1] + 1)];
            }
            dispatch({ type: 'CHANGESELLAYER', payload: newSelLayerObj });
        }
        // add a new layer
        else if (type == "add") {
            if (selLayerIdx[1] === "") {
                newLayers = [...layers.slice(0, selLayerIdx[0] + 1), newSelLayerObj, ...layers.slice(selLayerIdx[0] + 1)];
            } else {
                const groupLayer = { ...layers[selLayerIdx[1]] };
                groupLayer['layers'].splice(selLayerIdx[0] + 1, 0, newSelLayerObj);
                newLayers = [...layers.slice(0, selLayerIdx[1]), groupLayer, ...layers.slice(selLayerIdx[1] + 1)];
            }
        }
        // delete a layer
        else {
            if (selLayerIdx[1] === "") {
                newLayers = [...layers];
                newLayers.splice(selLayerIdx[0], 1);
            } else {
                const groupLayer = { ...layers[selLayerIdx[1]] };
                groupLayer['layers'].splice(selLayerIdx[0], 1);
                newLayers = [...layers.slice(0, selLayerIdx[1]), groupLayer, ...layers.slice(selLayerIdx[1] + 1)];
            }
            dispatch({ type: 'REMOVESELLAYER' });
        }
        const newJson = { ...svgJson };
        newJson['layers'] = newLayers;
        dispatch({ type: 'CHANGESVGJSON', payload: newJson });
    }

    const addEraseLayer = () => {
        const eraseLayerJson = {
            type: 'erase',
            name: 'erase_' + $('#erase-layer-select').val(),
            drawMode: 'parallel'
        }
        changeSingleLayer('add', eraseLayerJson);
    }

    const changeDrawType = () => {
        const chosenDrawType = $('input[name="drawTypeRadio"]:checked').attr('data-value');
        const newSelLayerObj = { ...selLayerObj };
        newSelLayerObj['layer']['drawMode'] = chosenDrawType;
        changeSingleLayer('edit', newSelLayerObj);
    }

    const updateSubtitle = (e) => {
        if (e.target.value !== "") {
            const newSelLayerObj = { ...selLayerObj };
            newSelLayerObj['layer']['subtitleEn'] = e.target.value;
            changeSingleLayer('edit', newSelLayerObj);
        }
        else {
            if (selLayer.subtitleEn) {
                const newSelLayerObj = { ...selLayerObj };
                delete newSelLayerObj['layer']['subtitleEn'];
                changeSingleLayer('edit', newSelLayerObj);
            }
        }
    }

    const deleteLayer = () => {
        changeSingleLayer('delete', "");
    }

    return (
        <div className="w-100 bg-white p-4">

            <div className={selLayer.name ? "d-flex mb-3" : "d-flex invisible mb-3"}>
                <div className="input-group me-3">
                    <span className="input-group-text fs-10p">Subtitle</span>
                    <input type="text" id="subtitle-input" className="form-control fs-10p" placeholder="Write subtitle for layer here" onBlur={updateSubtitle} autoComplete="off" />
                </div>
                <button onClick={deleteLayer} className="flex-shrink-0 btn btn-danger fs-10p me-3"><i class="fas fa-trash-alt"></i></button>
            </div>


            <div className="d-flex">

                <div className={selLayer.name ? "d-flex w-25 flex-shrink-0 mb-2" : "invisible d-flex w-25 flex-shrink-0 mb-2"}>
                    <select id="erase-layer-select" className="form-select d-inline align-middle fs-10p me-2" defaultValue="1">
                        {options}
                    </select>
                    <button className="btn btn-dark d-inline align-middle fs-10p" onClick={addEraseLayer}>Add Erase Layer</button>
                </div>

                <div className={selLayer.type === 'erase' ? "mx-4" : selLayer.type === 'group' ? "mx-4" : "invisible mx-4"} onChange={changeDrawType}>
                    <h6 className="mb-0">Mode: </h6>
                    <div className="form-check fs-10p form-check-inline">
                        <input className="form-check-input" data-value="sequential" type="radio" name="drawTypeRadio" id="sequentialRadio" />
                        <label className="form-check-label" htmlFor="sequentialRadio">
                            Sequential
                        </label>
                    </div>
                    <div className="form-check fs-10p form-check-inline">
                        <input className="form-check-input" data-value="parallel" type="radio" name="drawTypeRadio" id="parallelRadio" />
                        <label className="form-check-label" htmlFor="parallelRadio">
                            Parallel
                        </label>
                    </div>

                </div>

            </div>

            <div className={selLayer['strokeWidth'] ? "d-flex fs-10p" : "invisible d-flex fs-10p"}>

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

            <div className={selLayer['fillColor'] ? "d-flex fs-10p" : "invisible d-flex fs-10p"}>

                <div id="fill-color-group" className="d-flex flex-column me-2">
                    <label className="text-secondary" htmlFor="fill-color-input">fill Color:</label>
                    <input className="mt-2" id="fill-color-input" type="text" value={selLayer.fillColor} />
                </div>

            </div>

        </div>
    )
}

export default OperationsContainer
