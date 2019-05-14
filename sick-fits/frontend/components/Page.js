import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Metada from './Metadata';

const StyledPage = styled.div`
    background: white;
    color: ${props => props.theme.black};
`;

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem;
`;

class Page extends React.Component {
     render() {
         return (
         <StyledPage>
             <Metada></Metada>
             <Header />
             <Inner>{this.props.children}</Inner>
         </StyledPage>);
     }
 }

export default Page;