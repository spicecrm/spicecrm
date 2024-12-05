export interface ChangeHistoryRecordI {
    id: string;
    /**
     * when applying multiple changes at once e.g. field sequence for all objects
     * set this property to mark all related object to be changed simultaneously
     */
    groupId?: string;
    obj: any;
    action: ChangeHistoryActionI;
    scope: string;
    key?: string | symbol;
    previousValue?: any;
    newValue?: any;
}

export type ChangeHistoryActionI = 'new' | 'update' | 'firstUpdate' | 'afterSaveFirstUpdate' | 'updateNew';