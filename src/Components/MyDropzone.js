import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useDropzone } from "react-dropzone";
import { parse } from "svgson";

const MyDropzone = () => {

    const fileName = useSelector((state) => state.fileName);
	const dispatch = useDispatch();


    // on drop function
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0]
        dispatch({type: 'CHANGEFILENAME', payload: file['name']});
        const reader = new FileReader();
        reader.onload = () => {
            if (file.type === "image/svg+xml") {
                parse(reader.result).then((json) => {

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
        <div className="text-center">
            {fileName ?
            <p>{fileName}</p> 
            : 
            <div className="p-2" {...getRootProps()} style={{border: '1px dashed #eee'}}>
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
