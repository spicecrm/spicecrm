import {Component, ElementRef, Renderer, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {footer} from '../../services/footer.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';


@Component({
    selector: 'field-parent',
    templateUrl: './app/objectfields/templates/fieldparent.html',
    providers: [popup],
    host: {
        // '(document:click)': 'this.onClick($event)'
    }
})
export class fieldParent extends fieldGeneric implements OnInit {
    parentIdField: string = 'parent_id';
    parentNameField: string = 'parent_name';
    parentTypeField: string = 'parent_type';

    clickListener: any;

    parentTypeSelectOpen: boolean = false;
    parentSearchOpen: boolean = false;
    parentSearchTerm: string = '';

    recentItems: Array<any> = [];

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
    ) {
        super(model, view, language, metadata, router);

        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    ngOnInit(){
        // initialize the parenttype
        if(!this.model.data[this.parentTypeField] || this.model.data[this.parentTypeField] == ''){
            this.model.data[this.parentTypeField] = this.parentTypes[0];
        }
    }

    get parentTypes(): Array<string>{
        let parenttypes = ['Contacts', 'Accounts', 'Leads'];

        if(this.fieldconfig.parenttypes){
            parenttypes = this.fieldconfig.parenttypes.replace(/\s/g,'').split(',');
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
                        this.model.data[this.parentNameField] = message.messagedata.data.summary_text;
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
        if (this.model.data[this.parentIdField])
            this.parentSearchTerm = '';

        this.parentSearchOpen = false;
        this.parentTypeSelectOpen = false;

        this.clickListener();
    }

    setParent(parent){
        this.model.data[this.parentIdField] = parent.id;
        this.model.data[this.parentNameField] = parent.text;
    }

    toggleParentTypeSelect() {
        this.parentTypeSelectOpen = !this.parentTypeSelectOpen;
        this.parentSearchOpen = false;
    }

    setParentType(parentType) {
        this.parentSearchTerm = '';

        //this.parentType = parentType;
        this.model.data[this.parentTypeField] = parentType;
        this.parentTypeSelectOpen = false;
    }

    clearParent() {
        this.model.data[this.parentIdField] = '';
        this.model.data[this.parentNameField] = '';
    }

    onFocus() {
        // this.getRecent();
        this.parentTypeSelectOpen = false;
        this.parentSearchOpen = true;

        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    parentSearchStyle() {
        if (this.parentSearchOpen)
            return {
                display: 'block'
            }
    }

    goParent(){
        this.router.navigate(['/module/' + this.model.data[this.parentTypeField] + '/' + this.model.data[this.parentIdField]]);
    }

}