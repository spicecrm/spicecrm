/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {fieldGeneric} from "./fieldgeneric";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'field-textmessage-templates',
    templateUrl: './src/objectfields/templates/fieldtextmessagetemplates.html'
})
export class fieldTextMessageTemplates extends fieldGeneric implements OnInit {

    private isLoaded: boolean = false;
    private availableTemplates: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    get bodyField() {
        return this.fieldconfig.body ? this.fieldconfig.body : 'body';
    }

    get isDisabled() {
        // return !this.model.getFieldValue('parent_type') || this.model.getFieldValue('parent_type') == '' || !this.isLoaded ? true : false || this.availableTemplates.length == 0;
        return !this.isLoaded ? true : false || this.availableTemplates.length == 0;
    }

    private getValue() {
        for (let template of this.availableTemplates) {
            if (template.id == this.value) {
                return template.name;
            }
        }
    }

    public ngOnInit() {
        let templateFilterParams = {
            searchfields: JSON.stringify({join: 'AND', conditions:[]})
        };

        this.backend.getRequest('module/TextMessageTemplates', templateFilterParams).subscribe((data: any) => {
            this.availableTemplates = data.list;
            this.isLoaded = true;
        });


    }

    public chooseTemplate(event) {

        if(this.value != '') {
            this.modal.openModal('SystemLoadingModal', false ).subscribe(modalRef => {
                 this.backend.getRequest('module/TextMessageTemplates/' + this.value + '/parse/' + this.model.getFieldValue('parent_type') + '/' + this.model.getFieldValue('parent_id')).subscribe((data: any) => {
                    this.model.setField(this.bodyField, data.body_html);
                    modalRef.instance.self.destroy();
                });
            });
        }

    }
}
