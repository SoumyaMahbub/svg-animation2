import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layer from "./Layer";

const LayerContainer = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state)
	const svgJson = useSelector((state) => state.svgJson);
	const [layerElements, setLayerElements] = useState([]);
	let newLayerElements = [];
	let layerKey = 1;
	let layerList = [];

	const generateLayer = (layer, type, groupName="") => {
		if (type !== "grouped") {
			layerList.push(layer.name);
		}	
		const key = layerKey;
		if (layer.type !== "group") {
			newLayerElements.push(<Layer key={10000 + key} name={layer.name} type={type} groupName={groupName} layerType={layer.type} />)
			layerKey++;
		} else {
			newLayerElements.push(<Layer key={10000 + key} name={layer.name} type="group" layerType={layer.type}/>)
			layerKey++;
			layer['layers'].forEach(subLayer => {
				generateLayer(subLayer, "grouped", layer.name);
			})
		}
	};

	useEffect(() => {
	}, [state.svgJson])
	
	useEffect(() => {
		if (svgJson.layers) {
			if (layerElements.length !== 0) {
				setLayerElements([])
			}
			layerList = [];
			newLayerElements = [];
			svgJson.layers.forEach((layer) => {
				generateLayer(layer, "normal");
			});
			setLayerElements(newLayerElements);
			dispatch({type: 'CHANGELAYERLIST', payload: layerList});
		}
	}, [svgJson]);

	return (
		<div id="layer-container" className="overflow-auto">
			{layerElements}
		</div>
	);
};

export default LayerContainer;
