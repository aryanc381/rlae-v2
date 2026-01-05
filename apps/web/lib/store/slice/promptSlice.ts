import { IPromptState } from "@/lib/types/prompt";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IPromptState = {
    qualities: [],
    specifications: [],
    outliers: [],
    basePrompt: null,
    finalPrompt: null,
    matchedUseCase: null,
    matchedUseCaseId: null,
    similarity: null
}

const promptSlice = createSlice({
  name: 'prompt',
  initialState,
  reducers: {
    setPromptConfig(
      state,
      action: PayloadAction<{
        qualities: string[];
        specifications: string[];
        basePrompt?: string;
        finalPrompt?: string;
        outliers: string[];
        matchedUseCase?: string;
        matchedUseCaseId?: number;
        similarity?: number;
      }>
    ) {
      state.qualities = action.payload.qualities;
      state.specifications = action.payload.specifications;
      state.basePrompt = action.payload.basePrompt ?? null;
      state.finalPrompt = action.payload.finalPrompt ?? null;
      state.outliers = action.payload.outliers;
      state.matchedUseCaseId = action.payload.matchedUseCaseId ?? null;
      state.similarity = action.payload.similarity ?? null;
    },

    setBasePrompt(state, action: PayloadAction<string>) {
      state.basePrompt = action.payload;
    },

    setFinalPrompt(state, action: PayloadAction<string>) {
      state.finalPrompt = action.payload;
    },

    resetPrompt() {
      return initialState;
    }
  }
});

export const { setPromptConfig, setBasePrompt, setFinalPrompt, resetPrompt } = promptSlice.actions;
export default promptSlice.reducer;