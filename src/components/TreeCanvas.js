import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  padding: 30px;
  text-align: center;
  background: white;
  position: relative;
  overflow: auto;
  max-height: 80vh;
  max-width: 100%;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Canvas = styled.canvas`
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  cursor: crosshair;
  max-width: 100%;
  height: auto;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6c757d;
  z-index: 10;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TreeCanvas = forwardRef(({
  tree,
  positions,
  hoveredNode,
  selectedNode,
  onNodeHover,
  onNodeClick,
  onMouseLeave,
  onRecalculatePositions,
  isLoading
}, ref) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    resizeCanvas: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      const width = Math.min(1200, rect.width - 60);
      
      // Calculate height based on tree depth if available
      let height = 800;
      if (tree && tree.size > 0) {
        const maxDepth = Math.max(...Array.from(tree.values()).map(data => data.depth));
        height = Math.max(800, (maxDepth + 1) * 120 + 200);
      }
      
      canvas.width = width;
      canvas.height = height;
      draw();
    }
  }));

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!tree || positions.size === 0) return;
    
    // Draw edges first
    drawEdges(ctx);
    
    // Draw nodes
    drawNodes(ctx);
  };

  const drawEdges = (ctx) => {
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    
    for (const [state, data] of tree) {
      const pos1 = positions.get(state);
      if (!pos1) continue;
      
      for (const child of data.children) {
        const pos2 = positions.get(child);
        if (!pos2) continue;
        
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
      }
    }
  };

  const drawNodes = (ctx) => {
    for (const [state, pos] of positions) {
      drawNode(ctx, state, pos);
    }
  };

  const drawNode = (ctx, state, pos) => {
    const isHovered = hoveredNode === state;
    const isSelected = selectedNode === state;
    
    // Node background
    const radius = isHovered ? 35 : 30;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    
    if (isSelected) {
      ctx.fillStyle = '#667eea';
    } else if (isHovered) {
      ctx.fillStyle = '#a8b5ff';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    
    ctx.fill();
    ctx.strokeStyle = isHovered ? '#667eea' : '#dee2e6';
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.stroke();
    
    // Draw tower representation
    drawTower(ctx, state, pos.x, pos.y, radius);
    
    // State label
    ctx.fillStyle = '#495057';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(state, pos.x, pos.y + radius + 20);
  };

  const drawTower = (ctx, state, centerX, centerY, maxRadius) => {
    const pegs = { A: [], B: [], C: [] };
    const diskColors = ['#e41a1c', '#377eb8', '#4daf4a', '#ff7f00', '#984ea3', '#a65628', '#f781bf', '#999999'];
    
    // Parse state
    for (let i = 0; i < state.length; i++) {
      pegs[state[i]].push(i);
    }
    
    const pegPositions = [
      { x: centerX - maxRadius * 0.4, label: 'A' },
      { x: centerX, label: 'B' },
      { x: centerX + maxRadius * 0.4, label: 'C' }
    ];
    
    // Draw pegs
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 3;
    for (const peg of pegPositions) {
      ctx.beginPath();
      ctx.moveTo(peg.x, centerY - maxRadius * 0.6);
      ctx.lineTo(peg.x, centerY + maxRadius * 0.6);
      ctx.stroke();
    }
    
    // Draw disks
    for (const peg of pegPositions) {
      const disks = pegs[peg.label].sort((a, b) => b - a); // Largest first
      
      for (let i = 0; i < disks.length; i++) {
        const disk = disks[i];
        const diskWidth = (disk + 1) * 4;
        const diskHeight = 6;
        const y = centerY + maxRadius * 0.4 - i * diskHeight;
        
        ctx.fillStyle = diskColors[disk % diskColors.length];
        ctx.fillRect(
          peg.x - diskWidth / 2,
          y - diskHeight / 2,
          diskWidth,
          diskHeight
        );
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          peg.x - diskWidth / 2,
          y - diskHeight / 2,
          diskWidth,
          diskHeight
        );
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let found = false;
    for (const [state, pos] of positions) {
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (distance <= 35) {
        onNodeHover(state);
        found = true;
        canvas.style.cursor = 'pointer';
        break;
      }
    }
    
    if (!found) {
      onNodeHover(null);
      canvas.style.cursor = 'crosshair';
    }
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (const [state, pos] of positions) {
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
      if (distance <= 35) {
        onNodeClick(state);
        break;
      }
    }
  };

  const handleMouseLeave = () => {
    onMouseLeave();
  };

  // Effect to draw when dependencies change
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      draw();
    });
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [tree, positions, hoveredNode, selectedNode]);

  // Effect to set up canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const calculateCanvasSize = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      let width = Math.min(1200, rect.width - 60);
      
      // Calculate height based on tree depth if available
      let height = 800;
      if (tree && tree.size > 0) {
        const maxDepth = Math.max(...Array.from(tree.values()).map(data => data.depth));
        // Add extra space for each level and some padding
        height = Math.max(800, (maxDepth + 1) * 120 + 200);
        
        // Calculate width based on the maximum number of nodes at any level
        const levels = new Map();
        for (const [state, data] of tree) {
          if (!levels.has(data.depth)) {
            levels.set(data.depth, []);
          }
          levels.get(data.depth).push(state);
        }
        
        const maxNodesAtLevel = Math.max(...Array.from(levels.values()).map(nodes => nodes.length));
        // Ensure minimum width based on node count (100px per node + padding)
        const minWidth = Math.max(width, maxNodesAtLevel * 100 + 200);
        width = Math.max(width, minWidth);
      }
      
      canvas.width = width;
      canvas.height = height;
      draw();
      
      // Recalculate positions with new canvas size
      if (onRecalculatePositions) {
        onRecalculatePositions(width, height);
      }
    };
    
    const handleResize = () => {
      calculateCanvasSize();
      // Recalculate positions with new canvas size
      if (onRecalculatePositions && canvas.width && canvas.height) {
        onRecalculatePositions(canvas.width, canvas.height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    calculateCanvasSize(); // Initial size calculation
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tree, onRecalculatePositions]); // Re-run when tree changes

  return (
    <CanvasContainer>
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <p>Generating solution tree...</p>
        </LoadingOverlay>
      )}
      <Canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </CanvasContainer>
  );
});

TreeCanvas.displayName = 'TreeCanvas';

export default TreeCanvas;
