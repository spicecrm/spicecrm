/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
