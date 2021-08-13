import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PathLayer from "./PathLayer";

const LayerContainer = () => {
	const dispatch = useDispatch();
	const layers = useSelector((state) => state.svgJson.layers);
	const [layerElements, setLayerElements] = useState([]);
	let layerKey = 1;

	const generateLayer = (layer, type) => {
		dispatch({type: "PUSHLAYERLIST", payload: layer.name})
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
		if (layers) {
			if (layerElements.length !== 0) {
				setLayerElements([])
			}
			layers.forEach((layer) => {
				generateLayer(layer, "normal");
			});
		}
	}, [layers]);

	return (
		<div id="layer-container" className="overflow-auto">
			{layerElements}
		</div>
	);
};

export default LayerContainer;
