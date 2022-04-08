/**
 * @module AdminComponentsModule
 */
import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {helper} from "../../services/helper.service";
import {ftsconfiguration} from '../services/ftsconfiguration.service';


@Component({
    selector: '[administration-ftsstatus]',
    templateUrl: '../templates/administrationftsstatus.html',
    providers: [ftsconfiguration]
})
export class AdministrationFTSStatus {

    /**
     * holds the stats and status retrieved from teh backend
     */
    public version: any = {};

    /**
     * holds the stats and status retrieved from teh backend
     */
    public stats: any = {
        docs: 0,
        size: 0
    };

    /**
     * indicates that we are loading the stats
     */
    public loading: boolean = false;

    /**
     * holds the information on all teh indices
     */
    public indices: any[] = [];

    constructor(
        public metadata: metadata,
        public language: language,
        public modal: modal,
        public backend: backend,
        public helper: helper,
        public toast: toast,
        public ftsconfiguration: ftsconfiguration,
        public injector: Injector
    ) {
        this.loadstatus();
    }

    /**
     * gets the status details from teh backend
     */
    public loadstatus() {

        // set to loading
        this.loading = true;

        // reset the indices
        this.indices = [];

        this.backend.getRequest('admin/elastic/status').subscribe(
            response => {
                this.version = response.version;

                // initialize
                this.stats.tdocs = 0;
                this.stats.pdocs = 0;
                this.stats.tsize = 0;
                this.stats.psize = 0;

                if ( response.stats?._all ) {
                    // catch when no fts index is set yet
                    if( response.stats._all.total.docs && response.stats._all.total.docs.count ) {
                        this.stats.tdocs = response.stats._all.total.docs.count;
                        this.stats.pdocs = response.stats._all.primaries.docs.count;
                    }
                    // catch when no fts index is set yet
                    if ( response.stats._all.total?.store && response.stats._all.total.store.size_in_bytes ) {
                        this.stats.tsize = this.helper.humanFileSize( response.stats._all.total.store.size_in_bytes );
                        this.stats.psize = this.helper.humanFileSize( response.stats._all.primaries.store.size_in_bytes );
                    }
                }

                for (let index in response.stats.indices) {
                    this.indices.push({
                        name: index,
                        pdocs: response.stats.indices[index].primaries.docs.count,
                        psize: this.helper.humanFileSize(response.stats.indices[index].primaries.store.size_in_bytes),
                        tdocs: response.stats.indices[index].total.docs.count,
                        tsize: this.helper.humanFileSize(response.stats.indices[index].total.store.size_in_bytes),
                        stored: response.stats.indexed[index].count,
                        unindexed: response.stats.indexed[index].unindexed,
                        blocked: (response.settings && response.settings[index] && response.settings[index].settings.index.blocks?.read_only_allow_delete) ? true : false
                    });
                }

                // sort the indices
                this.indices.sort((a, b) => a.name > b.name ? 1 : -1);

                // no longer loading
                this.loading = false;

            },
            error => {
                this.loading = false;
                this.toast.sendToast('Error loading Status', "error");
            });
    }

    /**
     * unlocks the complete index from a lock entry
     * @private
     */
    public unlock() {
        this.backend.putRequest('admin/elastic/unblock').subscribe(resp => {
            this.loadstatus();
        });
    }

    /**
     * chesks if at least one index is locked
     * @private
     */
    get hasLocks() {
        return this.indices.find(i => i.blocked) ? true : false;
    }



    /**
     * initialize the full index
     */
    public initialize() {
        this.modal.confirm('Are you sure you want to initialize your FTS? It recreates new indices, so indexed data will be lost and have to be rebuild!', 'Initialize')
            .subscribe(res => {
                    if (res) {
                        this.ftsconfiguration.executeAction('init');
                    }
                }
            );
    }

}

