/**
 * @module SystemComponents
 */
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ContentChildren,
    ElementRef,
    forwardRef,
    Input, QueryList,
    Renderer2
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SystemSelectIconItem} from "./systemselecticonitem";


/**
 * renders a list of icons as select
 *
 * usage as follows with the system-select-icon-item for the items
 *
 *     <system-select-icon [(ngModel)]="myvalue">
 *         <system-select-icon-item></system-select-icon-item>
 *         <system-select-icon-item value="x" icon="light_bulb" colorclass="slds-icon-text-warning"></system-select-icon-item>
 *         <system-select-icon-item value="y" icon="light_bulb" colorclass="slds-icon-text-success"></system-select-icon-item>
 *         <system-select-icon-item value="z" icon="light_bulb" colorclass="slds-icon-text-light"></system-select-icon-item>
 *     </system-select-icon>
 *
 */
@Component({
    selector: "system-select-icon",
    templateUrl: "../templates/systemselecticon.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemSelectIcon),
        multi: true
    }]
})
export class SystemSelectIcon implements ControlValueAccessor, AfterContentInit {
    @ContentChildren(SystemSelectIconItem) public selectItemlist: QueryList<SystemSelectIconItem>;


    /**
     * the input list to be displayed
     */
    @Input() public selectList: { value: string, icon: string, colorclass?: 'slds-icon-text-default'|'slds-icon-text-success'|'slds-icon-text-warning'|'slds-icon-text-error'|'slds-icon-text-light'}[] = [];
    /**
     * label of the form element
     */
    @Input() public label: string = "";
    /**
     * holds the input value
     */
    public value: string = '';

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
    public onChange: (value: string) => void;

    constructor(public elementRef: ElementRef,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2) {
    }

    public ngAfterContentInit() {
        this.selectItemlist.forEach(i => this.selectList.push({value: i.value ?? '', icon: i.icon, colorclass: i.colorclass}));
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
    public writeValue(value: string) {
        if (!value) return;
        this.value = value;
        this.cdRef.detectChanges();
    }

    get selectedItem(){
        let item = this.selectItemlist.find(s => s.value == this.value);
        return item ?? undefined;
    }

    /**
     * handle result list item click
     * @param item
     * @param event
     * @private
     */
    public itemClicked(value, event) {
        this.value = value;
        this.onChange(value);
    }
}
