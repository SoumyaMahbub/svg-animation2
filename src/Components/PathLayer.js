import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";

const PathLayer = (props) => {
	const dispatch = useDispatch();
	const layers = useSelector((state) => state.svgJson.layers);
	const selLayer = useSelector((state) => state.selLayer.layer);
	let selLayerJson = {}

	useEffect(() => {
		// if selLayer exists
		if (Object.keys(selLayer).length !== 0) {
			// if there is selected element
			if ($('#selected').length) {
				$('#selected').removeAttr("id");
			}
			const selLayerName = selLayer.name ? selLayer.name : selLayer.targetName;
			$("[data-layer-name=" + selLayerName + "]").attr('id', 'selected');

		} 
		// if selLayer doesn't exist
		else {
			// if there is selected element
			if ($('#selected').length) {
				$("#selected").removeAttr("id");
			}
		}
	}, [selLayer])

	const changeSelLayer = (layerName, layers, groupIdx="") => {
		let breakException = {};
		try {
			layers.forEach((layer, idx) => {
				if (layer.name === layerName) {
					selLayerJson = {
						layer: layer,
						idx: [idx, groupIdx]
					};
					dispatch({type: "CHANGESELLAYER", payload: selLayerJson });
					throw breakException;
				} 
				else if (layer.name.startsWith('group_')){
					return changeSelLayer(layerName, layer["layers"], idx);
				}
			});
		} catch(e) {
			if (e !== breakException) { return e;}
		}
	};

	const clickOnLayer = (e) => {
		const clickedEl = $(e.currentTarget);

		// if there is selected element
		if (Object.keys(selLayer).length !== 0) {
			// if selected element is not the one clicked
			if ($("#selected").get(0) !== clickedEl.get(0)) {
				changeSelLayer(
					clickedEl.children().eq(0).text(),
					layers
				);
			} else {
				dispatch({type: "REMOVESELLAYER"});
			}
		} else {
			changeSelLayer(
				clickedEl.children().eq(0).text(),
				layers
			);
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
