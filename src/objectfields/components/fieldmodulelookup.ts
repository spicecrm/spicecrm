import {Component, ElementRef, Renderer, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-module-lookup',
    templateUrl: './app/objectfields/templates/fieldmodulelookup.html',
    providers: [popup],
})
export class FieldModuleLookupComponent extends fieldGeneric implements OnInit
{
    relateIdField: string = '';
    relateNameField: string = '';
    @Input() module:string = '';

    private _selected_item:any = null;

    private clickListener:any;

    show_search_results:boolean = false;
    search_term:string = '';

    @Output() select = new EventEmitter();

    constructor(
        public model:model,
        public view:view,
        public popup:popup,
        public language:language,
        public metadata:metadata,
        public router:Router,
        private elementRef:ElementRef,
        private renderer:Renderer,
    ) {
        super(model, view, language, metadata, router);
        this.popup.closePopup$.subscribe(() => this.closePopups());
    }

    ngOnInit()
    {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        if( !this.module )
            this.module = fieldDefs.module;
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        this.clickListener();

        if (this.model.data[this.relateIdField])
            this.search_term = '';

        this.show_search_results = false;

    }

    onFocus() {
        this.show_search_results = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    set selected_item(item)
    {
        if( item ) {
            this._selected_item = item.data;
            if (this.relateNameField)
                this.model.setField(this.relateNameField, item.text);
            if (this.relateIdField)
                this.model.setField(this.relateIdField, item.id);
        }
        else
        {
            this._selected_item = null;
            if(this.relateIdField)
                this.model.setField(this.relateIdField, '');
            if(this.relateNameField)
                this.model.setField(this.relateNameField, '');

        }

        this.select.emit(this.selected_item);
    }

    get selected_item()
    {
        return this._selected_item;
    }

    get id():string
    {
        //console.log(this.selected_item);
        if(this.selected_item && this.selected_item.id)
            return this.selected_item.id;
        else if(this.relateIdField)
            return this.model.data[this.relateIdField];
        else
            return '';
    }

    get item_summary_text():string
    {
        if(this.selected_item && this.selected_item.summary_text)
            return this.selected_item.summary_text;
        else if(this.relateNameField)
            return this.model.data[this.relateNameField];
        else
            return '';
    }

    goToDetail() {
        // go to the record
        this.router.navigate(['/module/' + this.module + '/' + this.selected_item.id]);
    }

    getSearchStyle() {
        if (this.show_search_results) {
            let rect = this.elementRef.nativeElement.getBoundingClientRect();
            return {
                width: rect.width + 'px',
                display: 'block'
            }
        }
    }

    clear()
    {
        this.search_term = '';
        this.selected_item = null;
    }

}