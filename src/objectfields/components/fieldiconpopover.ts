/**
 * @module ObjectFields
 */
import {Component, ElementRef, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';


@Component({
    selector: 'field-icon-popover',
    templateUrl: '../templates/fieldiconpopover.html',
    host: {
        // '(document:click)': 'this.onClick($event)'
    }
})
export class fieldIconPopover extends fieldGeneric implements OnInit {
    public clickListener: any;

    public parentTypeSelectOpen: boolean = false;
    public parentSearchOpen: boolean = false;
    public parentSearchTerm: string = '';

    public recentItems: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public broadcast: broadcast,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef
    ) {
        super(model, view, language, metadata, router);

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }


    get parentField(){
        return this.model.getField('grpaccount_id');
    }

    get parentIdField(){
        return this.fieldconfig.parentIdField ? this.fieldconfig.parentIdField : 'parent_id';
    }

    get memberCount(){
        return this.model.getField('grp_member_count');
    }

    get parentTypes(): string[]{
        let parenttypes = ['Contacts', 'Accounts', 'Leads'];

        if(this.fieldconfig.parenttypes) {
            parenttypes = this.fieldconfig.parenttypes.replace(/\s/g,'').split(',');
        }

        return parenttypes;
    }

    public handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.parentSearchTerm = '';

                        // set the model
                        let modelfields: any = {};
                        modelfields[this.parentIdField] = message.messagedata.data.id;
                        modelfields[this.fieldname] = message.messagedata.data.summary_text;
                        this.model.setFields(modelfields);
                    }
                    break;
            }
        }
    }

    public onClick(event: MouseEvent): void {

        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    public closePopups() {
        if (this.model.getField(this.parentIdField)) {
            this.parentSearchTerm = '';
        }

        this.parentSearchOpen = false;
        this.parentTypeSelectOpen = false;

        this.clickListener();
    }
}
