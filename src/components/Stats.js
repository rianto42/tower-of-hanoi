import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px 30px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const StatValue = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.9em;
`;

function Stats({ stats }) {
  return (
    <StatsContainer>
      <StatItem>
        <StatValue>{stats.totalNodes}</StatValue>
        <StatLabel>Total Nodes</StatLabel>
      </StatItem>
      
      <StatItem>
        <StatValue>{stats.totalMoves}</StatValue>
        <StatLabel>Total Moves</StatLabel>
      </StatItem>
      
      <StatItem>
        <StatValue>{stats.treeDepth}</StatValue>
        <StatLabel>Tree Depth</StatLabel>
      </StatItem>
      
      <StatItem>
        <StatValue>{stats.solutionPath}</StatValue>
        <StatLabel>Solution Path Length</StatLabel>
      </StatItem>
    </StatsContainer>
  );
}

export default Stats;
