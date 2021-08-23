import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Modal from "react-modal";
import $ from 'jquery';

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		width: "75%",
		height: "75vh",
		overflow: "hidden",
		marginRight: "-50%",
		fontFamily: "monospace",
		fontSize: "12px",
		transform: "translate(-50%, -50%)",
	},
};

const ExportBar = () => {
    const svgJson = useSelector(state => state.svgJson);
	const file = useSelector(state => state.fileName);

	const cutParent = (json , newJson) => {
		newJson['width'] = json['width'];
		newJson['height'] = json['height'];
		newJson['layers'] = [];
	}

	const cutLayers = (layers, newLayers) => {
		for (var i = 0; i < layers.length; i++) {
			newLayers.push({});
			newLayers[i]['type'] = layers[i]['type'];
			if (newLayers[i]['type'] !== "erase") {
				newLayers[i]['name'] = layers[i]['name'];
			}else {
				newLayers[i]['target'] = layers[i]['name'].replace('erase_','');
			}
			if (layers[i]['subtitleEn']) {
				newLayers[i]['subtitleEn'] = layers[i]['subtitleEn'];
			}
			if (layers[i].type === "draw") {
				newLayers[i]['pathData'] = layers[i]['pathData'];
				if (layers[i]['fillColor']) {
					newLayers[i]['fillColor'] = layers[i]['fillColor'];
				}else {
					newLayers[i]['strokeWidth'] = layers[i]['strokeWidth'];
					newLayers[i]['strokeColor'] = layers[i]['strokeColor'];
					newLayers[i]['strokeLineCap'] = layers[i]['strokeLineCap'];
					newLayers[i]['strokeLineJoin'] = layers[i]['strokeLineJoin'];
				}
			}  else if (layers[i].type === "erase") {
				newLayers[i]['targetEraseMode'] = layers[i]['drawMode'];
			} else {
				newLayers[i]['drawMode'] = layers[i]['drawMode'];
				newLayers[i]['layers'] = [];
				cutLayers(layers[i]['layers'], newLayers[i]['layers']);
			}
		}
	}

	const cutJson = (json) => {
		let newJson = {};
		cutParent(json, newJson);
		cutLayers(json['layers'], newJson['layers']);
		return newJson;
	}

	const hideAllLayers = () => {
		const mainSvgLayers = $('#main-svg').children();
		const layerContainerLayers = $('.first-level');
		for (var i = 0; i < mainSvgLayers.length; i++) {
			mainSvgLayers.eq(i).addClass('invisible');
		}
		for (var i = 0; i < layerContainerLayers.length; i++){
			layerContainerLayers.eq(i).children().eq(1).removeClass('fa-eye');
			layerContainerLayers.eq(i).children().eq(1).addClass('fa-eye-slash');
		}
	}
	
	const showAllLayers = () => {
		const mainSvgLayers = $('#main-svg').children();
		const layerContainerLayers = $('#layer-container').children();
		for (var i = 0; i < mainSvgLayers.length; i++) {
			mainSvgLayers.eq(i).removeClass('invisible');
			if (mainSvgLayers[i].nodeName === "g") {
				for (var j = 0; j < mainSvgLayers.eq(i).children().length; j++) {
						mainSvgLayers.eq(i).children().eq(0).children().eq(j).removeClass('invisible');
					}
				}
			}
		for (var i = 0; i < layerContainerLayers.length; i++) {
			layerContainerLayers.eq(i).children().eq(0).children().eq(1).removeClass('fa-eye-slash');
			layerContainerLayers.eq(i).children().eq(0).children().eq(1).addClass('fa-eye');
		}
	}

	const downloadJsonFile = async () => {
		const newJson = cutJson(svgJson);
		const fileName = file.split('.').slice(0, -1).join('.');
		const json = JSON.stringify(newJson, null, "\t");
		const blob = new Blob([json],{type:'application/json'});
		const href = await URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = href;
		link.download = fileName + ".json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	
	const expandAllLayers = () => {
		const groupedLayers = $('.collapse');
		const groupLayers = $('.group');
		for (var i = 0; i < groupLayers.length; i++) {
			groupLayers.eq(i).children().eq(0).children().eq(0).removeClass('fa-chevron-right');
			groupLayers.eq(i).children().eq(0).children().eq(0).addClass('fa-chevron-down');
		}  
		for(var i = 0; i < groupedLayers.length; i++) {
			if (groupedLayers.eq(i).hasClass('show') === false) {
				groupedLayers.eq(i).addClass('show');
			}
		}
	}
	const collapseAllLayers = () => {
		const groupedLayers = $('.collapse');
		const groupLayers = $('.group');
		for (var i = 0; i < groupLayers.length; i++) {
			groupLayers.eq(i).children().eq(0).children().eq(0).removeClass('fa-chevron-down');
			groupLayers.eq(i).children().eq(0).children().eq(0).addClass('fa-chevron-right');
		}  
		for(var i = 0; i < groupedLayers.length; i++) {
			if (groupedLayers.eq(i).hasClass('show')) {
				groupedLayers.eq(i).removeClass('show');
			}
		}
	}

	const copyCodeToClipboard = () => {
		const codeTextArea = document.getElementById('code-area');
		navigator.clipboard.writeText(codeTextArea.value);
	}

	const addCodeToModal = () => {
		var myModalEl = document.getElementById('exampleModal')
		myModalEl.addEventListener('shown.bs.modal', function (event) {
			try {
				const newJson = cutJson(svgJson);
				$('#code-area').text(JSON.stringify(newJson, null, "\t"));
			} catch (e) {
				console.log(e);
			}
		})
	}

    return (
        <div className="d-flex justify-content-between">
			<div>
				<button className="me-2 btn btn-sm btn-dark" data-bs-toggle="modal" onClick={addCodeToModal} data-bs-target="#exampleModal">
					<i className="fas fa-code fa-fw"></i>
				</button>
				<button onClick={downloadJsonFile} className="btn btn-sm btn-dark">
					<i className="fas fa-download fa-fw"></i>
				</button>
			</div>
			<div>
				<button onClick={expandAllLayers} className="me-2 btn btn-sm btn-dark">
					<i className="fas fa-expand fa-fw"></i>
				</button>
				<button onClick={collapseAllLayers} className="btn btn-sm btn-dark">
					<i className="fas fa-compress fa-fw"></i>
				</button>
			</div>
			<div>
				<button onClick={showAllLayers} className="me-2 btn btn-sm btn-dark">
					<i className = "fa fa-eye fa-fw"></i>
				</button>
				<button onClick={hideAllLayers} className="btn btn-sm btn-dark">
					<i className = "fa fa-eye-slash fa-fw"></i>
				</button>
			</div>

			<div id="exampleModal" className="modal fade text-black" tabIndex="-1">
				<div className="modal-dialog modal-fullscreen">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">JSON code</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<textarea
								spellCheck="false"
								id="code-area"
								className="w-100 h-100 font-monospace form-control"
							></textarea>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-dark" onClick={copyCodeToClipboard}><i class="fas fa-copy"></i></button>
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>

        </div>
    )
}

export default ExportBar;
