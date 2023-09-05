/**
 * @module ModuleSpiceAttachments
 */
import {
    Component, OnInit, Input, NgZone, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2, Injector
} from '@angular/core';
import {backend} from "../../../services/backend.service";
import { modal } from '../../../services/modal.service';
import { take } from 'rxjs/operators';

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-attachments-stats',
    templateUrl: '../templates/spiceattachmentstats.html',
})
export class SpiceAttachmentStats {

    public analysisresults: any[] = [];

    /**
     * List of the missing files.
     */
    public missingFiles: any[];
    public missingFilesTotalcount = 0;

    /**
     * The areas where files may be missing (Attachments, Notes, ...).
     */
    public fileAreas: string[] = [];

    constructor(public backend: backend, public modal: modal ) {
        this.analyze();
        this.getMissingFiles();
    }

    /**
     * call the backend to get the analysis results
     *
     * @public
     */
    public analyze() {
        this.analysisresults = [];
        this.backend.getRequest('common/spiceattachments/admin')
            .pipe(take(1))
            .subscribe(res => {
                for (let module in res) {
                    this.analysisresults.push({
                        module: module,
                        count: res[module]
                    });
                }
            });
    }

    /**
     * getter for the total count
     */
    get totalcount() {
        let total = 0;
        for (let f of this.analysisresults) {
            total += parseInt(f.count, 10);
        }
        return total;
    }


    /**
     * call the backend to get the analysis results
     *
     * @public
     */
    public delete() {
        this.modal.confirm('Are you sure you want to delete the data of all orphaned File Attachments?', 'Delete Orphaned Attachments?',  'warning')
            .pipe(take(1))
            .subscribe( answer => {
                if ( answer ) {
                    this.backend.postRequest('common/spiceattachments/admin/cleanup')
                        .pipe(take(1))
                        .subscribe(res => {
                            this.analyze();
                        });
                }
            });
    }

    /**
     * Call the backend to get a list of missing files.
     */
    public getMissingFiles() {
        this.fileAreas = [];
        this.missingFilesTotalcount = 0;
        this.backend.getRequest('common/spiceattachments/admin/missingfiles')
            .pipe(take(1))
            .subscribe(res => {
                this.missingFiles = res;
                for ( let prop in this.missingFiles ) {
                    this.fileAreas.push( prop );
                    this.missingFilesTotalcount += this.missingFiles[prop].count;
                }
            });
    }

}
