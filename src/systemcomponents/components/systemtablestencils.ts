/**
 * @module SystemComponents
 */
import {Component, Input, OnInit} from '@angular/core';

/**
 * a generic loading tbale component that renders a set of rows with stencoily that are fading out
 */
@Component({
    selector: '[system-table-stencils]',
    templateUrl: '../templates/systemtablestencils.html'
})
export class SystemTableStencils implements OnInit {

    /**
     * the numer of columns to be rendered
     */
    @Input() public columns: number = 1;

    /**
     * the number of rows to be rendered
     */
    @Input() public rows: number = 5;

    /**
     * is set to true expects the table to have a tools column and adds a separate column for the tools without a stencil in it
     */
    @Input() public tools: boolean = false;

    /**
     * if set to true expects the table to have a select column and renders a column in the beginning without a stencil
     */
    @Input() public select: boolean = false;

    /**
     * if set to true expects the table to have a line number column
     */
    @Input() public rownumbers: boolean = false;

    /**
     * if set to true expects the table to have a drag handle column
     */
    @Input() public dragHandles: boolean = false;

    /**
     * @ignore
     *
     * internal array for the columns
     */
    public colArray: any[] = [];

    /**
     * @ignore
     *
     * internal array for the ros
     */
    public rowArray: any[] = [];


    public ngOnInit() {
        // build columns
        let i = 1;
        do {
            this.rowArray.push(i);
            i++;
        } while (i <= this.rows)

        // build rows
        let j = 1;
        do {
            this.colArray.push(j);
            j++;
        } while (j <= this.columns)
    }

    /**
     * returns an opacity depending on the row index
     *
     * @param index the number of the row to be rendered
     */
    public linestyle(index) {
        return {
            opacity: 0.2 + (0.8 / index)
        };
    }
}
