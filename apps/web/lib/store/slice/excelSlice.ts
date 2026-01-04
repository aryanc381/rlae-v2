import { IExcelResponse } from "@/lib/types/excel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExcelState {
    data: IExcelResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: ExcelState = {
    data: null,
    loading: false,
    error: null
}

const excelSlice = createSlice({
    name: "excel",
    initialState,
    reducers: {
        uploadStart(state) {
            state.loading = true;
            state.error = null;
        },
        uploadSuccess(state, action: PayloadAction<IExcelResponse>) {
            state.loading = false;
            state.data = action.payload;
        },
        uploadFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        resetExcel(state) {
            return initialState;
        }
    }
});

export const { uploadStart, uploadSuccess, uploadFailure, resetExcel } = excelSlice.actions;
export default excelSlice.reducer;