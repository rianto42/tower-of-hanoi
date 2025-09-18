import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  padding: 20px 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

function Controls({
  diskCount,
  setDiskCount,
  layoutType,
  setLayoutType,
  animationSpeed,
  setAnimationSpeed,
  onGenerateTree,
  onExpandOneLevel,
  onAnimateSolution,
  isAnimating,
  maxDepth,
  canExpand
}) {
  return (
    <ControlsContainer>
      <ControlGroup>
        <Label htmlFor="diskCount">Number of Disks:</Label>
        <Input
          type="number"
          id="diskCount"
          value={diskCount}
          onChange={(e) => setDiskCount(parseInt(e.target.value))}
          min="1"
          max="6"
        />
      </ControlGroup>
      
      <ControlGroup>
        <Label htmlFor="layoutType">Layout:</Label>
        <Select
          id="layoutType"
          value={layoutType}
          onChange={(e) => setLayoutType(e.target.value)}
        >
          <option value="hierarchical">Hierarchical</option>
          <option value="radial">Radial</option>
          <option value="force">Force-directed</option>
        </Select>
      </ControlGroup>
      
      <ControlGroup>
        <Label htmlFor="animationSpeed">Animation Speed:</Label>
        <Select
          id="animationSpeed"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(e.target.value)}
        >
          <option value="slow">Slow</option>
          <option value="medium">Medium</option>
          <option value="fast">Fast</option>
        </Select>
      </ControlGroup>
      
      <Button onClick={onGenerateTree}>
        Generate Tree
      </Button>
      
      <Button 
        onClick={onExpandOneLevel}
        disabled={!canExpand}
        style={{
          background: canExpand ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : undefined
        }}
      >
        Expand One Level (Depth: {canExpand ? maxDepth+1 : maxDepth+1})
      </Button>
      
      <Button 
        onClick={onAnimateSolution}
        disabled={isAnimating}
      >
        {isAnimating ? 'Animating...' : 'Animate Solution'}
      </Button>
    </ControlsContainer>
  );
}

export default Controls;
