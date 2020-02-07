/**
 * @module ModuleReportsDesigner
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'reports-designer-integrate-item-snapshots',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerintegrateitemsnapshots.html'
})
export class ReportsDesignerIntegrateItemSnapshots {

    protected snapshots: any[];
    protected isLoading: boolean = false;

    constructor(private language: language,
                private model: model,
                private backend: backend,
                private modal: modal) {
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
    private loadSnapshots() {
        this.isLoading = true;
        this.backend.getRequest(`KReporter/${this.model.id}/snapshot`).subscribe(snapshots => {
            if (!!snapshots) this.snapshots = snapshots;
            this.isLoading = false;
        });
    }

    /**
     * delete the snapshot with the given id
     * @param snapshotId: string
     */
    private deleteSnapshot(snapshotId) {
        this.modal.confirmDeleteRecord().subscribe(response => {
            if (response) {
                this.backend.deleteRequest(`KReporter/${this.model.id}/snapshot/${snapshotId}`).subscribe(res => {
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
    private trackByFn(index, item) {
        return item.snapshot;
    }
}
