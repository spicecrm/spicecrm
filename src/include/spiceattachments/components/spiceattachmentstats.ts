/**
 * @module ModuleSpiceAttachments
 */
import {
    Component, OnInit, Input, NgZone, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2, Injector
} from '@angular/core';
import {backend} from "../../../services/backend.service";

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentstats.html',
})
export class SpiceAttachmentStats {

    private analysisresults: any[] = [];

    constructor(private backend: backend) {
        this.analyze();
    }

    /**
     * call the backend to get the analysis results
     *
     * @private
     */
    private analyze() {
        this.analysisresults = [];
        this.backend.getRequest('common/spiceattachments/admin').subscribe(res => {
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
     * @private
     */
    private delete() {
        this.backend.postRequest('common/spiceattachments/admin/cleanup').subscribe(res => {
            this.analyze();
        });
    }
}
