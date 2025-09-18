import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 30px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2.5em;
  font-weight: 300;
`;

const Subtitle = styled.p`
  margin: 10px 0 0 0;
  opacity: 0.8;
  font-size: 1.1em;
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>🏗️ Tower of Hanoi Solution Tree</Title>
      <Subtitle>Interactive visualization of the recursive solution space</Subtitle>
    </HeaderContainer>
  );
}

export default Header;
