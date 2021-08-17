import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layer from "./Layer";

const LayerContainer = () => {
	const dispatch = useDispatch();
	const svgJson = useSelector((state) => state.svgJson);
	const layers = svgJson.layers
	const [layerElements, setLayerElements] = useState([]);
	let layerKey = 1;
	let layerList = [];

	const generateLayer = (layer, type) => {
		layerList.push(layer.name);
		const key = layerKey;
		if (layer.name.startsWith("group_") === false) {
			setLayerElements((prevState) => [
				...prevState,
				<Layer key={10000 + key} name={layer.name} type={type} layerType={layer.type} />,
			]);
			layerKey++;
		} else {
			setLayerElements((prevState) => [
				...prevState,
				<Layer key={10000 + key} name={layer.name} type="group" layerType={layer.type} />,
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
			layerList = [];
			layers.forEach((layer) => {
				generateLayer(layer, "normal");
			});
			dispatch({type: 'CHANGELAYERLIST', payload: layerList});
		}
	}, [layers]);

	return (
		<div id="layer-container" className="overflow-auto">
			{layerElements}
		</div>
	);
};

export default LayerContainer;
