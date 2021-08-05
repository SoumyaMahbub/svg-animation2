import React from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";

const PathLayer = (props) => {
	const dispatch = useDispatch();
	const layers = useSelector((state) => state.svgJson.layers);
	let selLayerJson = {}

	const getSelLayerJson = (layerName, layers) => {
		let breakException = {}
		try {
			layers.forEach((layer) => {
				if (layer.name.startsWith("layer_")) {
					if (layer.name === layerName) {
						selLayerJson = layer;
						throw breakException;
					}
				} else {
					if (layer.name === layerName) {
						selLayerJson = layer;
						throw breakException;
					} else {
						return getSelLayerJson(layerName, layer["layers"]);
					}
				}
			});
		} catch(e) {
			if (e !== breakException) { return e;}
		}
	};

	const clickOnLayer = (e) => {
		const clickedEl = $(e.currentTarget);

		// if there is selected element
		if ($("#selected").length) {
			// if selected element is not the one clicked
			if ($("#selected").get(0) !== clickedEl.get(0)) {
				$("#selected").removeAttr("id");
				$(clickedEl).attr("id", "selected");
				getSelLayerJson(
					clickedEl.children().eq(0).text(),
					layers
				);
				dispatch({type: "CHANGESELLAYER", payload: selLayerJson });
			} else {
				$("#selected").removeAttr("id");
				selLayerJson = {}
				dispatch({type: "REMOVESELLAYER"})
			}
		} else {
			$(clickedEl).attr("id", "selected");
			getSelLayerJson(
				clickedEl.children().eq(0).text(),
				layers
			);
			dispatch({type: "CHANGESELLAYER", payload: selLayerJson });
		}
	};

	return (
		<div
			onClick={clickOnLayer}
			data-layer-name={props.name}
			className={
				props.type === "normal"
					? "border border-2 p-3 d-flex"
					: props.type === "grouped"
					? "border border-2 p-3 d-flex bg-secondary"
					: "border border-2 p-3 d-flex bg-light text-black"
			}
			style={{ cursor: "pointer" }}
		>
			<p className="my-auto ms-2">{props.name}</p>
		</div>
	);
};

export default PathLayer;
