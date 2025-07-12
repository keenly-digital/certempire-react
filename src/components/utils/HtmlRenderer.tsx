// src/components/utils/HtmlRenderer.tsx
import React from 'react';
import styled from 'styled-components';

const RenderedContent = styled.div`
  line-height: 1.5;

  p {
    margin-bottom: 1rem;
  }

  strong {
    font-weight: bold;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }
`;

interface HtmlRendererProps {
  htmlString: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ htmlString }) => {
  return <RenderedContent dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export default HtmlRenderer;