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
    templateUrl: '../templates/fieldtextmessagetemplates.html'
})

/**
 * will create a dropdown list containing TextMessageTemplates
 * and manage action on template selection.
 * IMPORTANT:
 * Copy rules may eventually be missing depending on your implementation.
 * Think of setting them from your module to TextMessages module (parent_type, parent_id, parent_name)
 * else this.model.getFieldValue('parent_type') will be undefined
 */
export class fieldTextMessageTemplates extends fieldGeneric implements OnInit {

    public isLoaded: boolean = false;
    public availableTemplates: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend,
        public modal: modal,
        public configuration: configurationService
    ) {
        super(model, view, language, metadata, router);
    }

    get bodyField() {
        return this.fieldconfig.body ? this.fieldconfig.body : 'description';
    }

    get isDisabled() {
        return !this.model.getFieldValue('parent_type') || this.model.getFieldValue('parent_type') == '' || !this.isLoaded ? true : false || this.availableTemplates.length == 0;
    }

    public getValue() {
        for (let template of this.availableTemplates) {
            if (template.id == this.value) {
                return template.name;
            }
        }
    }

    public ngOnInit() {
        let textMessageTemplates = this.configuration.getData('TextMessageTemplates');
        if (textMessageTemplates) {
            this.availableTemplates = textMessageTemplates.filter(tpl => (tpl.parent_type == '*' || tpl.parent_type == this.model.getFieldValue('parent_type')));
            this.isLoaded = true;
        } else {
            let params = {
                start: 0,
                limit: 500,
                listid: 'all'
            };
            this.backend.getRequest('module/TextMessageTemplates', params).subscribe(
                (data: any) => {
                    // set the templates
                    this.configuration.setData('TextMessageTemplates', data.list);

                    // set the templates internally
                    this.availableTemplates = data.list.filter(tpl => (tpl.parent_type == '*' || tpl.parent_type == this.model.getFieldValue('parent_type')));

                    this.isLoaded = true;
                }
            );
        }
    }

    public chooseTemplate(event) {
        if(this.value != '') {
            this.modal.openModal('SystemLoadingModal', false ).subscribe(modalRef => {
                 this.backend.getRequest('module/TextMessageTemplates/' + this.value + '/parse/' + this.model.getFieldValue('parent_type') + '/' + this.model.getFieldValue('parent_id')).subscribe((data: any) => {
                    this.model.setField(this.bodyField, data.description);
                    modalRef.instance.self.destroy();
                });
            });
        }
    }
}
