/**
 * holds an interface for object checklists component checklist item
 */
export interface ChecklistItemI {
    id: string;
    isCompleted: boolean;
    text: string;
    textBackup?: string;
    isChanged?: boolean;
}/**
 * holds an interface for object checklists component checklist
 */
export interface ChecklistI {
    id: string;
    name: string;
    items: ChecklistItemI[];
    showCompleted: boolean;
    showAddButton?: boolean;
}
