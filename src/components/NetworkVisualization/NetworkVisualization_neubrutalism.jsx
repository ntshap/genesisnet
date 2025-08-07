import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { 
  Database, 
  Network, 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  Handshake, 
  Archive, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  X,
  Play, 
  Pause, 
  RotateCcw, 
  Star, 
  DollarSign, 
  Activity,
  MapPin,
  RefreshCw,
  Image,
  BarChart3,
  Cpu
} from 'lucide-react';

const NetworkVisualization = ({ agentStatus, networkData, onNegotiate, isLoading }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [zoomTransform, setZoomTransform] = useState(d3.zoomIdentity);
  const [infoCardPosition, setInfoCardPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isLoading) return;
    
    const svg = d3.select(svgRef.current);
    // Hapus timer dan inisialisasi langsung agar zoom/pan tidak reset
    initializeNetwork();
    setIsInitialized(true);
    // Jangan reset posisi zoom/pan setiap render
  }, [networkData, agentStatus, isLoading]);

  const initializeNetwork = () => {
    const svg = d3.select(svgRef.current);
    
    const getContainerDimensions = () => {
      const container = svg.node().parentElement;
      const containerRect = container.getBoundingClientRect();
      return {
        width: Math.max(containerRect.width, 600),
        height: Math.max(containerRect.height, 400)
      };
    };

    const { width, height } = getContainerDimensions();
    
  // Jangan reset zoom/pan, simpan transform sebelumnya
  svg.selectAll('*').remove();
  svg.attr('width', width).attr('height', height);

    // Create main group for all elements that will be zoomed/panned
    const mainGroup = svg.append('g').attr('class', 'main-visualization');
    // Apply transform jika ada zoom/pan sebelumnya
    if (zoomTransform) {
      mainGroup.attr('transform', zoomTransform);
    }
    
    // Setup zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform);
        setZoomTransform(event.transform);
      });

    // Apply zoom behavior to SVG with custom filter for better UX
    svg.call(zoom).on('dblclick.zoom', null); // Disable double-click zoom

    // Expose zoom methods for external controls
    svg.node().zoomIn = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    };
    svg.node().zoomOut = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5);
    };
    svg.node().resetZoom = () => {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    };

    // Organize nodes in a tiered grid with consistent spacing
    const tiers = [
      [ // Tier 1
        { id: 'data-providers', name: 'Data Providers', subtitle: 'Supply market data', type: 'standard', color: '#d97706', icon: Database, priority: 'High' },
        { id: 'icp-gateway', name: 'ICP Gateway', subtitle: 'Blockchain interface', type: 'standard', color: '#1d4ed8', icon: Network, priority: 'High' },
        { id: 'external-apis', name: 'External APIs', subtitle: 'Third-party data', type: 'standard', color: '#7c3aed', icon: Globe, priority: 'Medium' }
      ],
      [ // Tier 2
        { id: 'core', name: 'GenesisNet Core', subtitle: 'Central orchestrator', type: 'core', color: '#059669', icon: Zap, priority: 'Critical' }
      ],
      [ // Tier 3
        { id: 'auth-system', name: 'Authentication', subtitle: 'Identity verification', type: 'standard', color: '#d97706', icon: Shield, priority: 'High' },
        { id: 'search-engine', name: 'Search Engine', subtitle: 'Data discovery', type: 'standard', color: '#7c3aed', icon: Globe, priority: 'Medium' },
        { id: 'validator', name: 'Validator Network', subtitle: 'Transaction validation', type: 'standard', color: '#dc2626', icon: Shield, priority: 'High' }
      ],
      [ // Tier 4
        { id: 'analytics', name: 'Analytics Engine', subtitle: 'Data analysis', type: 'standard', color: '#0891b2', icon: BarChart3, priority: 'Medium' },
        { id: 'compute-cluster', name: 'Compute Cluster', subtitle: 'Processing power', type: 'standard', color: '#059669', icon: Cpu, priority: 'High' },
        { id: 'ml-engine', name: 'ML Engine', subtitle: 'Machine learning', type: 'standard', color: '#7c3aed', icon: Zap, priority: 'Medium' }
      ],
      [ // Tier 5
        { id: 'smart-contracts', name: 'Smart Contracts', subtitle: 'Execute transactions', type: 'standard', color: '#dc2626', icon: Code, priority: 'High' },
        { id: 'negotiation', name: 'Negotiation Hub', subtitle: 'Deal management', type: 'standard', color: '#0891b2', icon: Handshake, priority: 'Medium' }
      ],
      [ // Tier 6
        { id: 'data-storage', name: 'Data Storage', subtitle: 'Transaction records', type: 'standard', color: '#65a30d', icon: Archive, priority: 'Medium' },
        { id: 'backup-system', name: 'Backup System', subtitle: 'Data redundancy', type: 'standard', color: '#65a30d', icon: Database, priority: 'Medium' }
      ]
    ];

    // Calculate grid positions for each node
    const verticalSpacing = height / (tiers.length + 1); // generous vertical spacing
    const horizontalPadding = 80; // px, for left/right margin
    const workflowNodes = [];
    tiers.forEach((tier, tierIdx) => {
      const y = verticalSpacing * (tierIdx + 1);
      const count = tier.length;
      const hSpace = (width - 2 * horizontalPadding) / (count - 1 || 1);
      tier.forEach((node, nodeIdx) => {
        workflowNodes.push({
          ...node,
          x: count === 1 ? width / 2 : horizontalPadding + nodeIdx * hSpace,
          y
        });
      });
    });

    // Define clearer workflow connections
    const workflowConnections = [
      // Input to core (tier 1 -> tier 2)
      { source: 'data-providers', target: 'core', type: 'flow', label: 'Data Request', color: '#059669' },
      { source: 'icp-gateway', target: 'core', type: 'flow', label: 'ICP Query', color: '#059669' },
      { source: 'external-apis', target: 'core', type: 'flow', label: 'API Data', color: '#059669' },
      
      // Core to services (tier 2 -> tier 3)
      { source: 'core', target: 'auth-system', type: 'flow', label: 'Authenticate', color: '#d97706' },
      { source: 'core', target: 'search-engine', type: 'flow', label: 'Search Data', color: '#7c3aed' },
      { source: 'core', target: 'validator', type: 'flow', label: 'Validate', color: '#dc2626' },
      
      // Services to processing (tier 3 -> tier 4)
      { source: 'auth-system', target: 'analytics', type: 'flow', label: 'Analyze User', color: '#0891b2' },
      { source: 'search-engine', target: 'compute-cluster', type: 'flow', label: 'Process Search', color: '#059669' },
      { source: 'validator', target: 'ml-engine', type: 'flow', label: 'ML Validation', color: '#7c3aed' },
      
      // Processing to execution (tier 4 -> tier 5)
      { source: 'analytics', target: 'smart-contracts', type: 'flow', label: 'Contract Data', color: '#dc2626' },
      { source: 'compute-cluster', target: 'smart-contracts', type: 'flow', label: 'Compute Result', color: '#dc2626' },
      { source: 'ml-engine', target: 'negotiation', type: 'flow', label: 'ML Insights', color: '#0891b2' },
      
      // Execution to storage (tier 5 -> tier 6)
      { source: 'smart-contracts', target: 'data-storage', type: 'flow', label: 'Store Transaction', color: '#65a30d' },
      { source: 'negotiation', target: 'data-storage', type: 'flow', label: 'Save Deal Record', color: '#65a30d' },
      { source: 'smart-contracts', target: 'backup-system', type: 'flow', label: 'Backup Contract', color: '#65a30d' },
      { source: 'negotiation', target: 'backup-system', type: 'flow', label: 'Backup Deal', color: '#65a30d' },
      
      // Cross-tier connections for complex workflow
      { source: 'data-providers', target: 'analytics', type: 'flow', label: 'Raw Data', color: '#0891b2' },
      { source: 'validator', target: 'smart-contracts', type: 'flow', label: 'Validated Data', color: '#dc2626' },
      { source: 'compute-cluster', target: 'negotiation', type: 'flow', label: 'Computed Price', color: '#0891b2' }
    ];

    // Create arrow markers for flow direction
    const defs = svg.append('defs');
    
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 3 L 0 6 Z')
      .attr('fill', '#000000')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1);

    // Draw connections with enhanced styling and colors
    const connectionGroup = mainGroup.append('g').attr('class', 'connections');
    
    workflowConnections.forEach(conn => {
      const sourceNode = workflowNodes.find(n => n.id === conn.source);
      const targetNode = workflowNodes.find(n => n.id === conn.target);
      
      if (sourceNode && targetNode) {
        // Create clean straight lines with adjusted positioning
        const line = connectionGroup.append('line')
          .attr('x1', sourceNode.x)
          .attr('y1', sourceNode.y + 28) // Adjusted for smaller card size
          .attr('x2', targetNode.x)
          .attr('y2', targetNode.y - 28) // Adjusted for smaller card size
          .attr('stroke', conn.color || '#000000')
          .attr('stroke-width', 3)
          .attr('opacity', 0.9);

        // Simplified connection points
        connectionGroup.append('circle')
          .attr('cx', sourceNode.x)
          .attr('cy', sourceNode.y + 28)
          .attr('r', 3)
          .attr('fill', conn.color || '#000000')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        connectionGroup.append('circle')
          .attr('cx', targetNode.x)
          .attr('cy', targetNode.y - 28)
          .attr('r', 3)
          .attr('fill', conn.color || '#000000')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        // Cleaner connection labels
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + 28 + targetNode.y - 28) / 2;
        
        const labelGroup = connectionGroup.append('g')
          .attr('transform', `translate(${midX}, ${midY})`);
          
        const labelText = labelGroup.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-family', 'Plus Jakarta Sans, sans-serif')
          .attr('font-size', '10px') // Smaller for cleaner look
          .attr('font-weight', '700')
          .attr('fill', '#000000')
          .text(conn.label);

        // Cleaner label background
        const bbox = labelText.node().getBBox();
        labelGroup.insert('rect', 'text')
          .attr('x', bbox.x - 4)
          .attr('y', bbox.y - 2)
          .attr('width', bbox.width + 8)
          .attr('height', bbox.height + 4)
          .attr('fill', '#ffffff')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1)
          .attr('rx', 3);
      }
    });

    // Draw consistent card-based nodes with clean, readable text
    const nodeGroup = mainGroup.append('g').attr('class', 'nodes');
    
    workflowNodes.forEach(node => {
      // Smaller, more consistent card sizes to prevent overlapping
      const cardWidth = node.type === 'core' ? 160 : 140; // Reduced sizes
      const cardHeight = 55; // Reduced height for better spacing
      
      const nodeContainer = nodeGroup.append('g')
        .attr('transform', `translate(${node.x - cardWidth/2}, ${node.y - cardHeight/2})`);

      // Clean card shadow
      nodeContainer.append('rect')
        .attr('x', 3)
        .attr('y', 3)
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('fill', '#000000')
        .attr('opacity', 0.2)
        .attr('rx', 6);

      // Main card with clean styling
      const card = nodeContainer.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('fill', node.color)
        .attr('stroke', '#000000')
        .attr('stroke-width', 3)
        .attr('rx', 6);

      // Clean header
      const headerHeight = 16;
      nodeContainer.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cardWidth)
        .attr('height', headerHeight)
        .attr('fill', 'rgba(0,0,0,0.1)')
        .attr('rx', 6);

      // Status indicator
      const statusColor = node.status === 'active' ? '#22c55e' : '#ef4444';
      nodeContainer.append('circle')
        .attr('cx', cardWidth - 10)
        .attr('cy', 8)
        .attr('r', 4)
        .attr('fill', statusColor)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);

      // Priority badge
      const priorityColor = {
        'Critical': '#dc2626',
        'High': '#f59e0b',
        'Medium': '#3b82f6',
        'Low': '#6b7280'
      }[node.priority] || '#6b7280';
      
      nodeContainer.append('rect')
        .attr('x', 6)
        .attr('y', 4)
        .attr('width', 35)
        .attr('height', 8)
        .attr('fill', priorityColor)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1)
        .attr('rx', 3);

      nodeContainer.append('text')
        .attr('x', 23.5)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Plus Jakarta Sans, sans-serif')
        .attr('font-size', '6px')
        .attr('font-weight', '900')
        .attr('fill', '#ffffff')
        .text(node.priority.toUpperCase());

      // Icon with consistent positioning
      const IconComponent = node.icon;
      nodeContainer.append('foreignObject')
        .attr('x', 8)
        .attr('y', 18)
        .attr('width', 18)
        .attr('height', 18)
        .append('xhtml:div')
        .style('width', '18px')
        .style('height', '18px')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${IconComponent === Database ? '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M5 12c0 1.657 3.134 3 7 3s7-1.343 7-3"></path><path d="M5 5v14c0 1.657 3.134 3 7 3s7-1.343 7-3V5"></path>' :
            IconComponent === Network ? '<rect x="16" y="16" width="6" height="6" rx="1"></rect><rect x="2" y="16" width="6" height="6" rx="1"></rect><rect x="9" y="2" width="6" height="6" rx="1"></rect><path d="m5 16 7-10"></path><path d="m19 16-7-10"></path>' :
            IconComponent === Zap ? '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>' :
            IconComponent === Shield ? '<path d="M20 13c0 5-3.5 7.5-8 12.5C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6-2 1.5.8 4 2 6 2a1 1 0 0 1 1 1Z"></path>' :
            IconComponent === Globe ? '<circle cx="12" cy="12" r="10"></circle><path d="m2 12 20 0"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>' :
            IconComponent === Code ? '<polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline>' :
            IconComponent === Handshake ? '<path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path>' :
            IconComponent === Archive ? '<rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="m4 8 16 0"></path><path d="m6 8 0 9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"></path><path d="m8 11 4 0"></path>' :
            '<circle cx="12" cy="12" r="10"></circle>'
          }
        </svg>`);

      // Main title - compact but readable
      nodeContainer.append('text')
        .attr('x', 30)
        .attr('y', 24)
        .attr('font-family', 'Plus Jakarta Sans, sans-serif')
        .attr('font-size', node.type === 'core' ? '12px' : '11px')
        .attr('font-weight', '900')
        .attr('fill', '#ffffff')
        .text(node.name);

      // Subtitle - compact
      nodeContainer.append('text')
        .attr('x', 30)
        .attr('y', 34)
        .attr('font-family', 'Plus Jakarta Sans, sans-serif')
        .attr('font-size', '8px')
        .attr('font-weight', '600')
        .attr('fill', '#ffffff')
        .text(node.subtitle);

      // Timestamp - smaller
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      nodeContainer.append('text')
        .attr('x', 30)
        .attr('y', 46)
        .attr('font-family', 'Plus Jakarta Sans, sans-serif')
        .attr('font-size', '7px')
        .attr('font-weight', '500')
        .attr('fill', '#ffffff')
        .text(`Updated: ${currentTime}`);

      // Clean interaction
      nodeContainer
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedNode(node);
        })
        .on('mouseover', () => {
          card.attr('stroke-width', 4);
          card.attr('transform', 'translate(-1, -1)');
        })
        .on('mouseout', () => {
          card.attr('stroke-width', 3);
          card.attr('transform', 'translate(0, 0)');
        });
    });

    // Add workflow flow indicators (animated dots) for card-based layout
    const flowGroup = mainGroup.append('g').attr('class', 'flow-indicators');
    
    workflowConnections.forEach((conn, index) => {
      const sourceNode = workflowNodes.find(n => n.id === conn.source);
      const targetNode = workflowNodes.find(n => n.id === conn.target);
      
      if (sourceNode && targetNode && conn.type === 'flow') {
        const flowDot = flowGroup.append('circle')
          .attr('r', 3) // Clean size
          .attr('fill', conn.color || '#22d3ee')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .attr('opacity', 0);

        const animateFlow = () => {
          flowDot
            .attr('cx', sourceNode.x)
            .attr('cy', sourceNode.y + 28)
            .attr('opacity', 1)
            .transition()
            .duration(1500 + Math.random() * 500)
            .ease(d3.easeLinear)
            .attr('cx', targetNode.x)
            .attr('cy', targetNode.y - 28)
            .attr('opacity', 0)
            .on('end', () => {
              setTimeout(animateFlow, 1500 + Math.random() * 1000);
            });
        };

        setTimeout(animateFlow, index * 200);
      }
    });
  };

  const handleNegotiate = async () => {
    setIsNegotiating(true);
    try {
      await onNegotiate();
    } finally {
      setTimeout(() => setIsNegotiating(false), 2000);
    }
  };

  const handleZoomIn = () => {
    const svg = d3.select(svgRef.current);
    if (svg.node().zoomIn) {
      svg.node().zoomIn();
    }
  };

  const handleZoomOut = () => {
    const svg = d3.select(svgRef.current);
    if (svg.node().zoomOut) {
      svg.node().zoomOut();
    }
  };

  const handleResetZoom = () => {
    const svg = d3.select(svgRef.current);
    if (svg.node().resetZoom) {
      svg.node().resetZoom();
    }
  };

  // Drag handlers for info card
  const handleInfoCardMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - infoCardPosition.x,
      y: e.clientY - infoCardPosition.y
    });
    e.preventDefault();
  };

  const handleInfoCardMouseMove = (e) => {
    if (isDragging) {
      setInfoCardPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleInfoCardMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleInfoCardMouseMove);
      document.addEventListener('mouseup', handleInfoCardMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleInfoCardMouseMove);
        document.removeEventListener('mouseup', handleInfoCardMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  // Reset info card position when a new node is selected
  useEffect(() => {
    if (selectedNode) {
      setInfoCardPosition({ x: 16, y: 16 });
    }
  }, [selectedNode]);

  return (
    <div className="relative w-full h-full bg-yellow-50">
      {/* Network Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex space-x-2">
        <button 
          onClick={handleNegotiate}
          disabled={isNegotiating}
          className="px-4 py-2 bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black text-sm font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isNegotiating ? 'Negotiating...' : 'Start Negotiation'}
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 bg-blue-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
          title="Zoom In"
        >
          <ZoomIn size={20} className="font-black" strokeWidth={3} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 bg-orange-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="font-black" strokeWidth={3} />
        </button>
        <button 
          onClick={handleResetZoom}
          className="w-12 h-12 bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
          title="Reset View"
        >
          <RotateCw size={20} className="font-black" strokeWidth={3} />
        </button>
      </div>

      {/* Enhanced Node Information Panel - Draggable */}
      {selectedNode && (
        <div 
          className={`absolute z-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-w-72 max-w-80 ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
          style={{
            left: `${infoCardPosition.x}px`,
            top: `${infoCardPosition.y}px`,
            userSelect: isDragging ? 'none' : 'auto'
          }}
        >
          {/* Draggable Header */}
          <div 
            className="bg-cyan-300 border-b-4 border-black p-3 cursor-grab active:cursor-grabbing"
            onMouseDown={handleInfoCardMouseDown}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white border-2 border-black rounded flex items-center justify-center">
                  {React.createElement(selectedNode.icon, {
                    size: 16,
                    className: "text-black",
                    strokeWidth: 2
                  })}
                </div>
                <div>
                  <h3 className="text-sm font-black text-black">{selectedNode.name}</h3>
                  <p className="text-xs text-gray-700 font-bold">{selectedNode.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="text-xs text-black font-bold">📍 Drag</div>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="w-6 h-6 bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                >
                  <X size={12} className="text-black font-black" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-cyan-200 border-2 border-black rounded">
                <span className="font-black text-black">Type:</span>
                <span className="font-bold text-black capitalize">{selectedNode.type}</span>
              </div>
              
              <div className="flex justify-between p-3 bg-lime-200 border-2 border-black rounded">
                <span className="font-black text-black">Status:</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full border-2 border-black ${
                    selectedNode.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-black capitalize ${
                    selectedNode.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between p-3 bg-purple-200 border-2 border-black rounded">
                <span className="font-black text-black">Priority:</span>
                <span className={`font-black px-2 py-1 rounded border border-black text-xs ${
                  selectedNode.priority === 'Critical' ? 'bg-red-500 text-white' :
                  selectedNode.priority === 'High' ? 'bg-yellow-500 text-black' :
                  selectedNode.priority === 'Medium' ? 'bg-blue-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {selectedNode.priority}
                </span>
              </div>
              
              <div className="p-3 bg-orange-200 border-2 border-black rounded">
                <span className="font-black text-black block mb-2">Function:</span>
                <span className="font-bold text-black text-xs leading-relaxed">
                  {selectedNode.type === 'core' ? 'Central orchestrator that routes and processes all data requests, manages workflow coordination, and ensures system integrity across the GenesisNet marketplace.' :
                   selectedNode.type === 'input' ? 'External data providers that supply market data, datasets, and information resources to the GenesisNet ecosystem for trading and analysis.' :
                   selectedNode.type === 'gateway' ? 'Blockchain interface that connects GenesisNet to the Internet Computer Protocol, enabling secure and decentralized data transactions.' :
                   selectedNode.type === 'security' ? 'Identity verification system that authenticates users, validates permissions, and ensures secure access to data resources.' :
                   selectedNode.type === 'service' ? 'Advanced search and discovery engine that helps users find relevant datasets, filter by criteria, and match data buyers with sellers.' :
                   selectedNode.type === 'blockchain' ? 'Smart contract execution engine that automates data transactions, enforces agreements, and manages payment processing.' :
                   selectedNode.type === 'storage' ? 'Secure storage system for transaction records, metadata, user profiles, and historical data marketplace activity.' :
                   selectedNode.type === 'negotiation' ? 'Deal management platform that facilitates price negotiation, contract terms, and automated agreement execution between parties.' : 
                   'Data processing and management component of the GenesisNet ecosystem.'}
                </span>
              </div>
              
              <div className="flex justify-between p-3 bg-gray-200 border-2 border-black rounded">
                <span className="font-black text-black">Last Updated:</span>
                <span className="font-bold text-black text-xs">
                  {new Date().toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main SVG Canvas */}
      <svg 
        ref={svgRef} 
        className="w-full h-full border-4 border-black cursor-grab active:cursor-grabbing"
        style={{ background: '#fef3c7' }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="flex items-center space-x-3 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-black border-t-transparent"></div>
            <span className="text-lg font-black text-black">Updating Network...</span>
          </div>
        </div>
      )}

      {/* Network Stats */}
      <div className="absolute bottom-4 right-4 z-20 flex space-x-2 text-sm">
        <div className="bg-blue-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2">
          <span className="font-black text-black">Nodes: </span>
          <span className="font-black text-black">14</span>
        </div>
        <div className="bg-green-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2">
          <span className="font-black text-black">Active: </span>
          <span className="font-black text-black">14</span>
        </div>
        <div className="bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2">
          <span className="font-black text-black">Latency: </span>
          <span className="font-black text-black">42ms</span>
        </div>
      </div>

      {/* Interaction Help */}
      <div className="absolute bottom-4 left-4 z-20 bg-cyan-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2 text-xs">
        <div className="font-black text-black mb-1">Controls:</div>
        <div className="font-bold text-black">• Drag to pan</div>
        <div className="font-bold text-black">• Mouse wheel to zoom</div>
        <div className="font-bold text-black">• Click nodes for info</div>
      </div>
    </div>
  );
};

export default NetworkVisualization;
