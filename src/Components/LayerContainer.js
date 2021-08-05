import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PathLayer from "./PathLayer";

const LayerContainer = () => {
	const layers = useSelector((state) => state.svgJson.layers);
	const [layerElements, setLayerElements] = useState([]);
	let layerKey = 1;

	const generateLayer = (layer, type) => {
		const key = layerKey;
		if (layer.name.startsWith("layer_")) {
			setLayerElements((prevState) => [
				...prevState,
				<PathLayer key={10000 + key} name={layer.name} type={type} />,
			]);
			layerKey++;
		} else {
			setLayerElements((prevState) => [
				...prevState,
				<PathLayer key={10000 + key} name={layer.name} type="group" />,
			]);
			layerKey++;
			layer["layers"].forEach((subLayer) => {
				generateLayer(subLayer, "grouped");
			});
		}
	};

	useEffect(() => {
		if (layerElements.length === 0 && layers) {
			layers.forEach((layer) => {
				generateLayer(layer, "normal");
			});
		}
	}, [layers, layerElements]);

	return (
		<div id="layer-container" className="overflow-auto">
			{layerElements}
		</div>
	);
};

export default LayerContainer;
