import App, { Container } from 'next/app';
import { ThemeProvider, injectGlobal } from 'styled-components';
import React from 'react';
import Page from '../components/Page';


const theme = {
    red: '#FF0000',
    black: '#393939',
    grey: '#3A3A3A',
    lightgrey: '#E1E1E1',
    offWhite: '#EDEDED',
    maxWidth: '1000px',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
};

injectGlobal`
    @font-face {
        font-family: 'radnika_next';
        src: url('/static/radnikanext-medium-webfont.woff2/') format('woff2');
        font-weight: normal;
        font-style: normal;

    }
    html {
        box-sizing: border-box;
        font-size: 10px;

    }

    *, *:before, *:after {
        box-sizing: inherit;
    }

    a {
        text-decoration: none;
        color: ${theme.black};
    }

    body {
        padding: 0;
        margin: 0;
        font-size: 1.5rem;
        line-height: 2;
        font-family: 'radbika_next';
    }
`;

class SickFitsApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    render() {
        const { Component, pageProps } = this.props
        return (
            <Container>
                <ThemeProvider theme={theme}>
                    <Page>
                        <Component {...pageProps} />
                    </Page>
                </ThemeProvider>
            </Container>
        )
    }
}

export default SickFitsApp;