import { createSlice } from '@reduxjs/toolkit';

export type TLanguage = 'ru' | 'en';

export interface AppState {
  language: TLanguage;
  userId: number;
}

const initialState: AppState = {
  language: 'ru',
  userId: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeLanguage: (state) => {
      state.language = state.language === 'ru' ? 'en' : 'ru';
    },
  },
});

export const { changeLanguage } = appSlice.actions;

export default appSlice.reducer;
