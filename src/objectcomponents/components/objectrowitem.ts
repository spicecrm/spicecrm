/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';



@Component({
    selector: '[object-row-item]',
    templateUrl: '../templates/objectrowitem.html',
    providers: [model, view],
})
/**
 *  a component which represents a row in a table with dynamic model data and fields/tds to display
 *  no need of any provided model oder modellist services...
 */
export class ObjectRowItemComponent implements OnInit
{
    @Input('rowselection') rowselect:boolean = false;
    @Input('fields') listFields:Array<any> = [];
    @Input('itemdata') listItem:any = {};
    @Input() module:string;
    @Input() inlineedit:boolean = false;

    // input param to determine if theaction menu is shown for the model
    @Input() showActionMenu:boolean = true;

    @Input('selected')
    @HostBinding('class.slds-is-active')
    @HostBinding('class.slds-is-selected')
    public _selected:boolean = false;

    @Output() select = new EventEmitter();

    constructor(
        public model: model,
        public view: view,
        public router: Router,
        public language: language
    ) {

    }

    ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.listItem.id;
        this.model.setData(this.listItem);

        this.view.isEditable = this.inlineedit && this.model.checkAccess('edit');
    }

    set selected(val:boolean)
    {
        this._selected = val;
        this.select.emit(val);
    }

    get selected():boolean
    {
        return this._selected;
    }

    navigateDetail() {
        this.router.navigate(['/module/' + this.model.module + '/' + this.model.id]);
    }

}
