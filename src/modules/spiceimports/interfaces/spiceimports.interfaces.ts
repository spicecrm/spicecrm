/**
 * @module ModuleSpiceImports
 */

/**
 * the events that belongs to a record which will be displayed in timeline view
 */
export interface importLog {
    id: string;
    rowpointer: number;
    date_entered: string,
    msg: string;
    data: any;
    import_id: string;
    reference_id: string;
    reference_summary: string;
    showdetails?: boolean
}