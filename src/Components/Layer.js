import React from 'react'

const Layer = (props) => {
    return (
        <div className="border p-3 d-flex">
            <p className="my-auto ms-2">{props.name}</p>
        </div>
    )
}

export default Layer
