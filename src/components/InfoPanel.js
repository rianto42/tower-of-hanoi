import React from 'react';
import styled from 'styled-components';

const InfoPanelContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  max-width: 300px;
  font-size: 14px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  display: ${props => props.visible ? 'block' : 'none'};
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: #2c3e50;
`;

const InfoText = styled.p`
  margin: 5px 0;
  color: #495057;
`;

function InfoPanel({ tree, hoveredNode, selectedNode }) {
  const activeNode = hoveredNode || selectedNode;
  const visible = !!activeNode;
  
  if (!visible || !tree || !activeNode) {
    return <InfoPanelContainer visible={false} />;
  }
  
  const nodeData = tree.get(activeNode);
  if (!nodeData) {
    return <InfoPanelContainer visible={false} />;
  }
  
  return (
    <InfoPanelContainer visible={visible}>
      <Title>Node Information</Title>
      <InfoText>
        <strong>State:</strong> {activeNode}
      </InfoText>
      <InfoText>
        <strong>Depth:</strong> {nodeData.depth}
      </InfoText>
      <InfoText>
        <strong>Children:</strong> {nodeData.children.length}
      </InfoText>
      <InfoText>
        <strong>Parent:</strong> {nodeData.parent || 'None'}
      </InfoText>
    </InfoPanelContainer>
  );
}

export default InfoPanel;
