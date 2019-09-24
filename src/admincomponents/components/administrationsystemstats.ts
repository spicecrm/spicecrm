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

    private loaded: boolean = false;

    private stats: any = {};

    private totaldbrecords: number = 0;
    private totaldbsize: number = 0;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private helper: helper
    ) {
        this.backend.getRequest('admin/systemstats').subscribe(stats => {
            this.stats = stats;

            // calculate the totals
            this.calculateTotalsDB();

            // set to loaded
            this.loaded = true;
        });
    }

    get totalelasticrecords() {
        try {
            return this.stats.elastic._all.total.docs.count;
        } catch (e) {
            return 0;
        }
    }

    get totalelasticsize() {
        try {
            return this.stats.elastic._all.total.store.size_in_bytes;
        } catch (e) {
            return 0;
        }
    }

    get uploadcount() {
        try {
            return this.stats.uploadfiles.count;
        } catch (e) {
            return 0;
        }
    }

    get uploadsize() {
        try {
            return this.stats.uploadfiles.size;
        } catch (e) {
            return 0;
        }
    }

    get totalsize() {
        return this.totaldbsize + this.totalelasticsize + this.uploadsize;
    }

    private sortby(column, asc: boolean = true) {
        this.stats.database.sort((a, b) => a[column] > b[column] ? (asc ? -1 : 1) : (asc ? 1 : -1));
    }

    private calculateTotalsDB() {
        this.totaldbrecords = 0;
        this.totaldbsize = 0;
        for (let table of this.stats.database) {
            this.totaldbrecords += parseInt(table.records, 10);
            this.totaldbsize += parseInt(table.size, 10);
        }
    }

    private humanReadableSize(size) {
        return this.helper.humanFileSize(size);
    }

    private ftsDocumentCount(tablename) {
        try {
            return this.stats.elastic.indices[this.stats.elastic._prefix + tablename].total.docs.count;
        } catch (e) {
            return '';
        }
    }

    private ftsIndexSize(tablename) {
        try {
            return this.stats.elastic.indices[this.stats.elastic._prefix + tablename].total.store.size_in_bytes;
        } catch (e) {
            return '';
        }
    }
}
