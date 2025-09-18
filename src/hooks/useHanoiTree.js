import { useState, useCallback, useMemo } from 'react';

export function useHanoiTree(diskCount, layoutType) {
  const [tree, setTree] = useState(new Map());
  const [positions, setPositions] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [maxDepth, setMaxDepth] = useState(0);

  const buildHanoiTree = useCallback((n, targetDepth = null) => {
    const tree = new Map();
    const visited = new Set();
    const root = 'A'.repeat(n);
    
    tree.set(root, { children: [], parent: null, depth: 0 });
    visited.add(root);
    
    const queue = [{ state: root, depth: 0 }];
    
    while (queue.length > 0) {
      const { state, depth } = queue.shift();
      
      // Stop building if we've reached the target depth
      // If targetDepth is 0, we only want the root node
      // If targetDepth is 1, we want root + its children, etc.
      if (targetDepth !== null && depth > targetDepth) {
        continue;
      }
      
      const children = getValidMoves(state);
      
      for (const childState of children) {
        if (!visited.has(childState)) {
          visited.add(childState);
          tree.set(childState, { 
            children: [], 
            parent: state, 
            depth: depth + 1 
          });
          tree.get(state).children.push(childState);
          queue.push({ state: childState, depth: depth + 1 });
        }
      }
    }
    
    return tree;
  }, []);

  const getValidMoves = useCallback((state) => {
    const moves = [];
    const pegs = { A: [], B: [], C: [] };
    
    // Parse current state
    for (let i = 0; i < state.length; i++) {
      pegs[state[i]].push(i);
    }
    
    // Find valid moves
    for (const fromPeg of ['A', 'B', 'C']) {
      for (const toPeg of ['A', 'B', 'C']) {
        if (fromPeg === toPeg) continue;
        
        if (pegs[fromPeg].length > 0) {
          const topDisk = Math.min(...pegs[fromPeg]);
          
          if (pegs[toPeg].length === 0 || Math.min(...pegs[toPeg]) > topDisk) {
            const newState = state.split('');
            newState[topDisk] = toPeg;
            moves.push(newState.join(''));
          }
        }
      }
    }
    
    return moves;
  }, []);

  const calculateHierarchicalPositions = useCallback((tree, canvasWidth = 1200, canvasHeight = 800) => {
    const positions = new Map();
    
    // Group nodes by depth
    const levels = new Map();
    for (const [state, data] of tree) {
      if (!levels.has(data.depth)) {
        levels.set(data.depth, []);
      }
      levels.get(data.depth).push(state);
    }
    
    const maxDepth = Math.max(...levels.keys());
    // Use more space between levels for better visibility
    const levelHeight = Math.max(100, (canvasHeight - 100) / (maxDepth + 1));
    
    for (const [depth, nodes] of levels) {
      const y = 50 + depth * levelHeight;
      
      // Calculate node spacing based on available width
      // Leave 100px margin on each side, and ensure minimum 80px between nodes
      const availableWidth = canvasWidth - 200; // 100px margin on each side
      const minNodeSpacing = 80;
      const nodeSpacing = Math.max(minNodeSpacing, availableWidth / (nodes.length + 1));
      
      // Center the nodes within the available width
      const totalWidth = (nodes.length - 1) * nodeSpacing;
      const startX = (canvasWidth - totalWidth) / 2;
      
      nodes.forEach((state, index) => {
        const x = startX + index * nodeSpacing;
        positions.set(state, { x, y });
      });
    }
    
    return positions;
  }, []);

  const calculateRadialPositions = useCallback((tree, canvasWidth = 1200, canvasHeight = 800) => {
    const positions = new Map();
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    // Use the smaller dimension minus margin for radius
    const maxRadius = Math.min(centerX, centerY) - 150;
    
    // Group nodes by depth
    const levels = new Map();
    for (const [state, data] of tree) {
      if (!levels.has(data.depth)) {
        levels.set(data.depth, []);
      }
      levels.get(data.depth).push(state);
    }
    
    const maxDepth = Math.max(...levels.keys());
    
    for (const [depth, nodes] of levels) {
      // Only place nodes on the outer ring if there are multiple levels
      const radius = maxDepth > 0 ? (maxRadius * depth) / maxDepth : 0;
      const angleStep = nodes.length > 1 ? (2 * Math.PI) / nodes.length : 0;
      
      nodes.forEach((state, index) => {
        const angle = index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.set(state, { x, y });
      });
    }
    
    return positions;
  }, []);

  const calculateForceDirectedPositions = useCallback((tree, canvasWidth = 1200, canvasHeight = 800) => {
    const positions = new Map();
    
    // Initialize random positions with better margins
    for (const state of tree.keys()) {
      positions.set(state, {
        x: Math.random() * (canvasWidth - 200) + 100,
        y: Math.random() * (canvasHeight - 200) + 100,
        vx: 0,
        vy: 0
      });
    }
    
    // Simple force-directed layout
    const iterations = 100;
    const k = Math.sqrt((canvasWidth * canvasHeight) / tree.size);
    
    for (let iter = 0; iter < iterations; iter++) {
      // Repulsive forces
      for (const [state1, pos1] of positions) {
        for (const [state2, pos2] of positions) {
          if (state1 === state2) continue;
          
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (k * k) / distance;
          
          pos1.vx += (dx / distance) * force * 0.01;
          pos1.vy += (dy / distance) * force * 0.01;
        }
      }
      
      // Attractive forces for connected nodes
      for (const [state, data] of tree) {
        for (const child of data.children) {
          const pos1 = positions.get(state);
          const pos2 = positions.get(child);
          
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (distance * distance) / k;
          
          pos1.vx += (dx / distance) * force * 0.01;
          pos1.vy += (dy / distance) * force * 0.01;
          pos2.vx -= (dx / distance) * force * 0.01;
          pos2.vy -= (dy / distance) * force * 0.01;
        }
      }
      
      // Update positions
      for (const pos of positions.values()) {
        pos.x += pos.vx;
        pos.y += pos.vy;
        pos.vx *= 0.9; // Damping
        pos.vy *= 0.9;
        
        // Keep within bounds with better margins
        pos.x = Math.max(100, Math.min(canvasWidth - 100, pos.x));
        pos.y = Math.max(100, Math.min(canvasHeight - 100, pos.y));
      }
    }
    
    return positions;
  }, []);

  const calculatePositions = useCallback((newLayoutType = layoutType, canvasWidth = 1200, canvasHeight = 800) => {
    if (!tree || tree.size === 0) return;
    
    let newPositions;
    
    switch (newLayoutType) {
      case 'hierarchical':
        newPositions = calculateHierarchicalPositions(tree, canvasWidth, canvasHeight);
        break;
      case 'radial':
        newPositions = calculateRadialPositions(tree, canvasWidth, canvasHeight);
        break;
      case 'force':
        newPositions = calculateForceDirectedPositions(tree, canvasWidth, canvasHeight);
        break;
      default:
        newPositions = calculateHierarchicalPositions(tree, canvasWidth, canvasHeight);
    }
    
    setPositions(newPositions);
  }, [tree, layoutType, calculateHierarchicalPositions, calculateRadialPositions, calculateForceDirectedPositions]);

  const generateTree = useCallback(() => {
    setIsLoading(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      // Start with just the root node (depth 0)
      const newTree = buildHanoiTree(diskCount, -1);
      setTree(newTree);
      setMaxDepth(-1); // Reset max depth when generating new tree
      setIsLoading(false);
    }, 100);
  }, [diskCount, buildHanoiTree]);

  const expandOneLevel = useCallback(() => {
    if (!tree || tree.size === 0) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newMaxDepth = maxDepth + 1;
      const newTree = buildHanoiTree(diskCount, newMaxDepth);
      setTree(newTree);
      setMaxDepth(newMaxDepth);
      setIsLoading(false);
    }, 100);
  }, [tree, maxDepth, diskCount, buildHanoiTree]);

  const findSolutionPath = useCallback(() => {
    if (!tree || tree.size === 0) return [];
    
    const root = 'A'.repeat(diskCount);
    const goal = 'C'.repeat(diskCount);
    
    const visited = new Set();
    const queue = [{ state: root, path: [root] }];
    
    while (queue.length > 0) {
      const { state, path } = queue.shift();
      
      if (state === goal) {
        return path;
      }
      
      if (visited.has(state)) continue;
      visited.add(state);
      
      const data = tree.get(state);
      if (data) {
        for (const child of data.children) {
          if (!visited.has(child)) {
            queue.push({ state: child, path: [...path, child] });
          }
        }
      }
    }
    
    return [];
  }, [tree, diskCount]);

  const stats = useMemo(() => {
    if (!tree || tree.size === 0) {
      return {
        totalNodes: 0,
        totalMoves: 0,
        treeDepth: 0,
        solutionPath: 0
      };
    }
    
    const totalNodes = tree.size;
    const totalMoves = Array.from(tree.values()).reduce((sum, data) => sum + data.children.length, 0);
    const maxDepth = Math.max(...Array.from(tree.values()).map(data => data.depth));
    const solutionPath = maxDepth; // For Hanoi, the solution path equals the max depth
    
    return {
      totalNodes,
      totalMoves,
      treeDepth: maxDepth,
      solutionPath
    };
  }, [tree]);

  // Recalculate positions when tree or layout type changes
  useMemo(() => {
    if (tree.size > 0) {
      calculatePositions();
    }
  }, [tree, calculatePositions]);

  // Function to recalculate positions with new canvas dimensions
  const recalculatePositions = useCallback((canvasWidth, canvasHeight) => {
    if (tree.size > 0) {
      calculatePositions(layoutType, canvasWidth, canvasHeight);
    }
  }, [tree, layoutType, calculatePositions]);

  return {
    tree,
    positions,
    stats,
    isLoading,
    maxDepth,
    generateTree,
    expandOneLevel,
    calculatePositions,
    recalculatePositions,
    findSolutionPath
  };
}
