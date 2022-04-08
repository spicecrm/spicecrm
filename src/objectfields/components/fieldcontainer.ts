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
    templateUrl: '../templates/fieldcontainer.html'
})
export class fieldContainer implements AfterViewInit {
    @ViewChild('fieldcontainer', {read: ViewContainerRef, static: true}) public fieldcontainer: ViewContainerRef;

    @Input() public field: string;
    @Input() public fieldconfig: any = {};
    @Input() public fielddisplayclass = 'slds-text-body--regular slds-truncate slds-m-vertical--small spice-fieldbody';

    constructor(
        public model: model,
        public language: language,
        public metadata: metadata,
        public view: view
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

    public buildContainer() {
        this.metadata.addComponent(this.getFieldType(), this.fieldcontainer).subscribe(componentRef => {
            componentRef.instance.fieldname = this.field;
            componentRef.instance.fieldconfig = this.fieldconfig;
            componentRef.instance.fielddisplayclass = this.fielddisplayclass;
        });
    }

    public getFieldType() {
        let fieldType = '';

        // check if we have a field access
        // if (this.model.data && this.model.data.acl_fieldcontrol && this.model.data.acl_fieldcontrol[this.field] && this.model.data.acl_fieldcontrol[this.field] == '1') {
        if (!this.model.checkFieldAccess(this.field)) {
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
