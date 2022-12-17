/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import { modal } from '../../services/modal.service';


@Component({
    selector: 'field-modulefilter',
    templateUrl: '../templates/fieldmodulefilter.html',
    providers: [popup],
})
export class fieldModuleFilter extends fieldGeneric implements OnInit {
    public clickListener: any;
    public moduleSelectOpen: boolean = false;
    public modules: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public popup: popup,
        public broadcast: broadcast,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public modal: modal
    ) {
        super(model, view, language, metadata, router);
        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get moduleFilterName(){
        let moduleFilter = this.metadata.getModuleFilter(this.moduleFilter);
        return moduleFilter ? moduleFilter.name : '';
    }

    get module(){
        return this.model.getField('module') || this.modules[0];
    }

    get value() {
        return this.moduleFilterName;
    }

    get moduleFilters(){
        return this.metadata.getModuleFilters(this.module);
    }

    set moduleFilter(id){
        this.model.setField('module_filter', id);
    }

    get moduleFilter(){
        return this.model.getField('module_filter');
    }

    public ngOnInit() {
        this.modules = this.parentTypes;
        this.setModule(this.module);
    }

    get parentTypes(): string[]{
        let parenttypes = ['Contacts','Accounts','Leads','Users',];

        if(this.fieldconfig.parenttypes) {
            parenttypes = this.fieldconfig.parenttypes.replace(/\s/g,'').split(',');
        }

        return parenttypes;
    }

    public setModule(module) {
        this.model.setField('module', module);
        this.moduleSelectOpen = false;
    }

    public clearFilter() {
        this.model.setField('module_filter', '');
    }

    public handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // set the model
                        let modelFields: any = {
                            module_filter: message.messagedata.data.id
                        }
                        modelFields[this.fieldname] = message.messagedata.data.summary_text;
                        this.model.setFields(modelFields);
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

    public openModules() {
        this.moduleSelectOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public closePopups() {
        this.moduleSelectOpen = false;
        this.clickListener();
    }
}
