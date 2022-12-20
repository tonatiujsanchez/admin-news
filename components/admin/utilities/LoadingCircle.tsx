import styled from "@emotion/styled"


export const LoadingCircle = () => {
    return (
        <LoadingContainer>
            <div className='spinner'></div>
        </LoadingContainer>
    )
}


const LoadingContainer = styled.div`
    .spinner {
        border: 3px solid rgba(255, 255, 255, .9);
        border-left-color: transparent;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

`