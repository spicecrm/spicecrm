/**
 * @module SystemComponents
 */
import {Component, Input, OnChanges} from '@angular/core';
import {metadata} from '../../services/metadata.service';

/**
 * renders a dynamic componentset
 */
@Component({
    selector: 'system-componentset',
    templateUrl: '../templates/systemcomponentset.html'
})
export class SystemComponentSet implements OnChanges {
    /**
     * the componentset
     */
    @Input() public componentset: string = '';

    /**
     * the rendered componentset
     */
    public _componentset: string = '';

    /**
     * the array with the list of components to be rendered
     */
    public components: any[] = [];

    constructor(public metadata: metadata) {
    }

    /**
     *
     */
    public ngOnChanges() {
        this.renderComnponentset();
    }

    /**
     * redetermins the compponetes and rerenders the componentset
     */
    public renderComnponentset() {
        if (this.componentset != this._componentset) {
            if (this.componentset) {
                this.components = this.metadata.getComponentSetObjects(this.componentset);
            } else {
                this.components = [];
            }

            // keep the componentset we have rendered in teh object so to onyl reredner on change
            this._componentset = this.componentset;
        }
    }
}
