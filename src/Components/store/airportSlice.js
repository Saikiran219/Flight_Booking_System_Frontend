import { createSlice ,createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
    data:[],
    status:'idle'
}; 

const  airportSlice = createSlice({
    name: 'Airports',
    initialState, 
    extraReducers:(builder)=>{
        builder
        .addCase(getAirports.pending,(state,action)=>{
            state.status='Loading';

        })
        .addCase(getAirports.fulfilled,(state,action)=>{
            state.data=action.payload
            state.status='idle';
        })
        .addCase(getAirports.rejected,(state,action)=>{
            state.status='error';

        });

    },
});

export default airportSlice.reducer;

 export const getAirports=createAsyncThunk('airports/get',async()=>{
    const response = await fetch('https://localhost:44339/api/Airports');
    const result = await response.json(); 
    return result;
 })