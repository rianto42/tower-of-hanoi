import React, { useState, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Controls from './components/Controls';
import TreeCanvas from './components/TreeCanvas';
import Stats from './components/Stats';
import InfoPanel from './components/InfoPanel';
import { useHanoiTree } from './hooks/useHanoiTree';

const AppContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
`;

function App() {
  const [diskCount, setDiskCount] = useState(3);
  const [layoutType, setLayoutType] = useState('hierarchical');
  const [animationSpeed, setAnimationSpeed] = useState('medium');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const canvasRef = useRef(null);
  
  const {
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
  } = useHanoiTree(diskCount, layoutType);

  const handleGenerateTree = useCallback(() => {
    if (diskCount > 7) {
      alert('Maximum 6 disks allowed for performance reasons');
      return;
    }
    generateTree();
  }, [diskCount, generateTree]);

  const handleExpandOneLevel = useCallback(() => {
    expandOneLevel();
  }, [expandOneLevel]);

  // Check if we can expand further (not at the maximum depth for the solution)
  const canExpand = useMemo(() => {
    if (!tree || tree.size === 0) return false;
    
    // For Tower of Hanoi, the optimal solution requires 2^n - 1 moves
    // The tree depth represents levels from root, so max depth is 2^n - 1
    const maxPossibleDepth = Math.pow(2, diskCount) - 1;
    
    // We can expand if we haven't reached the maximum depth
    return maxDepth < maxPossibleDepth-1;
  }, [tree, maxDepth, diskCount]);

  const handleLayoutChange = useCallback((newLayoutType) => {
    setLayoutType(newLayoutType);
    // Get canvas dimensions if available
    const canvas = canvasRef.current?.getCanvas();
    const canvasWidth = canvas?.width || 1200;
    const canvasHeight = canvas?.height || 800;
    recalculatePositions(canvasWidth, canvasHeight);
  }, [recalculatePositions]);

  const handleNodeHover = useCallback((nodeState) => {
    setHoveredNode(nodeState);
  }, []);

  const handleNodeClick = useCallback((nodeState) => {
    setSelectedNode(selectedNode === nodeState ? null : nodeState);
  }, [selectedNode]);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  const handleAnimateSolution = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const solutionPath = findSolutionPath();
    let currentIndex = 0;
    
    const animate = () => {
      if (currentIndex < solutionPath.length) {
        setSelectedNode(solutionPath[currentIndex]);
        currentIndex++;
        
        const delay = animationSpeed === 'fast' ? 500 : 
                     animationSpeed === 'slow' ? 1500 : 1000;
        
        setTimeout(animate, delay);
      } else {
        setIsAnimating(false);
      }
    };
    
    animate();
  }, [isAnimating, findSolutionPath, animationSpeed]);

  return (
    <AppContainer>
      <Container>
        <Header />
        
        <Controls
          diskCount={diskCount}
          setDiskCount={setDiskCount}
          layoutType={layoutType}
          setLayoutType={handleLayoutChange}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          onGenerateTree={handleGenerateTree}
          onExpandOneLevel={handleExpandOneLevel}
          onAnimateSolution={handleAnimateSolution}
          isAnimating={isAnimating}
          maxDepth={maxDepth}
          canExpand={canExpand}
        />
        
        <TreeCanvas
          ref={canvasRef}
          tree={tree}
          positions={positions}
          hoveredNode={hoveredNode}
          selectedNode={selectedNode}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onMouseLeave={handleMouseLeave}
          onRecalculatePositions={recalculatePositions}
          isLoading={isLoading}
        />
        
        <Stats stats={stats} />
      </Container>
      
      <InfoPanel
        tree={tree}
        hoveredNode={hoveredNode}
        selectedNode={selectedNode}
      />
    </AppContainer>
  );
}

export default App;
