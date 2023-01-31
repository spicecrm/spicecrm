export interface TargetI {
    id: string;
    data: any;
    module: string;
    prospectlists: string[];
    prospectListsDisplay?: string;
    status: 'checked' | 'excluded' | 'included';
    status_date_changed: string;
}
