export interface IExcelRow {
    user_id: string;
    name: string;
    category: string;
    context: string;
    email: string;
    phone: string | number;
    outstanding: number;
    due: string;
    status: string;
    followup_count: number;
}

export interface IExcelResponse {
    total_rows: number;
    valid_rows: IExcelRow[];
    invalid_rows: IExcelRow[];
    all_rows: IExcelRow[];
}