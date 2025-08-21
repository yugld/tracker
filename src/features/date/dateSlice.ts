import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';

interface DateState {
  selectedDate: string;
}

const initialState: DateState = {
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
};

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedDate } = dateSlice.actions;
export default dateSlice.reducer;
