/**
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output, SimpleChanges
} from '@angular/core';

/**
 * an icon rendered from the utility sprite
 */
@Component({
    selector: 'system-utility-icon',
    templateUrl: '../templates/systemutilityicon.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemUtilityIcon implements OnChanges{
    /**
     * the name of the icon to be rendered
     *
     * - it can be a simple name of an icon .. then it is rendered as a utility icon
     * - it can be a string sepoarated with the sprite and the icon. e.g. 'standard:decision' then the sprite is taken form the icon
     *  - it can hold sprite, icon and size override. e.g. 'standard:decision:medium'
     *
     */
    @Input() public icon: string = '';

    /**
     * the size of the icon
     */
    @Input() public size: 'large' | 'small' | 'x-small' | 'xx-small' = 'small';

    /**
     * a string of classes that can be passed in and is added to the SVG
     */
    @Input() public addclasses: string = '';

    /**
     * an optional color class: can be any of the avialable SLDS icon color classes
     */
    @Input() public colorclass: 'slds-icon-text-default'|'slds-icon-text-success'|'slds-icon-text-warning'|'slds-icon-text-error'|'slds-icon-text-light' = 'slds-icon-text-default';

    /**
     * a string for the title that is rendered as part of the SVG HTML element
     */
    @Input() public title: string = '';

    /**
     * emits the click event
     */
    @Output() public click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

    constructor(public cdref: ChangeDetectorRef) {

    }


    /**
     * run detect changes in teh onCHnage Lifecycle event
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.cdref.detectChanges();
    }

    /**
     * returns the SVG href
     */
    public getSvgHRef() {
        return './vendor/sldassets/icons/' + this._sprite + '-sprite/svg/symbols.svg#' + this._icon;
    }

    /**
     * retuns the icon class for the ngClass in the template
     */
    public getIconClass() {
        return 'slds-icon slds-icon_container  slds-icon--' + this._size + ' ' + this.colorclass + ' ' + this.addclasses;
    }

    /**
     * handles the icon .. if there is a ':' in the icon name the first part is the sprite .. the second is the icon
     */
    get _icon() {
        if (this.icon && this.icon.indexOf(':') > 0) {
            return this.icon.split(':')[1];
        } else {
            return this.icon;
        }
    }

    /**
     * handles the sprite .. if there is a ':' in the icon name the first part is the sprite .. default is utility
     */
    get _sprite() {
        if (this.icon && this.icon.indexOf(':') > 0) {
            return this.icon.split(':')[0];
        } else {
            return 'utility';
        }
    }

    /**
     * handles the sprite .. if there is a ':' in the icon name the first part is the sprite .. default is utility
     */
    get _size() {
        if (this.icon && this.icon.indexOf(':') > 0 && this.icon.split(':').length > 2) {
            return this.icon.split(':')[2];
        }

        return this.size ? this.size : 'small';

    }
}
