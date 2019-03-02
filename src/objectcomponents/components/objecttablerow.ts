/**
 * @module ObjectComponents
 */
import {
    Component, EventEmitter,
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
    @Input() public fields = [];
    @Input() public selected = false;
    @Output('select') public select$ = new EventEmitter();
    @Output('unselect') public unselect$ = new EventEmitter();
    private selectable: boolean = false;
    @Input('selectable') public attr_selectable: string;

    constructor(
        private language: language,
        private model: model,
        private view: view,
    ) {
        this.view.isEditable = false;
    }

    public ngOnInit()
    {
        // cause of attribute binding doesn't work when using attr.selectable I have to use it as @Input... and read it only one time here...
        this.selectable = this.attr_selectable !== null;
    }

    public toggleSelection()
    {
        if(!this.selectable) {
            return false;
        }

        this.selected = !this.selected;
        if(this.selected) {
            this.select$.emit(this.model.data);
        } else {
            this.unselect$.emit(this.model.data);
        }
    }

}
