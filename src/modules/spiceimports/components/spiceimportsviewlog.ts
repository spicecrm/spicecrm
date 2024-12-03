/**
 * @module ModuleSpiceImports
 */
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modellist} from "../../../services/modellist.service";
import {importLog} from "../interfaces/spiceimports.interfaces";

@Component({
    selector: 'spice-imports-view-log',
    templateUrl: '../templates/spiceimportsviewlog.html',
})
export class SpiceImportsViewLog implements OnChanges{

    /**
     * the log entries found
     */
    public logEntries: importLog[] = [];

    /**
     * the header names
     */
    public header: string[];

    /**
     * the module that has been imported
     */
    @Input() public module: string;

    /**
     * the selected ID
     */
    @Input() public importid: string;

    /**
     * inidcates that the list is loading
     */
    public loading: boolean = false;

    /**
     * the total number of records
     */
    public totalCount: number = 0;

    constructor(
        public backend: backend
    ) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.logEntries = [];
        this.totalCount = 0;
        this.loadEntries();
    }

    public loadMore(){
        if(!this.loading && this.totalCount > this.logEntries.length){
            this.loadEntries();
        }
    }

    private loadEntries() {
        this.loading = true;
        let params = {
            start: this.logEntries.length,
            limit: 50
        }
        this.backend.getRequest(`module/SpiceImports/${this.importid}/logs`, params).subscribe({
            next: (res) => {
                this.logEntries = this.logEntries.concat(res.logs);
                this.header = res.header;
                this.totalCount = res.totalcount;
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
            }
        });
    }
}
