import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layer from "./Layer";

const LayerContainer = () => {
	const svgJson = useSelector((state) => state.svgJson);
	const [layerElements, setLayerElements] = useState([]);
	let newLayerElements = [];
	let layerKey = 1;

	const generateLayer = (layer, type, groupName="") => {
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
		if (svgJson.layers) {
			if (layerElements.length !== 0) {
				setLayerElements([])
			}
			newLayerElements = [];
			svgJson.layers.forEach((layer) => {
				generateLayer(layer, "normal");
			});
			setLayerElements(newLayerElements);
		}
	}, [svgJson]);

	return (
		<div id="layer-container" className="overflow-auto my-3">
			{layerElements}
		</div>
	);
};

export default LayerContainer;
