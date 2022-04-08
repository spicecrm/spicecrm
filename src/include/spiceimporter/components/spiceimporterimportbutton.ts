/**
 * @module SpiceImporterModule
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';

/**
 * an action button to trigger the import
 */
@Component({
    selector: 'spice-importer-import-button',
    templateUrl: '../templates/spiceimporterimportbutton.html'
})
export class SpiceImporterImportButton {

    constructor(public language: language, public metadata: metadata, public model: model, public router: Router, public layout: layout) {}

    /**
     * navigate to the import route
     */
    public execute() {
        this.router.navigate(['/import/' + this.model.module]);
    }

    /**
     * gets the disabled state for the import button based on teh acl rights for the user
     */
    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'import') || this.layout.screenwidth == 'small';
    }

}
