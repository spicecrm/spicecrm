import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    templateUrl: './src/modules/reports/templates/reporternewbutton.html'
})

export class ReporterNewButton {

    constructor(private language: language,
                private modal: modal,
                private metadata: metadata,
                private modelList: modellist,
                private model: model) {
    }

    public execute() {
        let modules = this.metadata.getModules();
        if (!modules) return;

        modules.sort();
        this.modal
            .prompt('input', this.language.getLabel('LBL_SELECT_A_MODULE'), this.language.getLabel('LBL_MODULE'), null, null, modules)
            .subscribe(index => {
                if (!modules[index]) return;

                this.model.addModel('', '', {report_module: modules[index]})
                    .subscribe(res => {
                        if (res) this.modelList.reLoadList();
                    });
            });
    }
}
