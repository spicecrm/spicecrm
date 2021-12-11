/**
 * @module SpiceTextsModule
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {configurationService} from "../../../services/configuration.service";

declare var _;

@Component({
    selector: 'spice-texts-add-button',
    templateUrl: '../templates/spicetextsaddbutton.html',
    providers: [model]
})

export class SpiceTextsAddButton {

    @Input() public parent: any;
    @Input() public spiceTexts: any[] = [];

    constructor(public model: model,
                public modal: modal,
                public configurationService: configurationService,
                public language: language,
                public metadata: metadata,
                public relatedModels: relatedmodels) {
        this.model.module = 'SpiceTexts';
    }

    get sysTextIds() {
        let sysTextIds = this.configurationService.getData('systextids');
        return sysTextIds ? _.values(sysTextIds).filter(text => text.module == this.parent.module) : [];
    }

    get canAdd(){
        return this.metadata.checkModuleAcl('SpiceTexts', 'create') && !this.allTranslated;
    }

    get allTranslated() {
        return this.relatedModels.isloading || this.sysTextIds.length == 0 ||
            (this.spiceTexts.length >= (this.sysTextIds.length * this.language.getAvialableLanguages().length));
    }

    public addModel() {
        if (!this.parent || this.allTranslated) {
            return;
        }

        this.modal.openModal("SpiceTextsAddModal", true).subscribe(ref => {
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
