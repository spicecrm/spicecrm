import {Component, Input, AfterViewInit, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-page-header-detail-row',
    templateUrl: './app/objectcomponents/templates/objectpageheaderdetailrow.html',
    providers: [view]
})
export class ObjectPageHeaderDetailRow implements OnInit{
    @Input() fieldSet: string = '';
    @Input() opacity: number = 1;
    @Input() collapsed: boolean = true;

    constructor(private metadata: metadata, private model: model, private view: view) {

    }

    ngOnInit(){
        this.setLabelLength()
    }

    getFields() {
        let fieldsetFields = this.metadata.getFieldSetFields(this.fieldSet);


        if (this.model.data && this.model.data.acl_fieldcontrol) {
            let thisFieldsetFields = [];
            for (let fieldsetFieldIndex in fieldsetFields) {
                if (!(this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] && this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] === '1'))
                    thisFieldsetFields.push(fieldsetFields[fieldsetFieldIndex]);
            }

            return thisFieldsetFields;
        }

        return fieldsetFields

    }

    toggleCollapsed(){
        this.collapsed = !this.collapsed;

        // set the view label length
        this.setLabelLength();
    }

    get toggleIcon(){
        return this.collapsed ? 'chevrondown' : 'chevronup';
    }

    setLabelLength(){
        if(this.collapsed)
            this.view.labels = 'short';
        else
            this.view.labels = 'default';
    }
}