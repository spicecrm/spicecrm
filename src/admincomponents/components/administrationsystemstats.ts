/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';
import {backend} from '../../services/backend.service';
import {helper} from '../../services/helper.service';

@Component({
    templateUrl: '../templates/administrationsystemstats.html'
})
export class AdministrationSystemStats {

    /**
     * defines if the stats have been loaded
     *
     * otherwise a spinner is rendered for the user
     */
    public loaded: boolean = false;

    /**
     * holds the stats
     */
    public stats: any = {};

    /**
     * the total number of DB records
     */
    public totaldbrecords: number = 0;

    /**
     * the total db size
     */
    public totaldbsize: number = 0;

    constructor(
        public metadata: metadata,
        public language: language,
        public backend: backend,
        public helper: helper
    ) {
        this.loadStats();
    }

    /**
     * loads the stats from the backend
     */
    public loadStats() {
        this.loaded = false;
        this.backend.getRequest('configuration/systemstats').subscribe(stats => {
            this.stats = stats;

            // calculate the totals
            this.calculateTotalsDB();

            // set to loaded
            this.loaded = true;
        });
    }

    /**
     * reloads
     */
    public refresh() {
        this.loadStats();
    }

    /**
     * a getter for the full number of records on elastic
     */
    public totalelasticrecords(type: 'total'|'primaries') {
        try {
            return this.stats.elastic._all[type].docs.count;
        } catch (e) {
            return 0;
        }
    }

    /**
     * a getter for the total size fo the elastic index
     */
    public totalelasticsize(type: 'total'|'primaries') {
        try {
            return this.stats.elastic._all[type].store.size_in_bytes;
        } catch (e) {
            return 0;
        }
    }

    /**
     * a getter for the total number of files in teh upload directory
     */
    get uploadcount() {
        try {
            return this.stats.uploadfiles.count;
        } catch (e) {
            return 0;
        }
    }

    /**
     * a getter for the total size in the uplaod dir
     */
    get uploadsize() {
        try {
            return this.stats.uploadfiles.size;
        } catch (e) {
            return 0;
        }
    }

    /**
     * a getter to compute the full size of the system consumed
     */
    get totalsize() {
        return this.totaldbsize + this.totalelasticsize('total') + this.uploadsize;
    }

    /**
     * a helper function to sort the database info
     *
     * @param column the name of the column
     * @param asc defaults to true, send flase to sort descending
     */
    public sortby(column, asc: boolean = true) {
        this.stats.database.sort((a, b) => a[column] > b[column] ? (asc ? -1 : 1) : (asc ? 1 : -1));
    }

    /**
     * calculates the total DB size after the data has been loaded
     */
    public calculateTotalsDB() {
        this.totaldbrecords = 0;
        this.totaldbsize = 0;
        for (let table of this.stats.database) {
            this.totaldbrecords += parseInt(table.records, 10);
            this.totaldbsize += parseInt(table.size, 10);
        }
    }

    /**
     * format a number in huiman readable size
     *
     * @param size the size to be formatted
     */
    public humanReadableSize(size) {
        return this.helper.humanFileSize(size);
    }

    /**
     * counts the number of documents in an fts index if there is one for the object
     *
     * @param tablename
     */
    public ftsDocumentCount(tablename, type: 'total'|'primaries') {
        try {
            return this.stats.elastic.indices[this.stats.elastic._prefix + tablename][type].docs.count;
        } catch (e) {
            return '';
        }
    }

    /**
     * calculöated the fts index size if there is onbe for the table
     *
     * @param tablename
     */
    public ftsIndexSize(tablename, type: 'total'|'primaries') {
        try {
            return this.humanReadableSize(this.stats.elastic.indices[this.stats.elastic._prefix + tablename][type].store.size_in_bytes);
        } catch (e) {
            return '';
        }
    }
}
