import React, { useEffect } from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    padding: 10px;
    border-radius: 5px;
    background-color: ${props => props.isSuccess ? '#28a745' : '#dc3545'};
    color: #fff;
    z-index: 1600;
`;

function AlertBox({ isSuccess, clearAlert }) {
    useEffect(() => {
        if (isSuccess !== null) {
            const timer = setTimeout(() => {
                clearAlert();
            }, 5000); // 5s

            return () => clearTimeout(timer); // This will clear the timer when the component unmounts
        }
    }, [isSuccess, clearAlert]);

    if (isSuccess === null) {
        return null;
    }

    return (
        <AlertContainer isSuccess={isSuccess}>
            {isSuccess ? 'The form was posted successfully.' : 'There was an error posting the form.'}
        </AlertContainer>
    );
}

export default AlertBox;