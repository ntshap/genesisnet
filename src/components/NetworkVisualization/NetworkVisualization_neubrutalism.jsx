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
  Cpu,
  Bot,
  Drone,
  Rocket,
  Target,
  Eye,
  EyeOff
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
  const [trackingMode, setTrackingMode] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);
  const [agentPositions, setAgentPositions] = useState({});

  useEffect(() => {
    if (isLoading) return;
    
    const svg = d3.select(svgRef.current);
    // Hapus timer dan inisialisasi langsung agar zoom/pan tidak reset
    initializeNetwork();
    setIsInitialized(true);
    // Jangan reset posisi zoom/pan setiap render
  }, [networkData, agentStatus, isLoading]);

  // Simulate autonomous agent movement
  useEffect(() => {
    if (!isInitialized) return;

    const agentTypes = ['Bot', 'Drone', 'Rocket'];
    const nodes = ['data-providers', 'icp-gateway', 'data-request-agent', 'search-engine', 'smart-contracts', 'storage-system', 'negotiation-platform'];
    
    const moveAgent = () => {
      const randomAgent = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      
      setActiveAgent({
        type: randomAgent,
        targetNode: randomNode,
        timestamp: Date.now()
      });

      // Update agent positions for tracking
      setAgentPositions(prev => ({
        ...prev,
        [randomAgent]: randomNode
      }));

      // Auto-track if tracking mode is enabled
      if (trackingMode) {
        setTimeout(() => {
          focusOnNode(randomNode);
        }, 500);
      }
    };

    const interval = setInterval(moveAgent, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isInitialized, trackingMode]);

  const focusOnNode = (nodeId) => {
    const svg = d3.select(svgRef.current);
    const node = svg.select(`[data-node-id="${nodeId}"]`);
    
    if (!node.empty()) {
      const nodeElement = node.node();
      const bbox = nodeElement.getBBox();
      const container = svg.node().parentElement;
      const containerRect = container.getBoundingClientRect();
      
      const targetX = containerRect.width / 2 - (bbox.x + bbox.width / 2);
      const targetY = containerRect.height / 2 - (bbox.y + bbox.height / 2);
      
      const newTransform = d3.zoomIdentity
        .translate(targetX, targetY)
        .scale(1.2);
      
      svg.transition()
        .duration(1000)
        .call(d3.zoom().transform, newTransform);
      
      setZoomTransform(newTransform);
    }
  };

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
        { id: 'security-layer', name: 'Security Layer', subtitle: 'Identity verification', type: 'standard', color: '#dc2626', icon: Shield, priority: 'Critical' },
      ],
      [ // Tier 2
        { id: 'data-request-agent', name: 'Data Request Agent', subtitle: 'Autonomous negotiator', type: 'core', color: '#059669', icon: Bot, priority: 'Critical' },
        { id: 'search-engine', name: 'Search Engine', subtitle: 'Data discovery', type: 'service', color: '#7c3aed', icon: Globe, priority: 'High' },
        { id: 'smart-contracts', name: 'Smart Contracts', subtitle: 'Transaction execution', type: 'blockchain', color: '#0891b2', icon: Code, priority: 'High' },
      ],
      [ // Tier 3
        { id: 'negotiation-platform', name: 'Negotiation Platform', subtitle: 'Deal management', type: 'negotiation', color: '#f59e0b', icon: Handshake, priority: 'High' },
        { id: 'storage-system', name: 'Storage System', subtitle: 'Secure data vault', type: 'storage', color: '#6b7280', icon: Archive, priority: 'Medium' },
        { id: 'analytics-engine', name: 'Analytics Engine', subtitle: 'Data processing', type: 'service', color: '#ec4899', icon: BarChart3, priority: 'Medium' },
      ],
      [ // Tier 4
        { id: 'quality-assurance', name: 'Quality Assurance', subtitle: 'Data validation', type: 'service', color: '#10b981', icon: Activity, priority: 'High' },
        { id: 'payment-processor', name: 'Payment Processor', subtitle: 'Transaction handling', type: 'blockchain', color: '#f97316', icon: DollarSign, priority: 'High' },
        { id: 'monitoring-dashboard', name: 'Monitoring Dashboard', subtitle: 'System oversight', type: 'service', color: '#8b5cf6', icon: Cpu, priority: 'Medium' },
      ]
    ];

    const workflowNodes = [];
    const tierHeight = 120;
    const startY = 80;

    tiers.forEach((tier, tierIndex) => {
      const tierY = startY + tierIndex * tierHeight;
      const tierWidth = tier.length * 200;
      const startX = (width - tierWidth) / 2;

      tier.forEach((node, nodeIndex) => {
        const nodeX = startX + nodeIndex * 200 + 100;
        const nodeY = tierY;
        
        workflowNodes.push({
          ...node,
          x: nodeX,
          y: nodeY,
          status: 'active',
          tier: tierIndex
        });
      });
    });

    // Define connections with enhanced flow types
    const workflowConnections = [
      { source: 'data-providers', target: 'data-request-agent', type: 'flow', color: '#22d3ee', label: 'Data Supply' },
      { source: 'icp-gateway', target: 'data-request-agent', type: 'flow', color: '#1d4ed8', label: 'Blockchain' },
      { source: 'security-layer', target: 'data-request-agent', type: 'flow', color: '#dc2626', label: 'Auth' },
      { source: 'data-request-agent', target: 'search-engine', type: 'flow', color: '#059669', label: 'Discovery' },
      { source: 'search-engine', target: 'smart-contracts', type: 'flow', color: '#7c3aed', label: 'Match' },
      { source: 'smart-contracts', target: 'negotiation-platform', type: 'flow', color: '#0891b2', label: 'Deal' },
      { source: 'negotiation-platform', target: 'storage-system', type: 'flow', color: '#f59e0b', label: 'Store' },
      { source: 'storage-system', target: 'analytics-engine', type: 'flow', color: '#6b7280', label: 'Process' },
      { source: 'analytics-engine', target: 'quality-assurance', type: 'flow', color: '#ec4899', label: 'Validate' },
      { source: 'quality-assurance', target: 'payment-processor', type: 'flow', color: '#10b981', label: 'Pay' },
      { source: 'payment-processor', target: 'monitoring-dashboard', type: 'flow', color: '#f97316', label: 'Monitor' },
    ];

    // Draw connections with enhanced visual effects
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

        // Enhanced connection points with pulsing effect
        const sourcePoint = connectionGroup.append('circle')
          .attr('cx', sourceNode.x)
          .attr('cy', sourceNode.y + 28)
          .attr('r', 3)
          .attr('fill', conn.color || '#000000')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        const targetPoint = connectionGroup.append('circle')
          .attr('cx', targetNode.x)
          .attr('cy', targetNode.y - 28)
          .attr('r', 3)
          .attr('fill', conn.color || '#000000')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        // Add pulsing animation to connection points
        const pulseAnimation = () => {
          sourcePoint
            .transition()
            .duration(1000)
            .attr('r', 6)
            .transition()
            .duration(1000)
            .attr('r', 3)
            .on('end', pulseAnimation);
        };
        pulseAnimation();

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

    // Draw consistent card-based nodes with enhanced visual effects
    const nodeGroup = mainGroup.append('g').attr('class', 'nodes');
    
    workflowNodes.forEach(node => {
      // Smaller, more consistent card sizes to prevent overlapping
      const cardWidth = node.type === 'core' ? 160 : 140; // Reduced sizes
      const cardHeight = 55; // Reduced height for better spacing
      
      const nodeContainer = nodeGroup.append('g')
        .attr('transform', `translate(${node.x - cardWidth/2}, ${node.y - cardHeight/2})`)
        .attr('data-node-id', node.id);

      // Enhanced card shadow with animation
      const shadow = nodeContainer.append('rect')
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

            // Add lightning effect for active nodes
      if (activeAgent && activeAgent.targetNode === node.id) {
        // Lightning bolt effect
        const lightning = nodeContainer.append('path')
          .attr('d', 'M-10,-10 L-5,-5 L-8,0 L-3,5 L-10,10 L-5,5 L-8,0 L-3,-5 Z')
          .attr('fill', '#ffff00')
          .attr('stroke', '#ff6600')
          .attr('stroke-width', 2)
          .attr('opacity', 0)
          .attr('transform', `translate(${cardWidth + 10}, ${cardHeight/2})`);

        // Lightning animation
        lightning
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .transition()
          .duration(200)
          .attr('opacity', 0)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .transition()
          .duration(200)
          .attr('opacity', 0)
          .on('end', () => lightning.remove());
      }

      // Clean header
      const headerHeight = 16;
      nodeContainer.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cardWidth)
        .attr('height', headerHeight)
        .attr('fill', 'rgba(0,0,0,0.1)')
        .attr('rx', 6);

      // Status indicator with enhanced animation
      const statusColor = node.status === 'active' ? '#22c55e' : '#ef4444';
      const statusIndicator = nodeContainer.append('circle')
        .attr('cx', cardWidth - 10)
        .attr('cy', 8)
        .attr('r', 4)
        .attr('fill', statusColor)
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);

      // Pulsing animation for status indicator
      const statusPulse = () => {
        statusIndicator
          .transition()
          .duration(1000)
          .attr('r', 6)
          .transition()
          .duration(1000)
          .attr('r', 4)
          .on('end', statusPulse);
      };
      statusPulse();

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

      // Enhanced icon with robot/drone icons for agents
      const IconComponent = node.icon;
      const iconSvg = nodeContainer.append('foreignObject')
        .attr('x', 8)
        .attr('y', 18)
        .attr('width', 18)
        .attr('height', 18)
        .append('xhtml:div')
        .style('width', '18px')
        .style('height', '18px')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center');

      // Use robot/drone icons for agent nodes
      if (node.id === 'data-request-agent') {
        iconSvg.html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>`);
      } else {
        iconSvg.html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
      }

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

    // Enhanced flow indicators with robot/drone agents
    const flowGroup = mainGroup.append('g').attr('class', 'flow-indicators');
    
    workflowConnections.forEach((conn, index) => {
      const sourceNode = workflowNodes.find(n => n.id === conn.source);
      const targetNode = workflowNodes.find(n => n.id === conn.target);
      
      if (sourceNode && targetNode && conn.type === 'flow') {
        // Create agent icon that moves along the connection
        const agentGroup = flowGroup.append('g')
          .attr('opacity', 0);

        // Random agent type for variety
        const agentTypes = ['Bot', 'Drone', 'Rocket'];
        const agentType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
        
        // Agent icon
        const agentIcon = agentGroup.append('foreignObject')
          .attr('width', 20)
          .attr('height', 20)
          .append('xhtml:div')
          .style('width', '20px')
          .style('height', '20px')
          .style('display', 'flex')
          .style('align-items', 'center')
          .style('justify-content', 'center');

        // Set agent icon based on type
        if (agentType === 'Bot') {
          agentIcon.html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>`);
        } else if (agentType === 'Drone') {
          agentIcon.html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 17.5L3 6V2h4l11.5 11.5"></path>
            <path d="M13 19l6-6"></path>
            <path d="M16 16h4v4"></path>
          </svg>`);
        } else {
          agentIcon.html(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.5 16.5c-1.5 1.5-1.5 3.5 0 5s3.5 1.5 5 0L21 7"></path>
            <path d="M12 15l-3-3a2 2 0 0 1 0-3l5-5"></path>
            <path d="M22 21l-5-5"></path>
            <path d="M14 11l4 4"></path>
          </svg>`);
        }

        // Agent background circle
        agentGroup.append('circle')
          .attr('r', 12)
          .attr('fill', conn.color || '#22d3ee')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);

        const animateAgent = () => {
          agentGroup
            .attr('transform', `translate(${sourceNode.x}, ${sourceNode.y + 28})`)
            .attr('opacity', 1)
            .transition()
            .duration(2000 + Math.random() * 1000)
            .ease(d3.easeLinear)
            .attr('transform', `translate(${targetNode.x}, ${targetNode.y - 28})`)
            .transition()
            .duration(300)
            .attr('opacity', 0)
            .on('end', () => {
              setTimeout(animateAgent, 2000 + Math.random() * 2000);
            });
        };

        setTimeout(animateAgent, index * 500);
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

  const toggleTracking = () => {
    setTrackingMode(!trackingMode);
    if (!trackingMode && activeAgent) {
      focusOnNode(activeAgent.targetNode);
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
        
        {/* Tracking Camera Toggle */}
        <button 
          onClick={toggleTracking}
          className={`px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black text-sm font-black hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
            trackingMode ? 'bg-purple-400' : 'bg-blue-400'
          }`}
        >
          {trackingMode ? <Eye size={16} /> : <EyeOff size={16} />}
          {trackingMode ? ' Auto-Track' : ' Manual'}
        </button>
      </div>

      {/* Active Agent Status */}
      {activeAgent && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white border-2 border-black rounded flex items-center justify-center">
              {activeAgent.type === 'Bot' ? <Bot size={14} /> : 
               activeAgent.type === 'Drone' ? <Drone size={14} /> : 
               <Rocket size={14} />}
            </div>
            <span className="font-black text-black">
              {activeAgent.type} Agent Active at {activeAgent.targetNode}
            </span>
          </div>
        </div>
      )}

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
