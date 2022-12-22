import React, { FC } from 'react'

import styled from '@emotion/styled'

export const LoadingAdmin:FC = () => {
    return (
        <LoadingContainer>
            <p className='mb-2'>Cargando...</p>
            <div className="race-by"></div>
        </LoadingContainer>
    )
}



const LoadingContainer = styled.div`
    display: inline-block;
    text-align: center;

    .race-by {
        --uib-size: 150px;
        --uib-speed: 1s;
        --uib-color: black;
        --uib-line-weight: 6px;

        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--uib-line-weight);
        width: var(--uib-size);
        border-radius: calc(var(--uib-line-weight) / 2);
        overflow: hidden;
        transform: translate3d(0, 0, 0);
    }

    .race-by::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: var(--uib-color);
        opacity: 0.1;
    }

    .race-by::after {
        content: '';
        height: 100%;
        width: 100%;
        border-radius: calc(var(--uib-line-weight) / 2);
        animation: raceBy var(--uib-speed) ease-in-out infinite;
        transform: translateX(-100%);
        background-color: var(--uib-color);
    }

    @keyframes raceBy {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }
`