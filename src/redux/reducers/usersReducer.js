const initialState = { status: [] };

export default function changeStatus(state = initialState, action) {
    let nextState;
    // console.log(state.status + "  state.status"); // tableau contenant les personne cocher
    // console.log(action.value + "  action.value"); // id de la personne switcher

    switch (action.type) {
        case 'CHANGE_STATUS':

            if(state.status.includes(action.value)) {
                nextState = {
                    ...state,
                    status : state.status.filter(word => word !== action.value)
                }
            }

            else {
                nextState = {
                    ...state,
                    status : [...state.status, action.value]
                }
            }

        return nextState || state

        default : return state
    }
}