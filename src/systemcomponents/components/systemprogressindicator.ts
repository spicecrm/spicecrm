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
import {SystemProgressIndicatorItem} from "./systemprogressindicatoritem";


/**
 * renders a list of icons as select
 *
 * usage as follows with the system-select-icon-item for the items
 *
 *     <system-progress-indicator [(ngModel)]="myvalue">
 *         <system-progress-indicator value="x" label="LBL_STEP1"/>
 *         <system-progress-indicator value="y" label="LBL_STEP1"/>
 *     </system-progress-indicator>
 *
 */
@Component({
    selector: "system-progress-indicator",
    templateUrl: "../templates/systemprogressindicator.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemProgressIndicator),
        multi: true
    }]
})
export class SystemProgressIndicator implements ControlValueAccessor, AfterContentInit {
    /**
     * the selector list for the items
     */
    @ContentChildren(SystemProgressIndicatorItem) public progressItemlist: QueryList<SystemProgressIndicatorItem>;

    /**
     * to disable the checkbox
     */
    public _disabled = false;
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this._disabled = false;
        } else {
            this._disabled = true;
        }
    }

    /**
     * set to shaded
     */
    public _progressIndicatorShade = false;
    @Input('system-progress-indicator-shade') set progressIndicatorShade(value) {
        if (value === false) {
            this._progressIndicatorShade = false;
        } else {
            this._progressIndicatorShade = true;
        }
    }

    /**
     * the input list to be displayed
     */
    @Input() public itemList: { value: string, label: string, status: ''|'complete'|'error'}[] = [];

    /**
     * holds the input value
     */
    public _value: string = '';

    public toolTipValue: string = undefined;

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
        this.progressItemlist.forEach(i => this.itemList.push({value: i.value , label: i.label, status: i.status}));

        this._value = this.itemList[0].value;
    }

    get value(){
        return this._value
    }

    set value(newValue){
        if(!this._disabled) {
            this._value = newValue;
            this.onChange(newValue);
        }
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

    /**
     * checks if a step is completed
     *
     * @param value
     */
    public isCompleted(value){
        return value !== this.value &&  this.itemList.findIndex(i => i.value == value) < this.itemList.findIndex(i => i.value == this.value);
    }

    /**
     * checks if a step is complete
     *
     * @param value
     */
    public isComplete(value){
        return this.progressItemlist.find(f => f.value == value).status == 'complete';
    }

    /**
     * checks if a step is complete
     *
     * @param value
     */
    public hasError(value){
        return this.progressItemlist.find(f => f.value == value).status == 'error';
    }

    /**
     * gets the style for the progressbar embedded
     */
    get progressBarStyle(){
        let itemIndex = this.itemList.findIndex(i => i.value == this.value);
        return {
            width: itemIndex ? Math.round((itemIndex / (this.itemList.length - 1)) * 100) + '%' : '0%'
        }
    }

    public showToolTip(value){
        this.toolTipValue = value;
    }

    public hideToolTip(){
        this.toolTipValue = undefined;
    }

    get toolTipStyle(){
        let itemIndex = this.itemList.findIndex(i => i.value == this.toolTipValue);
        let left = itemIndex ? Math.round((itemIndex / (this.itemList.length - 1)) * 100) + '%' : '0%';
        return {
            position:'absolute',
            left: `calc(${left} + 6px)`,
            bottom: '30px',
            transform:'translateX(-50%)'
        }
    }

    get toolTipLabel(){
        return this.toolTipValue ? this.itemList.find(i => i.value == this.toolTipValue).label : '';
    }
}
