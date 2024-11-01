import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";

const Layer = (props) => {
	const dispatch = useDispatch();
	const svgJson = useSelector((state) => state.svgJson);
	const selLayer = useSelector((state) => state.selLayer.layer);
	let selLayerJson = {};

	useEffect(() => {
		// if selLayer exists
		if (Object.keys(selLayer).length !== 0) {
			// if there is selected element
			if ($('.selected').length) {
				$('.selected').removeClass("selected");
			}
			$("[data-layer-name=" + selLayer.name + "]").addClass('selected');
			$("[data-layer-name=" + selLayer.name + "]").children().eq(0).addClass('selected');

		}
		// if selLayer doesn't exist
		else {
			// if there is selected element
			if ($('.selected').length) {
				$(".selected").removeClass("selected");
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
				else if (layer.type === 'group') {
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
		selLayer['layers'].forEach((layer, idx) => {
			if (layer.strokeColor) {
				$(".highlighted").eq(idx).attr('stroke', layer.strokeColor);
			} else {
				$(".highlighted").eq(idx).removeAttr('stroke');
			}
		})
		$('.highlighted').removeClass('highlighted');
	}

	const clickOnLayer = (e) => {
		const clickedEl = $(e.currentTarget);
		if (e.target.nodeName !== "I") {
			// if there is selected element
			if (Object.keys(selLayer).length !== 0) {
				// if selected element is not the one clicked
				if ($(".selected").get(0) !== clickedEl.get(0)) {
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
		const layerName = $(eyeEl).parent().parent().attr('data-layer-name');
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

	useEffect(() => {
		if (props.type === "group") {
			const myCollapsible = document.getElementById('sublayer_' + props.name);
			myCollapsible.addEventListener('hide.bs.collapse', function () {
				$("[data-layer-name=" + props.name + "]").children().eq(0).children().eq(0).children().eq(0).removeClass('fa-chevron-down');
				$("[data-layer-name=" + props.name + "]").children().eq(0).children().eq(0).children().eq(0).addClass('fa-chevron-right');
			})
			myCollapsible.addEventListener('show.bs.collapse', function () {
				$("[data-layer-name=" + props.name + "]").children().eq(0).children().eq(0).children().eq(0).removeClass('fa-chevron-right');
				$("[data-layer-name=" + props.name + "]").children().eq(0).children().eq(0).children().eq(0).addClass('fa-chevron-down');
			})
		}
	})

	return (
		<div
			onClick={clickOnLayer}
			id = {props.type === "grouped" ? "sublayer_" + props.groupName : ""}
			data-layer-name={props.name}
			className={
				props.type === "grouped"
					? "collapse"
					: "bg-dark p-3"
			}
			style={{ cursor: "pointer" }}
		>
			{props.type === "grouped"?
				<div className="p-3 d-flex justify-content-between" style={{backgroundColor: '#15181c'}}>
					<div className="d-flex">
						<p className="my-auto align-self-center ms-5">{props.name}</p>
					</div>
					<i className={$("#" + props.name).hasClass('invisible') ? "fa fa-eye-slash fa-fw align-self-center" : "fa fa-eye fa-fw align-self-center"} onClick={toggleVisibilty}></i>
				</div>
			:props.type === "group" ?
				<div className ="d-flex justify-content-between first-level group">
					<div className="d-flex">
						<i className="fas fa-fw fa-chevron-right align-self-center py-2 pe-2" data-bs-toggle="collapse" data-bs-target={"#sublayer_" + props.name}></i>
						<p className="my-auto align-self-center flex-grow-0">{props.name}</p>
					</div>
					<i className={$("#" + props.name).hasClass('invisible') ? "fa fa-eye-slash fa-fw align-self-center" : "fa fa-eye fa-fw align-self-center"} onClick={toggleVisibilty}></i>
				</div>
			:
			<div className ="d-flex justify-content-between first-level">
				<div className="d-flex">
					<p className="my-auto align-self-center ">
						{props.name}
					</p>
				</div>
				{props.layerType !== "erase" ?
					<i className={$("#" + props.name).hasClass('invisible') ? "fa fa-eye-slash fa-fw align-self-center" : "fa fa-eye fa-fw align-self-center"} onClick={toggleVisibilty}></i>
					: ""
				}
			</div>
			}
			
		</div>
	);
};

export default Layer;
