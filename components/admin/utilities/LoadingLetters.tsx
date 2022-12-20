import styled from "@emotion/styled"


export const LoadingLetters = () => {
    return (
        <LoadingLettersContainer>
            <span className="loader"></span>
        </LoadingLettersContainer>
    )
}

const LoadingLettersContainer = styled.div`
    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #ceedfd;
        border-bottom-color: var(--primary-color);
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 0.5s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
`
