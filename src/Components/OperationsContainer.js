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
    let newOptions = [];

    // selected Layer change
    useEffect(() => {
        // set Erase Lyaer Options
        setOptions([]);
        if (Object.keys(selLayer).length !== 0) {
            let layersBeforeSel;
            if (selLayer.type !== "erase") {
                layersBeforeSel = layerList.slice(0, layerList.indexOf(selLayer.name) + 1);
            } else {
                layers.forEach((layer,idx) => {
                    if (layer.name === selLayer.name) {
                        layersBeforeSel = layerList.slice(0, layerList.indexOf(layers[idx-1].name) + 1);
                    }
                })
            }
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

    const addEraseLayer = (e) => {
        const eraseLayerJson = {
            type: 'erase',
            name: 'erase_' + $('#erase-layer-select').val(),
            drawMode: 'parallel'
        }
        changeSingleLayer('add', eraseLayerJson);
        const newLayerList = [...layerList];
        newLayerList.splice(layerList.indexOf($('#erase-layer-select').val()), 1);
        dispatch({type: "CHANGELAYERLIST", payload: newLayerList});
        const layersBeforeSel = layerList.slice(0, layerList.indexOf(selLayer.name) + 1);
        layersBeforeSel.splice(layerList.indexOf($('#erase-layer-select').val()), 1);
        let valueCounter = 1;
        newOptions = [];
        layersBeforeSel.forEach((layer) => {
            const key = valueCounter;
            newOptions.push(<option key={key} value={layer}>{layer}</option>);
            valueCounter++;
        })
        setOptions(newOptions);
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
        const newLayerList = [...layerList];
        if (selLayer.type === "erase") {
            const erasedLayerName = selLayer.name.replace('erase_', "");
            let index; 
            layers.forEach((layer,idx) => {
                if (layer.name === erasedLayerName) {
                    index = idx - 1;
                }
            })
            newLayerList.splice(index, 0, erasedLayerName);
            dispatch({type: 'CHANGELAYERLIST', payload: newLayerList});
        }else {
            newLayerList.splice(layerList.indexOf(selLayer.name), 1);
            dispatch({type: 'CHANGELAYERLIST', payload: newLayerList});
        }
    }

    return (
        <div className="w-100 bg-white p-4">

            <div className={selLayer.name ? "d-flex mb-3" : "d-flex invisible mb-3"}>
                <div className="input-group me-3">
                    <span className="input-group-text">Subtitle</span>
                    <input type="text" id="subtitle-input" className="form-control" placeholder="Write subtitle for layer here" onBlur={updateSubtitle} autoComplete="off" />
                </div>
                <button onClick={deleteLayer} className="flex-shrink-0 btn btn-danger me-3"><i className="fas fa-trash-alt"></i></button>
            </div>


            <div className="row">

                <div className={selLayer.name ? "d-flex col mb-2" : "invisible d-flex col mb-2"}>
                    <div className="input-group">
                        <select id="erase-layer-select" className="form-select" defaultValue="1">
                            {options}
                        </select>
                        <button className="btn btn-secondary" type="button" onClick={addEraseLayer}>Add Erase Layer Below</button>
                    </div>
                </div>

                <div className={selLayer.type === 'erase' ? "mx-4 col" : selLayer.type === 'group' ? "mx-4 col" : "invisible mx-4 col"} onChange={changeDrawType}>
                    <h6 className="mb-0">Mode: </h6>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" data-value="sequential" type="radio" name="drawTypeRadio" id="sequentialRadio" />
                        <label className="form-check-label" htmlFor="sequentialRadio">
                            Sequential
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" data-value="parallel" type="radio" name="drawTypeRadio" id="parallelRadio" />
                        <label className="form-check-label" htmlFor="parallelRadio">
                            Parallel
                        </label>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default OperationsContainer
