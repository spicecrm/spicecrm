/**
 * @module ModuleReports
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    templateUrl: './src/modules/reports/templates/reporternewbutton.html'
})

export class ReporterNewButton {

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private router: Router) {
    }
    /*
    *navigate to designer
    */
    public execute() {
        if (this.hidden) return;
        this.router.navigate(['/module/KReports/designer/new']);
    }

    /**
     * hide the button while the model is editing
     */
    get hidden() {
        return !this.metadata.checkModuleAcl(this.model.module, 'create');
    }
}
