/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import {modal} from '../../services/modal.service';


@Component({
    selector: 'field-parent',
    templateUrl: './src/objectfields/templates/fieldparent.html',
    providers: [popup],
    host: {
        // '(document:click)': 'this.onClick($event)'
    }
})
export class fieldParent extends fieldGeneric implements OnInit {
    private clickListener: any;

    private parentTypeSelectOpen: boolean = false;
    private parentSearchOpen: boolean = false;
    private parentSearchTerm: string = '';

    private recentItems: Array<any> = [];

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

    get parentIdField() {
        return this.fieldconfig.parentIdField ? this.fieldconfig.parentIdField : 'parent_id';
    }

    get parentTypeField() {
        return this.fieldconfig.parentTypeField ? this.fieldconfig.parentTypeField : 'parent_type';
    }

    get parentName() {
        return this.model.getField(this.fieldname);
    }

    get parentType() {
        return this.model.getField(this.parentTypeField);
    }

    get parentId() {
        return this.model.getField(this.parentIdField);
    }

    public ngOnInit() {
        // initialize the parenttype
        if (!this.model.data[this.parentTypeField] || this.model.data[this.parentTypeField] == '') {
            this.model.data[this.parentTypeField] = this.parentTypes[0];
        }
    }

    get parentTypes(): Array<string> {
        let parenttypes = ['Contacts', 'Accounts', 'Leads'];

        if (this.fieldconfig.parenttypes) {
            parenttypes = this.fieldconfig.parenttypes.replace(/\s/g, '').split(',');
        }

        return parenttypes;
    }

    private handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.parentSearchTerm = '';

                        // set the model
                        this.model.data[this.parentIdField] = message.messagedata.data.id;
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

    private closePopups() {
        if (this.model.data[this.parentIdField]) {
            this.parentSearchTerm = '';
        }

        this.parentSearchOpen = false;
        this.parentTypeSelectOpen = false;

        this.clickListener();
    }

    private setParent(parent) {
        this.model.setField(this.fieldname, parent.text);
        this.model.setField(this.parentIdField, parent.id);
    }

    private toggleParentTypeSelect() {
        this.parentTypeSelectOpen = !this.parentTypeSelectOpen;
        this.parentSearchOpen = false;
    }

    private setParentType(parentType) {
        this.parentSearchTerm = '';

        this.model.setField(this.parentTypeField, parentType);
        this.parentTypeSelectOpen = false;
    }

    private clearParent() {
        if (this.fieldconfig.promptondelete) {
            this.modal.confirm(
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)], 'long'),
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)])
            ).subscribe(response => {
                if (response) {
                    this.removeRelated();
                }
            });
        } else {
            this.removeRelated();
        }
    }

    private removeRelated() {
        this.model.setField(this.fieldname, '');
        this.model.setField(this.parentIdField, '');
    }

    private openParentTypes() {
        this.parentTypeSelectOpen = true;
        this.parentSearchOpen = false;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    private onFocusParent() {
        this.parentTypeSelectOpen = false;
        this.parentSearchOpen = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    private goParent() {
        this.router.navigate(['/module/' + this.model.getField(this.parentTypeField) + '/' + this.model.getField(this.parentIdField)]);
    }

    private searchWithModal() {
        this.parentSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.parentType;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.setParent({'id': items[0].id, 'text': items[0].summary_text, 'data': items[0]});
                }
            });
            selectModal.instance.searchTerm = this.parentSearchTerm;
        });
    }

}
