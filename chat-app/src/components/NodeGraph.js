import React, { useState } from 'react';
import Modal from 'react-modal';
import './NodeGraph.css';
import SunburstGraph from './SunburstGraph';
import ItineraryModalContent from './ItineraryModalContent';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement('#root');

const NodeGraph = ({ nodesData, sunburstGraphRef, fetchNodesData }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);

    const handleNodeClick = (node) => {
        setSelectedNode(node);
        setModalIsOpen(true);
    };

    const getModalContent = (node) => {
        if (node && node.modalContentComponent === 'ItineraryModalContent') {
            return <ItineraryModalContent node={node} />;
        }
        return (
            <div>
                <h2>{node.id}</h2>
                <p>{node.description}</p>
            </div>
        );
    };

    return (
        <div className="NodeGraph-container">
            <SunburstGraph
                data={nodesData}
                ref={sunburstGraphRef}
                fetchNodesData={fetchNodesData} // Pass the fetchNodesData function
            />
        </div>
    );
}

export default NodeGraph;
