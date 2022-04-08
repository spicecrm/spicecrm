/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-module-lookup',
    templateUrl: '../templates/fieldmodulelookup.html',
    providers: [popup],
})
export class FieldModuleLookupComponent extends fieldGeneric implements OnInit {
    public relateIdField: string = '';
    public relateNameField: string = '';
    @Input() public module: string = '';

    public _selected_item: any = null;

    public clickListener: any;

    public show_search_results: boolean = false;
    public search_term: string = '';

    @Output() public select = new EventEmitter();

    constructor(
        public model: model,
        public view: view,
        public popup: popup,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2,
    ) {
        super(model, view, language, metadata, router);
        this.popup.closePopup$.subscribe(() => this.closePopups());
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        if( !this.module ) {
            this.module = fieldDefs.module;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    public closePopups() {
        this.clickListener();

        if (this.model.getField(this.relateIdField)) {
            this.search_term = '';
        }

        this.show_search_results = false;

    }

    public onFocus() {
        this.show_search_results = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    set selected_item(item)
    {
        if( item ) {
            this._selected_item = item.data;
            if (this.relateNameField) {
                this.model.setField(this.relateNameField, item.text);
            }
            if (this.relateIdField) {
                this.model.setField(this.relateIdField, item.id);
            }
        } else {
            this._selected_item = null;
            if(this.relateIdField) {
                this.model.setField(this.relateIdField, '');
            }
            if(this.relateNameField) {
                this.model.setField(this.relateNameField, '');
            }
        }

        this.select.emit(this.selected_item);
    }

    get selected_item()
    {
        return this._selected_item;
    }

    get id(): string {
        if (this.selected_item && this.selected_item.id) {
            return this.selected_item.id;
        } else if (this.relateIdField) {
            return this.model.getField(this.relateIdField);
        } else {
            return '';
        }
    }

    get item_summary_text(): string {
        if (this.selected_item && this.selected_item.summary_text) {
            return this.selected_item.summary_text;
        } else if (this.relateNameField) {
            return this.model.getField(this.relateNameField);
        } else {
            return '';
        }
    }

    public goToDetail() {
        // go to the record
        this.router.navigate(['/module/' + this.module + '/' + this.selected_item.id]);
    }

    public getSearchStyle() {
        if (this.show_search_results) {
            let rect = this.elementRef.nativeElement.getBoundingClientRect();
            return {
                width: rect.width + 'px',
                display: 'block'
            };
        }
    }

    public clear() {
        this.search_term = '';
        this.selected_item = null;
    }
}
