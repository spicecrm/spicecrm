/**
 * @module SpiceImporterModule
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

@Component({
    selector: 'spice-importer-result',
    templateUrl: '../templates/spiceimporterresult.html',
    styles: [
        ':host {height: 100%;}'
    ]
})
export class SpiceImporterResult {
    @ViewChild('fileupload', {read: ViewContainerRef, static: true}) public fileupload: ViewContainerRef;

    /**
     * import
     * @param spiceImport
     * @param model
     * @param router
     */
    constructor(
        public spiceImport: SpiceImporterService,
        public model: model,
        public router: Router
    ) {
    }

    /**
     * navigate to record
     * @param id
     */
    public goToRecord(id) {
        this.router.navigate([`/module/${this.model.module}/${id}`]);
    }

}
