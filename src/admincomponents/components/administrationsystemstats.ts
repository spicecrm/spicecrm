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
    templateUrl: './src/admincomponents/templates/administrationsystemstats.html'
})
export class AdministrationSystemStats {

    /**
     * defines if the stats have been loaded
     *
     * otherwise a spinner is rendered for the user
     */
    private loaded: boolean = false;

    /**
     * holds the stats
     */
    private stats: any = {};

    /**
     * the total number of DB records
     */
    private totaldbrecords: number = 0;

    /**
     * the total db size
     */
    private totaldbsize: number = 0;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private helper: helper
    ) {
        this.loadStats();
    }

    /**
     * loads the stats from the backend
     */
    private loadStats() {
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
    private refresh() {
        this.loadStats();
    }

    /**
     * a getter for the full number of records on elastic
     */
    get totalelasticrecords() {
        try {
            return this.stats.elastic._all.total.docs.count;
        } catch (e) {
            return 0;
        }
    }

    /**
     * a getter for the total size fo the elastic index
     */
    get totalelasticsize() {
        try {
            return this.stats.elastic._all.total.store.size_in_bytes;
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
        return this.totaldbsize + this.totalelasticsize + this.uploadsize;
    }

    /**
     * a helper function to sort the database info
     *
     * @param column the name of the column
     * @param asc defaults to true, send flase to sort descending
     */
    private sortby(column, asc: boolean = true) {
        this.stats.database.sort((a, b) => a[column] > b[column] ? (asc ? -1 : 1) : (asc ? 1 : -1));
    }

    /**
     * calculates the total DB size after the data has been loaded
     */
    private calculateTotalsDB() {
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
    private humanReadableSize(size) {
        return this.helper.humanFileSize(size);
    }

    /**
     * counts the number of documents in an fts index if there is one for the object
     *
     * @param tablename
     */
    private ftsDocumentCount(tablename) {
        try {
            return this.stats.elastic.indices[this.stats.elastic._prefix + tablename].total.docs.count;
        } catch (e) {
            return '';
        }
    }

    /**
     * calculöated the fts index size if there is onbe for the table
     *
     * @param tablename
     */
    private ftsIndexSize(tablename) {
        try {
            return this.humanReadableSize(this.stats.elastic.indices[this.stats.elastic._prefix + tablename].total.store.size_in_bytes);
        } catch (e) {
            return '';
        }
    }
}
