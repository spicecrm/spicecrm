/*
/!**
 * @module ModuleSpiceUrls
 *!/
import {Component} from '@angular/core';
import {backend} from "../../../services/backend.service";
import { modal } from '../../../services/modal.service';
import { take } from 'rxjs/operators';

/!**
 * displays a quicknote that is read in teh stream
 *!/
@Component({
    selector: 'spice-url-stats',
    templateUrl: '../templates/spiceurlstats.html',
})
export class SpiceUrlStats {

    public analysisresults: any[] = [];

    /!**
     * List of the missing files.
     *!/
    public missingFiles: any[];
    public missingFilesTotalcount = 0;

    /!**
     * The areas where files may be missing (Urls, Notes, ...).
     *!/
    public fileAreas: string[] = [];

    constructor(public backend: backend, public modal: modal ) {
        this.analyze();
        this.getMissingFiles();
    }

    /!**
     * call the backend to get the analysis results
     *
     * @public
     *!/
    public analyze() {
        this.analysisresults = [];
        this.backend.getRequest('common/spiceurls/admin')
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

    /!**
     * getter for the total count
     *!/
    get totalcount() {
        let total = 0;
        for (let f of this.analysisresults) {
            total += parseInt(f.count, 10);
        }
        return total;
    }


    /!**
     * call the backend to get the analysis results
     *
     * @public
     *!/
    public delete() {
        this.modal.confirm('Are you sure you want to delete the data of all orphaned File Urls?', 'Delete Orphaned Urls?',  'warning')
            .pipe(take(1))
            .subscribe( answer => {
                if ( answer ) {
                    this.backend.postRequest('common/spiceurls/admin/cleanup')
                        .pipe(take(1))
                        .subscribe(res => {
                            this.analyze();
                        });
                }
            });
    }

    /!**
     * Call the backend to get a list of missing files.
     *!/
    public getMissingFiles() {
        this.fileAreas = [];
        this.missingFilesTotalcount = 0;
        this.backend.getRequest('common/spiceurls/admin/missingfiles')
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
*/
