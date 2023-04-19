/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';

@Component({
    templateUrl: '../templates/administrationsystemcacheviewer.html'
})
export class AdministrationSystemCacheViewer {

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
        public modal: modal,
        public toast: toast
    ) {
        this.loadStats();
    }

    /**
     * loads the stats from the backend
     */
    public loadStats() {
        this.loaded = false;
        this.backend.getRequest('admin/spicecache/keys').subscribe(stats => {
            this.stats = stats;

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
     * reloads
     */
    public reset() {
        this.modal.confirm('MSG_RESET_CACHE', 'MSG_RESET_CACHE').subscribe({
            next: (res) => {
                if (res) {
                    let loadingModal = this.modal.await('LBL_LOADING');
                    this.backend.deleteRequest('system/cache').subscribe(result => {
                        loadingModal.emit(true);
                        if(result) {
                            this.toast.sendToast('LBL_CACHE_RESET', 'success');
                            this.stats = [];
                        } else {
                            this.toast.sendToast('LBL_ERROR', 'error');
                        }
                    });
                }
            }
        })
    }

    public getKey(key){
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`admin/spicecache/key/${key}`).subscribe({
            next: (res) => {
                loadingModal.emit(true);
                this.modal.openModal('AdministrationSystemCacheViewerDetails').subscribe({
                    next: (modalRef) => {
                        modalRef.instance.cachedKey = key;
                        modalRef.instance.cachedData = res.content;
                        modalRef.instance.deleteitem.subscribe({
                            next: (del) => {
                                if(del) this.deleteKey(key);
                            }
                        })
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
            }
        })
    }

    public deleteKey(key){
        this.modal.confirm('MSG_DELETE_RECORD', 'MSG_DELETE_RECORD').subscribe({
            next: (res) => {
                if(res){
                    this.backend.deleteRequest(`admin/spicecache/key/${key}`).subscribe({
                        next: (res) => {
                            let i = this.stats.findIndex(s => s.key == key);
                            if(i >= 0) this.stats.splice(i, 1);
                        }
                    })
                }
            }
        })
    }
}
