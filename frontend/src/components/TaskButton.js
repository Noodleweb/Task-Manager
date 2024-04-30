import styled from 'styled-components';

const theme = {
    homeButton: {
      default: "#3E5C76",
      hover: "#1D2D44",
    },
    wideButton: {
        default: "#3E5C76",
        hover: "#1D2D44",  
    },
    wideButtonBright: {
        default: "LightSteelBlue ",
        hover: "LightSlateGray",  
    }
};

const ButtonStyle = styled.button`
    background-color: ${(props) => theme[props.theme].default};
    display: inline-block;
    color: white;
    border: none;
    padding-top: 15px;
    padding-bottom: 15px;
    width:100%;
    max-width: 100%;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${(props) => theme[props.theme].hover};
    }

    ${(props) => props.theme === 'homeButton' && `
        text-transform: uppercase;
        width: 100px;
        margin: 2vh;
    `}

    ${(props) => props.theme === 'wideButton' && `
        width: 100%;
    `}
    ${(props) => props.theme === 'wideButtonBright' && `
        width: 100%;
        color: black;
    `}
`;

const TaskButton = (props) => {


    return(
        <div>
            <ButtonStyle theme={props.theme} >
                {props.text}
            </ButtonStyle>
        </div>
    )
}

TaskButton.defaultProps = {
    theme: "homeButton",
};
export default TaskButton