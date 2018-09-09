import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-lookup',
    templateUrl: './app/objectfields/templates/fieldlookup.html',
    providers: [popup]
})
export class fieldLookup extends fieldGeneric implements OnInit{
    @ViewChild('popover', {read: ViewContainerRef}) popover: ViewContainerRef;

    clickListener: any;

    lookupType: string = '';
    lookupmoduleSelectOpen: boolean = false;
    lookupSearchOpen: boolean = false;
    lookupSearchTerm: string = '';

    recentItems: Array<any> = [];

    constructor(public model: model,
                public view: view,
                public popup: popup,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                private elementRef: ElementRef,
                private renderer: Renderer2) {
        super(model, view, language, metadata, router);

        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    ngOnInit(){
        this.lookupType = this.lookupmodules[0];
    }

    get displayAssignedUser(){
        return this.fieldconfig.displayassigneduser;
    }

    get lookupmodules(): Array<string>{
        let lookupmodules = ['Contacts', 'Users'];

        if(this.fieldconfig.lookupmodules){
            lookupmodules = this.fieldconfig.lookupmodules.replace(/\s/g,'').split(',');
        }

        return lookupmodules;
    }

    get pills(){
        let pills = [];
        for(let lookupModule of this.lookupmodules){
            if(this.model.data[lookupModule.toLowerCase()] && this.model.data[lookupModule.toLowerCase()].beans){
                for(let beanid in this.model.data[lookupModule.toLowerCase()].beans){
                    let bean = this.model.data[lookupModule.toLowerCase()].beans[beanid];

                    // special handling for assigned user
                    if(lookupModule == 'Users' && !this.displayAssignedUser && beanid == this.model.data.assigned_user_id)
                        continue;

                    // pus to the pills
                    pills.push({
                        module: lookupModule,
                        id: bean.id,
                        summary_text: bean.summary_text
                    })
                }
            }
        }
        return pills;
    }


    addItem(item){
        if(!this.model.data[this.lookupType.toLowerCase()]) this.model.data[this.lookupType.toLowerCase()] = {beans:{}};

        this.model.data[this.lookupType.toLowerCase()].beans[item.id] = {
            id: item.id,
            summary_text: item.text
        }

    }

    private handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.lookupSearchTerm = '';

                        // set the model
                        //this.model.data[this.parentIdField] = message.messagedata.data.id;
                        //this.model.data[this.parentNameField] = message.messagedata.data.summary_text;
                        this.addItem({id:message.messagedata.data.id, text: message.messagedata.data.summary_text});
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

    private closePopups() {
        /*
        if (this.model.data[this.parentIdField])
            this.lookupSearchTerm = '';
        */

        this.lookupSearchOpen = false;
        this.lookupmoduleSelectOpen = false;

        this.clickListener();
    }

    toggleParentTypeSelect() {
        this.lookupmoduleSelectOpen = !this.lookupmoduleSelectOpen;
        this.lookupSearchOpen = false;
    }

    setLookupType(lookupType) {
        this.lookupSearchTerm = '';
        this.lookupType = lookupType;
        this.lookupmoduleSelectOpen = false;
    }

    removeItem(item) {
        this.model.data[item.module.toLowerCase()].beans_relations_to_delete[item.id] = item;
        delete(this.model.data[item.module.toLowerCase()].beans[item.id]);
    }

    onFocus() {
        // this.getRecent();
        this.lookupmoduleSelectOpen = false;
        this.lookupSearchOpen = true;

        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    parentSearchStyle() {
        if (this.lookupSearchOpen)
            return {
                display: 'block'
            }
    }


}