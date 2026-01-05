export interface IPromptState {
    qualities: string[],
    specifications: string[],
    outliers: string[],
    basePrompt: string | null,
    finalPrompt: string | null;

    matchedUseCase: string | null;
    matchedUseCaseId: number | null;
    similarity: number | null;
}