import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from "react-dropzone";
import { parse } from "svgson";

const MyDropzone = () => {

    let layerNumber = 1;
    let groupNumber = 1;
    const fileName = useSelector((state) => state.fileName);
	const dispatch = useDispatch();

    const editParent = json => {
        json['id'] = 1;
        delete json['type'];
        delete json['value'];
        delete json['attributes']['viewBox'];
        delete json['attributes']['xmlns'];
        delete json['attributes']['fill'];
        for(var attr in json['attributes']) {
            json[attr] = json['attributes'][attr];
        }
        delete json['attributes'];
        json['backgroundColor'] = "#fff";
        json['locked'] = "false";
        json['difficulty'] = 1;
        json['layers'] = json['children'];
        delete json['children'];
    }
    
    const generateName = (layers) => {
        layers.forEach((layer) => {
            if (layer.name === 'path'){
                layer['name'] = "layer_" + layerNumber;
                layerNumber++;
            } else {
                layer['name'] = "group_" + groupNumber;
                groupNumber++;
                generateName(layer['children']);
            }
        })
    }

    const parsePath = (path) => {
        path['type'] = "draw";
        delete path['value'];
        delete path['children'];
        for(var attr in path['attributes']) {
            path[attr] = path['attributes'][attr];
        }
        delete path['attributes'];
        if (path['fill']) {
            path['style'] = "fill";
            path['fillColor'] = path['fill'];
            delete path['fill'];
        }else {
            path['style'] = "stroke";
            path['strokeColor'] = path['stroke'];
            path['strokeWidth'] = path['stroke-width'];
            path['strokeLineCap'] = path['stroke-linecap'];
            path['strokeLineJoin'] = path['stroke-linejoin'];
            delete path['stroke'];
            delete path['stroke-width'];
            delete path['stroke-linecap'];
            delete path['stroke-linejoin'];
        }
        path['pathData'] = path['d'];
        delete path['d'];
    }

    const parseGroup = group => {
        group['type'] = "group";
        delete group['value'];
        delete group['attributes'];
        group['drawMode'] = "sequential";
        group['layers'] = group['children'];
        delete group['children'];
        group['layers'].forEach((path) => {
            parsePath(path);
        })
    } 

    const modifyJSON = json => {
        editParent(json);
        generateName(json['layers']);
        layerNumber = 1;
        groupNumber = 1;
        json.layers.forEach((layer) => {
            if (layer.name.startsWith("layer_")) {
                parsePath(layer);
            } else {
                parseGroup(layer);
            }
        })
    }

    // on drop function
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        dispatch({type: 'CHANGEFILENAME', payload: file['name']});
        const reader = new FileReader();
        reader.onload = () => {
            if (file.type === "image/svg+xml") {
                parse(reader.result).then((json) => {
                    modifyJSON(json);
                    dispatch({type: 'CHANGESVGJSON', payload: json});
                    dispatch({type: 'CHANGESVGSTRING', payload: reader.result});
                })
            } else {

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
        <div {...getRootProps()} className="text-center p-2" style={fileName ? null : {border: '1px dashed #eee'}}>
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
