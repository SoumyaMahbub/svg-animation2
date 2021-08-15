import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";

const Layer = (props) => {
	const dispatch = useDispatch();
	const layers = useSelector((state) => state.svgJson.layers);
	const selLayer = useSelector((state) => state.selLayer.layer);
	let selLayerJson = {}
	let tempColorHex;

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
					if (layer.name.startsWith('layer_')) {
						$("[data-svg-layer-name=" + layer.name + "]").attr('stroke', '#2181cf');
						$("[data-svg-layer-name=" + layer.name + "]").addClass('highlighted');
					}else {
						const groupChildren = $("[data-svg-layer-name=" + layer.name + "]").children();
						for (var i=0; i < groupChildren.length; i++) {
							$(groupChildren[i]).attr('stroke', '#2181cf');
							$(groupChildren[i]).addClass('highlighted');
						}
					}
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

	const unhighlightPath = () => {
		if (selLayer.strokeColor) {
			$(".highlighted").attr('stroke', selLayer.strokeColor);
		}else {
			$(".highlighted").removeAttr('stroke');
		}
		$('.highlighted').removeClass('highlighted');

	}

	const unhighlightGroup = () => {
		selLayer['layers'].forEach(layer => {
			if (layer.strokeColor) {
				$(".highlighted").attr('stroke', layer.strokeColor);
			} else {
				$(".highlighted").removeAttr('stroke');
			}
			$('.highlighted').removeClass('highlighted');
		})
	}

	const clickOnLayer = (e) => {
		const clickedEl = $(e.currentTarget);

		// if there is selected element
		if (Object.keys(selLayer).length !== 0) {
			// if selected element is not the one clicked
			if ($("#selected").get(0) !== clickedEl.get(0)) {
				if (selLayer.type === "group") {
					unhighlightGroup();
				}else if (selLayer.type === "draw") {
					unhighlightPath();
				}
			
				changeSelLayer(
					clickedEl.children().eq(0).text(),
					layers
				);
			} else {
				if (selLayer.type === "group") {
					unhighlightGroup();
				}else if (selLayer.type === "draw"){
					unhighlightPath();
				}
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
					? "border border-2 p-3 d-flex justify-content-between"
					: props.type === "grouped"
					? "border border-2 p-3 d-flex justify-content-between bg-secondary"
					: "border border-2 p-3 d-flex justify-content-between bg-light text-black"
			}
			style={{ cursor: "pointer" }}
		>
			<p className="my-auto ms-2">{props.name}</p>

		</div>
	);
};

export default Layer;
