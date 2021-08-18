import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from "react-dropzone";
import { parse } from "svgson";
import $ from 'jquery';

const MyDropzone = () => {

	let pathNumber = 1;
	let groupNumber = 1;
	let fileNameString;
	const fileName = useSelector((state) => state.fileName);
	const layerList = useSelector((state) => state.layerList);
	const selLayer = useSelector((state) => state.selLayer.layer);
	const dispatch = useDispatch();

	useEffect(() => {
		if (layerList.length) {
			dispatch({ type: "REMOVELAYERLIST" })
		}
	}, [fileName])

	const parseHexColor = value => {
		if (value === "black" || value === "white") {
			if (value === "black") {
				return "#000000";
			} else {
				return "#ffffff";
			}
		} else if (value.length === 4) {
			const newValue = "#" + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];			
			return newValue;
		}else {
			return value;
		}
	}

	const editParent = json => {
		delete json['name'];
		delete json['type'];
		delete json['value'];
		delete json['attributes']['xmlns'];
		delete json['attributes']['fill'];
		for (var attr in json['attributes']) {
			json[attr] = json['attributes'][attr];
		}
		json['width'] = json['viewBox'].split(" ")[2];
		json['height'] = json['viewBox'].split(" ")[3];		
		delete json['viewBox'];
		delete json['attributes'];
		json['layers'] = json['children'];
		delete json['children'];
	}

	const generateName = (layers) => {
		layers.forEach((layer) => {
			if (!layer.hasOwnProperty('name')) {
				if (layer.type === 'draw') {
					layer['name'] = "path_" + pathNumber;
					pathNumber++;
				} 
				else {
					layer['name'] = "group_" + groupNumber;
					groupNumber++;
				}
			}
			if (layer.type === "group") {
				generateName(layer['layers']);
			}
		})
	}

	const parsePath = (path) => {
		path['type'] = "draw";
		delete path['value'];
		delete path['children'];
		for (var attr in path['attributes']) {
			path[attr] = path['attributes'][attr];
		}
		if (path['id']) {
			path['name'] = path['id'];
		}
		else if (path['name'] === "g" || path['name'] === "path") {
			delete path['name'];
		}
		delete path['attributes'];
		if (path['fill'] && path['fill'] !== "none") {
			path['fillColor'] = path['fill'];
			path['fillColor'] = parseHexColor(path['fillColor']);
		} else if(path['stroke']) {
			delete path['fill'];
			path['strokeColor'] = path['stroke'];
			path['strokeWidth'] = path['stroke-width'];
			path['strokeLineCap'] = path['stroke-linecap'];
			path['strokeLineJoin'] = path['stroke-linejoin'];
			path['strokeColor'] = parseHexColor(path['strokeColor']);
			delete path['stroke'];
			delete path['stroke-width'];
			delete path['stroke-linecap'];
			delete path['stroke-linejoin'];
		}
		path['pathData'] = path['d'];
		delete path['d'];
	}

	const parseGroup = group => {
		// convert group to draw layer
		if (group['attributes']['id']) {
			group['name'] = group['attributes']['id'];
		} else {
			delete group['name'];
		}
		delete group['value'];
		delete group['attributes'];
		delete group['type'];
		if (group.children.length === 1) {
			group['attributes'] = {}
			for (var attr in group['children'][0]['attributes']){ 
				group['attributes'][attr] = group['children'][0]['attributes'][attr];
			}
			parsePath(group);
		}else {
			group['type'] = "group";
			group['drawMode'] = "parallel";
			group['layers'] = group['children'];
			delete group['children'];
			group['layers'].forEach((path) => {
				parsePath(path);
			});	
		}
	}

	const modifyJSON = json => {
		editParent(json);
		pathNumber = 1;
		groupNumber = 1;
		json.layers.forEach((layer) => {
			if (layer.name === "path") {
				parsePath(layer);
			} else {
				parseGroup(layer);
			}
		})
		generateName(json['layers']);
	}

	const addLayerNamesToSvg = (jsonLayers, svgLayers) => {
		for (var i = 0; i < svgLayers.length; i++) {
			$(svgLayers[i]).attr('id', jsonLayers[i].name);
			if (svgLayers[i].nodeName === "g") {
				addLayerNamesToSvg(jsonLayers[i].layers, $(svgLayers[i]).children());
			}
		}
	}

	const parseSvg = (svgString) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgString, "image/svg+xml");
		const mainSvg = $(doc).children().eq(0);
		for (var i = 0; i < mainSvg.children().length; i++) {
			const cnt = mainSvg.children().eq(i).contents();
			if(mainSvg.children().eq(i).children().length === 1) {
				mainSvg.children().eq(i).replaceWith(cnt); 
			}
		}
		var serializer = new XMLSerializer();
      	return serializer.serializeToString(doc);
	}

	// on drop function
	const onDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		fileNameString = file['name'].split('.').slice(0, -1).join('.');;
		if (Object.keys(selLayer).length) {
			dispatch({ type: 'REMOVESELLAYER' })
		}
		dispatch({ type: 'CHANGEFILENAME', payload: fileNameString });
		const reader = new FileReader();
		reader.onload = () => {
			if (file.type === "image/svg+xml") {
				$('#canvas').html(parseSvg(reader.result));
				$('svg').attr('id', 'main-svg');
				$('svg').addClass('position-absolute w-100 h-100');
				parse(reader.result).then((json) => {
					modifyJSON(json);
					addLayerNamesToSvg(json.layers, $('#main-svg').children());
					dispatch({ type: 'CHANGESVGJSON', payload: json });
					dispatch({ type: 'CHANGESVGSTRING', payload: reader.result });
				})
			} else {
				const json = JSON.parse(reader.result);
				dispatch({ type: 'CHANGESVGJSON', payload: json });

			}
		}
		reader.readAsText(file);
	}


	// use dropzone
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: ".json, .svg",
	});


	// JSX
	return (
		<div {...getRootProps()} className="text-center p-2" style={fileName ? null : { border: '1px dashed #eee' }}>
			{fileName ?
				<div>
					<input {...getInputProps()} />
					{isDragActive ? (
						<p className="my-auto">Drop the files here ...</p>
					) : (
						<p className="my-auto">{fileName}</p>
					)}
				</div>
				:
				<div>
					<input {...getInputProps()} />
					{isDragActive ? (
						<p className="my-auto">Drop the files here ...</p>
					) : (
						<p className="my-auto">
							Drag your json or svg file here
						</p>
					)}
				</div>}
		</div>
	);
};

export default MyDropzone;
