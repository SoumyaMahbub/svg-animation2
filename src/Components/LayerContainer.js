import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layer from './Layer';

const LayerContainer = () => {

    const layers = useSelector((state) => state.svgJson.layers);
    const [layerElements, setLayerElements] = useState();


    useEffect(() => {
        if (!layerElements && layers) {
            setLayerElements(layers.map((layer) =>  
                <Layer name={layer.name}/>
            ));
        }
    }, [layers, layerElements]);
    
    return (
        <div id="layer-container" className="overflow-auto">
            {layerElements}
        </div>
    )
}

export default LayerContainer
