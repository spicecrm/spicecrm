/**
 * @module ObjectFields
 */
import {Component, Input, ViewChild, ViewContainerRef, AfterViewInit} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'field-container',
    templateUrl: './src/objectfields/templates/fieldcontainer.html'
})
export class fieldContainer implements AfterViewInit {
    @ViewChild('fieldcontainer', {read: ViewContainerRef, static: false}) private fieldcontainer: ViewContainerRef;

    @Input() private field: string;
    @Input() private fieldconfig: any = {};
    @Input() private fielddisplayclass = 'slds-text-body--regular slds-truncate slds-m-vertical--small spicecrm-fieldbody';

    constructor(
        protected model: model,
        private language: language,
        private metadata: metadata,
        private view: view
    ) {

    }

    @Input()
    set fieldname(val) {
        this.field = val;
    }

    get fieldname() {
        return this.field;
    }

    get stati() {
        let stati = this.model.getFieldStati(this.field);
        return stati;
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    private buildContainer() {
        this.metadata.addComponent(this.getFieldType(), this.fieldcontainer).subscribe(componentRef => {
            componentRef.instance.fieldname = this.field;
            componentRef.instance.fieldconfig = this.fieldconfig;
            componentRef.instance.fielddisplayclass = this.fielddisplayclass;
        });
    }

    private getFieldType() {
        let fieldType = '';

        if (this.model.data && this.model.data.acl_fieldcontrol && this.model.data.acl_fieldcontrol[this.field] && this.model.data.acl_fieldcontrol[this.field] == '1') {
            return 'fieldNotAuthorized';
        }

        if (this.field === 'blank') {
            fieldType = 'blank';
        } else {
            fieldType = this.fieldconfig.fieldtype ? this.fieldconfig.fieldtype : this.metadata.getFieldType(this.model.module, this.field);
        }

        let fieldtypeComponent = this.metadata.getFieldTypeComponent(fieldType);
        return fieldtypeComponent ? fieldtypeComponent : 'fieldGeneric';

    }
}
