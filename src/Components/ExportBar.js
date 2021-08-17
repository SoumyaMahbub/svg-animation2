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

    const openModal = () => {
		setIsOpen(true);
	};

    const afterOpenModal = () => {
        $('#code-area').text(JSON.stringify(svgJson, null, "\t"));
    }

    const closeModal = () => {
		setIsOpen(false);
	};

    return (
        <div>
            <button onClick={openModal} className="btn btn-sm btn-light">
				Export JSON
			</button>
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
