import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";

const Layer = (props) => {
	const dispatch = useDispatch();
	const svgJson = useSelector((state) => state.svgJson);
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
					if (layer.type === 'draw') {
						if (layer['strokeWidth']) {
							$("#" + layer.name).attr('stroke', '#2181cf');
							$("#" + layer.name).addClass('highlighted');
						} else {
							$("#" + layer.name).attr('stroke-width', '5');
							$("#" + layer.name).attr('stroke', '#2181cf');
							$("#" + layer.name).addClass('highlighted');
						}
					} else if (layer.type === "group") {
						layer['layers'].forEach(lyr => {
							if (lyr['strokeWidth']) {
								$("#" + lyr.name).attr('stroke', '#2181cf');
								$("#" + lyr.name).addClass('highlighted');
							} else {
								$("#" + lyr.name).attr('stroke-width', '5');
								$("#" + lyr.name).attr('stroke', '#2181cf');
								$("#" + lyr.name).addClass('highlighted');
							}
						})
					}
					throw breakException;
				}
				else if (layer.type == 'group') {
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
		if (e.target.nodeName !== "I") {
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
						clickedEl.attr('data-layer-name'),
						svgJson.layers
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
					clickedEl.attr('data-layer-name'),
					svgJson.layers
				);
			}
		}
	};

	const toggleVisibilty = (e) => {
		const eyeEl =  $(e.target);
		const layerName = $(eyeEl).parent().attr('data-layer-name');
		const svgLayerEl = $("#" + layerName)
		if (eyeEl.hasClass('fa-eye')) {
			svgLayerEl.addClass('invisible');
			$(eyeEl).removeClass('fa-eye');
			$(eyeEl).addClass('fa-eye-slash');
		}
		else {
			svgLayerEl.removeClass('invisible');
			$(eyeEl).removeClass('fa-eye-slash');
			$(eyeEl).addClass('fa-eye');
		}
	}

	const toggleSubLayers = (e) => {
		if ($(e.currentTarget).hasClass('fa-chevron-right')) {
			$(e.currentTarget).removeClass('fa-chevron-right');
			$(e.currentTarget).addClass('fa-chevron-down');
		} else {
			$(e.currentTarget).removeClass('fa-chevron-down');
			$(e.currentTarget).addClass('fa-chevron-right');
		}
	}

	return (
		<div
			onClick={clickOnLayer}
			id = {props.type === "grouped" ? "sublayer_" + props.groupName : ""}
			data-layer-name={props.name}
			className={
				props.type === "grouped"
					? "collapse"
					: "border border-2 p-3"
			}
			style={{ cursor: "pointer" }}
		>
			{props.type === "grouped"?
				<div className="border border-2 p-3 d-flex justify-content-between">
					<p className="ms-4 my-auto align-self-center">{props.name}</p>
				</div>
			:props.type == "group" ?
				<div className ="d-flex justify-content-between first-level">
					<div className="d-flex">
						<i className="fas fa-fw fa-chevron-right align-self-center me-2 py-2 pe-2" data-bs-toggle="collapse" data-bs-target={"#sublayer_" + props.name} onClick={toggleSubLayers}></i>
						<p className="my-auto align-self-center">{props.name}</p>
					</div>
					<i className={$("#" + props.name).hasClass('invisible') ? "fa fa-eye-slash align-self-center" : "fa fa-eye align-self-center"} onClick={toggleVisibilty}></i>
				</div>
			:
			<div className ="d-flex justify-content-between first-level">
				<div className="d-flex">
					<p className="my-auto align-self-center">
						{props.name}
					</p>
				</div>
				<i className={$("#" + props.name).hasClass('invisible') ? "fa fa-eye-slash align-self-center" : "fa fa-eye align-self-center"} onClick={toggleVisibilty}></i>
			</div>
			}
			
		</div>
	);
};

export default Layer;
