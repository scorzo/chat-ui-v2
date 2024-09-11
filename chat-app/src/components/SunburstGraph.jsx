import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as d3 from 'd3';
import Modal from 'react-modal';
import './SunburstGraph.css';
import SpecialDatesModalContent from "./SpecialDatesModalContent";
import ItineraryModalContent from './ItineraryModalContent';
import FinanceManagementModalContent from './FinanceManagementModalContent';
import ShoppingListModalContent from './ShoppingListModalContent';
import FamilyMembersModalContent from './FamilyMembersModalContent';
import CalendarModalContent from './CalendarModalContent';
import HouseholdMaintenanceModalContent from './HouseholdMaintenanceModalContent';
import HomeModalContent  from "./HomeModalContent";
import VehicleMaintenanceModalContent from "./VehicleMaintenanceModalContent";
import InsuranceRecordsModalContent from "./InsuranceRecordsModalContent";
import LearningModalContent from "./LearningModalContent";
import FamilyHealthModalContent from "./FamilyHealthModalContent";
import DailyUpdateModalContent from "./DailyUpdateModalContent";
import FamilyPersonalityModalContent from "./FamilyPersonalityModalContent";
import MealPlanningModalContent from "./MealPlanningModalContent";
import GoalsCoachingModalContent from "./GoalsCoachingModalContent";
import WorkConnectionsModalContent from "./WorkConnectionsModalContent";
import CareerDevelopmentModalContent from "./CareerDevelopmentModalContent";
import CareerGoalsCoachingModalContent from "./CareerGoalsCoachingModalContent";
import JobSearchModalContent from "./JobSearchModalContent";
import ResumeModalContent from "./ResumeModalContent";







Modal.setAppElement('#root');

