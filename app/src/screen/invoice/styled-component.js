import styled from 'styled-components';

export const TextOverflow = styled.div`
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
`;

export const FilterWrapper = styled.div`
    margin: 22px 0;
    display: flex;

    & button {
        margin-left: 30px;
    }
`;

export const ActionsWrapper = styled.div`
    margin: 22px 0;
    display: flex;
    justify-content: flex-end;

    & button:not(:last-child) {
        margin-right: 20px;
    }
`;