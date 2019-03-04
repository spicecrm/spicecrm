/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
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
    templateUrl: './src/objectfields/templates/fieldmodulefilter.html',
    providers: [popup],
})
export class fieldModuleFilter extends fieldGeneric implements OnInit {
    private clickListener: any;
    private moduleSelectOpen: boolean = false;
    public modules: any[] = ['Contacts','Accounts','Leads','Users',];

    constructor(
        public model: model,
        public view: view,
        public popup: popup,
        public broadcast: broadcast,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private modal: modal
    ) {
        super(model, view, language, metadata, router);

        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get moduleFilterName(){
        let moduleFilter = this.metadata.getModuleFilter(this.moduleFilter);
        return moduleFilter ? moduleFilter['name'] : '';
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
        this.setModule(this.module);
    }

    private setModule(module) {
        this.model.setField('module', module);
        this.moduleSelectOpen = false;
    }

    private clearFilter() {
        this.model.setField('module_filter', '');
    }

    private handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // set the model
                        this.model.data.module_filter = message.messagedata.data.id;
                        this.model.data[this.fieldname] = message.messagedata.data.summary_text;
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

    private openModules() {
        this.moduleSelectOpen = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    private closePopups() {
        if (this.model.data.module_filter) {
        }
        this.moduleSelectOpen = false;
        this.clickListener();
    }
}