const SunburstGraph = forwardRef(({ data, fetchNodesData }, ref) => {
    const svgRef = useRef();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [centerText, setCenterText] = useState(data.name); // Set initial center text to top-level node name
    const gRef = useRef();
    const pathRef = useRef();
    const labelRef = useRef();
    const parentRef = useRef();
    const rootRef = useRef();

    const width = 932;
    const radius = width / 6;

    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => d.y1 * radius - 1);

    useImperativeHandle(ref, () => ({
        navigateToNode: (nodeId) => {

            // Call the refresh method defined within the useImperativeHandle
            ref.current.refresh();

            const node = findNodeById(nodeId);
            if (node && node.parent) {
                console.log("Navigating to parent node:", node.parent);
                clicked(null, node.parent);
                setTimeout(() => handleNodeClick(null, node), 750); // Add delay before opening the modal
            } else {
                alert(`Parent node of node with id "${nodeId}" not found.`);
            }
        },


        refresh: async () => {
            await fetchNodesData(); // Fetch nodes data first
            renderGraph();
            console.log('SunburstGraph is refreshed');

            if (modalIsOpen && selectedNode) {
                console.log('Modal is open, refreshing content for node:', selectedNode);
                setModalIsOpen(false); // Temporarily close modal
                setTimeout(() => {
                    const freshNode = findNodeById(selectedNode.node_id); // Find the updated node data
                    if (freshNode) {
                        console.log('Found fresh node data:', freshNode);
                        // Pass only the data property of the node to setSelectedNode
                        setSelectedNode(freshNode.data); // Update the state with the fresh node data
                        setModalIsOpen(true); // Reopen modal
                    } else {
                        console.error('Unable to find fresh node data for node:', selectedNode.node_id);
                    }
                }, 0); // Reopen modal immediately after state update
            }
        }

    }));

    const findNodeById = (nodeId) => {
        let foundNode = null;
        rootRef.current.each(d => {
            if (d.data.node_id === nodeId) {
                foundNode = d;
            }
        });
        return foundNode;
    };

    const handleNodeClick = (event, d) => {
        console.log('Clicked node:', d);
        const fullPath = d.ancestors().map(node => node.data.name).reverse();
        if (!d.children) {
            fullPath.pop(); // Remove leaf node from the path
        }
        setCenterText(fullPath.join(" / ")); // Update the center text with the full path to the clicked node
        if (d.data.modalContentComponent) {
            console.log('Opening modal for node:', d);
            setSelectedNode(d.data);
            setModalIsOpen(true);
        }
    };

    const clicked = (event, p) => {
        if (!p || p.x0 === undefined || p.x1 === undefined || p.y0 === undefined || p.y1 === undefined) {
            console.error('Invalid node:', p);
            return;
        }

        const fullPath = p.ancestors().map(node => node.data.name).reverse();
        if (!p.children) {
            fullPath.pop(); // Remove leaf node from the path
        }
        setCenterText(fullPath.join(" / ")); // Update the center text with the full path to the clicked node

        const parent = parentRef.current;
        const root = rootRef.current;
        const g = gRef.current;
        const path = pathRef.current;
        const label = labelRef.current;

        parent.datum(p.parent || root);

        root.each(d => {
            d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            };
        });

        const t = g.transition().duration(750);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => {
                    d.current = i(t);
                };
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => d === p ? 0 : arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current))
            .on("end", function (d) {
                if (d === p) {
                    d3.select(this).attr("fill-opacity", 0);
                }
            });

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    };

    const arcVisible = (d) => {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    };

    const labelVisible = (d) => {
        return d.y1 <= 3 && d.y0 >= 1 && (d.x1 - d.x0) > 0.03;
    };

    const labelTransform = (d) => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    };

    const renderGraph = () => {
        const format = d3.format(",d");

        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
        const greyScale = d3.scaleLinear().domain([4, 10]).range(["#d3d3d3", "#808080"]);

        const partition = data => {
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])
                (root);
        };

        const root = partition(data);
        rootRef.current = root;

        root.each(d => d.current = d);

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, width])
            .style("font", "10px sans-serif");

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${width / 2})`);

        gRef.current = g;

        const path = g.append("g")
            .selectAll("path")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("fill", d => {
                if (d.depth < 3) {
                    while (d.depth > 1) d = d.parent;
                    return color(d.data.name);
                } else {
                    return greyScale(d.depth);
                }
            })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("d", d => arc(d.current))
            .on("click", handleNodeClick);

        pathRef.current = path;

        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

        const label = g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .attr("fill", "black") // Set the fill color to black
            .attr("font-size", "14") // Set the font size
            .style("user-select", "none")
            .selectAll("text")
            .data(root.descendants().slice(1))
            .enter().append("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => d.data.name);

        labelRef.current = label;

        const parent = g.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked);

        parentRef.current = parent;

        g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "20px")
            .style("fill", "white")
            .style("font-weight", "bold")
            .attr("id", "center-text")
            .text(centerText)
            .call(wrap, radius * 2); // Call wrap function to wrap text within circle
    };

    useEffect(() => {
        renderGraph();
    }, [data]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.select("#center-text").text(centerText).call(wrap, radius * 2); // Apply text wrapping when text changes
    }, [centerText]);

    const wrap = (text, width) => {
        text.each(function() {
            const text = d3.select(this);
            const words = text.text().split(/ \//).reverse();
            let word;
            let line = [];
            let lineNumber = 0;
            const lineHeight = 1.1; // ems
            const y = 0; // Center y
            const dy = 0; // Slightly increase dy for the first line
            let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" / "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" / "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight}em`).text(word);
                }
            }
        });
    };

    const modalComponents = {
        ItineraryModalContent,
        FinanceManagementModalContent,
        ShoppingListModalContent,
        FamilyMembersModalContent,
        CalendarModalContent,
        HouseholdMaintenanceModalContent,
        HomeModalContent,
        VehicleMaintenanceModalContent,
        InsuranceRecordsModalContent,
        LearningModalContent,
        FamilyHealthModalContent,
        DailyUpdateModalContent,
        FamilyPersonalityModalContent,
        MealPlanningModalContent,
        SpecialDatesModalContent,
        GoalsCoachingModalContent,
        WorkConnectionsModalContent,
        CareerDevelopmentModalContent,
        CareerGoalsCoachingModalContent,
        JobSearchModalContent,
        ResumeModalContent
    };

    const getModalContent = (node) => {
        console.log('Refreshing modal content for node:', node);

        if (!node) {
            console.log('No node provided.');
            return (
                <div>
                    <h2>No Node</h2>
                    <p>No node data available.</p>
                </div>
            );
        }

        if (!node.modalContentComponent) {
            console.log('Node has no modalContentComponent:', node);
            return (
                <div>
                    <h2>{node.name}</h2>
                    <p>{node.description}</p>
                </div>
            );
        }

        if (!modalComponents[node.modalContentComponent]) {
            console.log('Modal content component not found in modalComponents:', node.modalContentComponent);
            return (
                <div>
                    <h2>{node.name}</h2>
                    <p>{node.description}</p>
                </div>
            );
        }

        const ModalContentComponent = modalComponents[node.modalContentComponent];
        console.log('Found modal content component:', node.modalContentComponent);
        return <ModalContentComponent node={node} sunburstGraphRef={ref} />;
    };


    return (
        <div className="SunburstGraph-container">
            <svg ref={svgRef}></svg>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Node Details"
                className="Modal"
                overlayClassName="Overlay"
                key={selectedNode ? selectedNode.node_id : 'default'} // Add a key to force re-render
            >
                {selectedNode && getModalContent(selectedNode)}
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </Modal>
        </div>
    );
});

export default SunburstGraph;
