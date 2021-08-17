import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";

const Layer = (props) => {
	const dispatch = useDispatch();
	const svgJson = useSelector((state) => state.svgJson)
	const layers = svgJson.layers;
	const selLayer = useSelector((state) => state.selLayer.layer);
	let selLayerJson = {};
	let tempColorHex;

	useEffect(() => {
		// if selLayer exists
		if (Object.keys(selLayer).length !== 0) {
			// if there is selected element
			if ($('#selected').length) {
				$('#selected').removeAttr("id");
			}
			$("[data-layer-name=" + selLayer.name + "]").attr('id', 'selected');

		}
		// if selLayer doesn't exist
		else {
			// if there is selected element
			if ($('#selected').length) {
				$("#selected").removeAttr("id");
			}
		}
	}, [selLayer]);

	const addPreview = (layers, insideGroup=false) => {
		layers.forEach((layer) => {
			const svg = $("#" + layer.name)[0].outerHTML;
			const previewSvg = $("#preview_" + layer.name).children()
			$("#preview_" + layer.name).html(svg);
			previewSvg.removeAttr('id');
			if (layer.type === "group") {
				addPreview(layer['layers'], true);
			}
		})
	}

	useEffect(() => {
		addPreview(layers);
	}, [layers])

	const changeSelLayer = (layerName, layers, groupIdx = "") => {
		let breakException = {};
		try {
			layers.forEach((layer, idx) => {
				if (layer.name === layerName) {
					selLayerJson = {
						layer: layer,
						idx: [idx, groupIdx]
					};
					dispatch({ type: "CHANGESELLAYER", payload: selLayerJson });
					if (layer.name.startsWith('layer_')) {
						$("#" + layer.name).attr('stroke', '#2181cf');
						$("#" + layer.name).addClass('highlighted');
					} else {
						const groupChildren = $("#" + layer.name).children();
						for (var i = 0; i < groupChildren.length; i++) {
							$(groupChildren[i]).attr('stroke', '#2181cf');
							$(groupChildren[i]).addClass('highlighted');
						}
					}
					throw breakException;
				}
				else if (layer.name.startsWith('group_')) {
					return changeSelLayer(layerName, layer["layers"], idx);
				}
			});
		} catch (e) {
			if (e !== breakException) { return e; }
		}
	};

	const unhighlightPath = () => {
		if (selLayer.strokeColor) {
			$(".highlighted").attr('stroke', selLayer.strokeColor);
		} else {
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
				} else if (selLayer.type === "draw") {
					unhighlightPath();
				}

				changeSelLayer(
					clickedEl.children().eq(0).text(),
					layers
				);
			} else {
				if (selLayer.type === "group") {
					unhighlightGroup();
				} else if (selLayer.type === "draw") {
					unhighlightPath();
				}
				dispatch({ type: "REMOVESELLAYER" });
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

			<div className="d-flex">
				<div className="bg-white position-relative shadow-lg" style={{ height: '30px', width: '30px' }}>
					<svg width={svgJson.height} height={svgJson.width} fill="white" viewBox={"0 0 " + svgJson.width + " " + svgJson.height} xmlns="http://www.w3.org/2000/svg" id={"preview_" + props.name} class="position-absolute w-100 h-100 preview-box">
					</svg>
				</div>
				<p className="my-auto ms-2 align-self-center">{props.name}</p>
			</div>

		</div>
	);
};

export default Layer;
