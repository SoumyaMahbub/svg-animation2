import React, { useState } from 'react';
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
    const [modalIsOpen, setIsOpen] = useState(false);

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
	
    const openModal = () => {
		setIsOpen(true);
	};

    const afterOpenModal = () => {
		const newJson = cutJson(svgJson);
        $('#code-area').text(JSON.stringify(newJson, null, "\t"));
    }

    const closeModal = () => {
		setIsOpen(false);
	};

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
					mainSvgLayers.eq(i).children().eq(j).removeClass('invisible');
				}
			}
		}
		for (var i = 0; i < layerContainerLayers.length; i++) {
			layerContainerLayers.eq(i).children().eq(1).removeClass('fa-eye-slash');
			layerContainerLayers.eq(i).children().eq(1).addClass('fa-eye');
		}
	}

    return (
        <div className="d-flex justify-content-between">
            <button onClick={openModal} className="btn btn-sm btn-light">
				Export JSON
			</button>
			<div>
				<button onClick={showAllLayers} className="ms-2 btn btn-sm btn-outline-light">
					<i className = "fa fa-eye"></i>
				</button>
				<button onClick={hideAllLayers} className="ms-2 btn btn-sm btn-outline-light">
					<i className = "fa fa-eye-slash"></i>
				</button>
			</div>
            <Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles}
				ariaHideApp={false}
				contentLabel="Example Modal"
			>
				<textarea
					spellCheck="false"
					id="code-area"
					className="w-100 h-100"
				></textarea>
			</Modal>
        </div>
    )
}

export default ExportBar
