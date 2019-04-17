import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {configurationService} from "../../services/configuration.service";

declare var _;

@Component({
    selector: 'object-texts-add-button',
    templateUrl: './src/objectcomponents/templates/objecttextsaddbutton.html',
    providers: [model]
})

export class ObjectTextsAddButton {

    @Input() public parent: any;
    @Input() public spiceTexts: any[] = [];

    constructor(private model: model,
                private modal: modal,
                private configurationService: configurationService,
                private language: language,
                private relatedModels: relatedmodels) {
        this.model.module = 'SpiceTexts';
    }

    get sysTextIds() {
        let sysTextIds = this.configurationService.getData('systextids');
        return sysTextIds ? _.values(sysTextIds).filter(text => text.module == this.parent.module) : [];
    }

    get allTranslated() {
        return this.relatedModels.isloading || this.sysTextIds.length == 0 ||
            (this.spiceTexts.length >= (this.sysTextIds.length * this.language.getAvialableLanguages().length));
    }

    private addModel() {
        if (!this.parent || this.allTranslated) {
            return;
        }

        this.modal.openModal("ObjectTextsAddModal", true).subscribe(ref => {
            if (ref) {
                ref.instance.spiceTexts = this.spiceTexts;
                ref.instance.sysTextIds = this.sysTextIds;
                ref.instance.parent = this.parent;
                ref.instance.response.subscribe(response => {
                    if (response && typeof response == 'object') {
                        this.relatedModels.items.push(response);
                    }
                });
            }
        });
    }
}
