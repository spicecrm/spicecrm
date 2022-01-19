/**
 * @module ModuleReportsDesignerMore
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'reports-designer-more-integrate-item-snapshots',
    templateUrl: '../templates/reportsdesignermoreintegrateitemsnapshots.html'
})
export class ReportsDesignerMoreIntegrateItemSnapshots {

    public snapshots: any[];
    public isLoading: boolean = false;

    constructor(public language: language,
                public model: model,
                public backend: backend,
                public modal: modal) {
    }

    /**
     * call loadSnapshots
     */
    public ngOnInit() {
        this.loadSnapshots();
    }

    /**
     * load the snapshots from backend
     */
    public loadSnapshots() {
        this.isLoading = true;
        this.backend.getRequest(`module/KReports/${this.model.id}/snapshots`).subscribe(snapshots => {
            if (!!snapshots) this.snapshots = snapshots;
            this.isLoading = false;
        });
    }

    /**
     * delete the snapshot with the given id
     * @param snapshotId: string
     */
    public deleteSnapshot(snapshotId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.backend.deleteRequest(`module/KReports/${this.model.id}/snapshot/${snapshotId}`).subscribe(res => {
                    if (!!res) {
                        this.snapshots = this.snapshots.filter(snapshot => snapshot.snapshot != snapshotId);
                    }
                });
            }
        });
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    public trackByFn(index, item) {
        return item.snapshot;
    }
}
