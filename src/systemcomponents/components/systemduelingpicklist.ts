/**
 * @module SystemComponents
 */
import {
    AfterContentInit,
    ChangeDetectorRef,
    Component, ContentChildren,
    ElementRef,
    forwardRef,
    Input, QueryList,
    Renderer2
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SystemDuelingPicklistItem} from "./systemduelingpicklistitem";

/**
 * renders a dueling picklist
 *
 * usage as follows with the system-select-icon-item for the items
 *
 *     <system-dueling-picklist [(ngModel)]="myvalue">
 *         <system-dueling-picklist-item value="x" label="LBL_VAL_X""/>
 *         <system-dueling-picklist-item value="y" label="LBL_VAL_Y""/>
 *         <system-dueling-picklist-item value="z" label="LBL_VAL_Z""/>
 *     </system-dueling-picklist
 *
 *  the value expected and returned is a comma separated string with selected values
 *
 */
@Component({
    selector: "system-dueling-picklist",
    templateUrl: "../templates/systemduelingpicklist.html",
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemDuelingPicklist),
        multi: true
    }]
})
export class SystemDuelingPicklist implements ControlValueAccessor, AfterContentInit {
    @ContentChildren(SystemDuelingPicklistItem) public selectItemlist: QueryList<SystemDuelingPicklistItem>;

    /**
     * the input list to be displayed
     */
    @Input() public selectList: { id: string, label: string}[] = [];

    /**
     * holds the IDS selected in the left box
     */
    public selectedleft: string[] = [];

    /**
     * holds the IDS selected in the right box
     */
    public selectedright: string[] = [];

    /**
     * holds the selected IDs
     */
    public selectedIDs: string[] = [];

    /**
     * label of the form element
     */
    @Input() public label: string = "";

    /**
     * holds the defined list height by slds style
     */
    @Input() public listHeight: '10' | '7' | '5' = '7';
    /**
     * holds the disabled boolean
     */
    @Input() public disabled: boolean = false;
    /**
     * holds the focused dom item data
     */
    public focusedItemId: string;
    /**
     * change emitter by ngModel
     * @private
     */
    public onChange: (value: any) => void;

    constructor(public elementRef: ElementRef,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2) {
    }

    public ngAfterContentInit() {
        this.selectItemlist.forEach(i => this.selectList.push({id: i.id, label: i.label}));
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        return;
    }

    /**
     * Write a new value to the element.
     * @param value
     */
    public writeValue(value: any) {
        if (!value) return;
        this.selectedIDs = value.split(',');
    }

    get availableItems(){
        return this.selectItemlist.filter(i => this.selectedIDs.indexOf(i.id) < 0);
    }

    get selectedItems(){
        return this.selectItemlist.filter(i => this.selectedIDs.indexOf(i.id) >= 0);
    }

    public selectItem(id, side){
        let index = this['selected'+side].indexOf(id);
        if(index >= 0){
            this['selected'+side].splice(index, 1);
        } else {
            this['selected'+side].push(id);
        }
    }

    /**
     * for the drop of the field
     *
     * @param event
     */
    public onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }

    public isSelected(id, side){
        return this['selected'+side].indexOf(id) >= 0;
    }

    public addItems(){
        this.selectedleft.forEach(i => this.selectedIDs.push(i));
        this.selectedleft = [];

        this.onChange(this.selectedIDs.join(','));
    }

    public removeItems(){
        this.selectedright.forEach(i => this.selectedIDs.splice(this.selectedIDs.indexOf(i), 1));
        this.selectedright = [];

        this.onChange(this.selectedIDs.join(','));
    }

}
