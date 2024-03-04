export interface ChangeHistoryRecordI {
    id: string;
    obj: any;
    action: ChangeHistoryActionI;
    scope: string;
    key?: string | symbol;
    previousValue?: any;
    newValue?: any;
}

export type ChangeHistoryActionI = 'new' | 'update' | 'firstUpdate' | 'afterSaveFirstUpdate' | 'updateNew';