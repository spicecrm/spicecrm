/**
 * @module SpiceImporterModule
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {layout} from '../../../services/layout.service';

@Component({
    selector: 'spice-importer-import-button',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterimportbutton.html'
})
export class SpiceImporterImportButton implements OnInit {

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private layout: layout) {

    }

    public ngOnInit() {
        // this.disabled = this.metadata.checkModuleAcl(this.model.module, 'import') ? false : true;
    }

    public execute() {
        this.router.navigate(['/module/' + this.model.module + '/import']);
    }

    get disabled(): boolean {
        return !this.metadata.checkModuleAcl(this.model.module, 'import') || this.layout.screenwidth == 'small';
    }

}
