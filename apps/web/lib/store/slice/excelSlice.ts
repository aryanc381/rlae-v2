import { IExcelResponse, IExcelRow } from "@/lib/types/excel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExcelState {
    data: IExcelResponse | null;
    selectedUser: IExcelRow | null;
    loading: boolean;
    error: string | null;
}

const initialState: ExcelState = {
    data: null,
    selectedUser: null,
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
        },
        selectUser(state, action: PayloadAction<IExcelRow>) {
            state.selectedUser = action.payload;
        }
    }
});

export const { uploadStart, uploadSuccess, uploadFailure, resetExcel, selectUser } = excelSlice.actions;
export default excelSlice.reducer;