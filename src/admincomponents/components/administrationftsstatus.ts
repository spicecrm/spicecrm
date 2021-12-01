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
import set = Reflect.set;


@Component({
    selector: '[administration-ftsstatus]',
    templateUrl: '../templates/administrationftsstatus.html'
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

                this.stats.docs = 0; // initialize
                // catch when no fts index is set yet
                if(response.stats._all.total.docs && response.stats._all.total.docs.count) {
                    this.stats.docs = response.stats._all.total.docs.count;
                }

                this.stats.size = 0;
                // catch when no fts index is set yet
                if(response.stats._all.total.store && response.stats._all.total.store.size_in_bytes) {
                    this.stats.size = this.helper.humanFileSize(response.stats._all.total.store.size_in_bytes);
                }


                for (let index in response.stats.indices) {
                    this.indices.push({
                        name: index,
                        docs: response.stats.indices[index].total.docs.count,
                        size: this.helper.humanFileSize(response.stats.indices[index].total.store.size_in_bytes),
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
            console.log(resp);
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


}

