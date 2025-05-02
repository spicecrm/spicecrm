/**
 * @module WorkbenchModule
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * a modal to dsiplay an API Log entry record
 */
@Component({
    templateUrl: '../templates/apilogviewerreplayitem.html',
    selector: "[apilogviewer-replay-item]"
})
export class APIlogViewerReplayItem {

    @Input() public objekt: any;
    @Input() public key: any;
    @Input() public editMode = false;
    @Input() public isLast = false;

    public valueType: string;
    public originalBoolean = false;

    constructor() {}

    ngOnInit() {
        this.valueType = this.getType( this.objekt[this.key]);
        this.originalBoolean = this.valueType === 'boolean';
    }

    public getType( value ): string
    {
        if ( value === null ) return 'null';
        if ( typeof value === 'object' && Array.isArray(value)) return 'array';
        return typeof value;
    }

    public changeType( type: string )
    {
        if ( type === 'string' ) this.objekt[this.key] = '' + this.objekt[this.key];
        if ( type === 'number' ) this.objekt[this.key] = parseFloat( this.objekt[this.key] );
        if ( type === 'null' ) this.objekt[this.key] = null;
        if ( type === 'boolean' ) this.objekt[this.key] = false;
        this.valueType = type;
    }

    public dummy( x: number, y )
    {
        return 'asdf';
    }
}
