import {
    Component, EventEmitter, HostBinding,
    Input, Output,
} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

declare var _;

@Component({
    selector: '[object-table-row]',
    templateUrl: './src/objectcomponents/templates/objecttablerow.html',
    providers: [view],
    host: {
        'class': 'slds-hint-parent',
    }
})
export class ObjectTableRow
{
    @Input() fields = [];
    @Input() selected = false;
    @Output('select') select$ = new EventEmitter();
    @Output('unselect') unselect$ = new EventEmitter();
    private _selectable:boolean = false;

    constructor(
        private language: language,
        private model: model,
        private view: view
    ) {
        this.view.isEditable = false;
    }

    // only static via attribute allowed!
    @Input()
    get selectable():boolean { return this._selectable; }
    set selectable(value) {
        // if value is "" because only the tag is attached to, take it as true...
        if(value == 'false' || value == '0')
            value = false;
        else
            value = true;
        this._selectable = value;
    }

    toggleSelection()
    {
        if(!this.selectable)
            return false;

        this.selected = !this.selected;
        if(this.selected)
            this.select$.emit(this.model.data);
        else
            this.unselect$.emit(this.model.data);
    }

}