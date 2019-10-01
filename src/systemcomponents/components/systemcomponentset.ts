/**
 * @module SystemComponents
 */
import {Component, Input, AfterViewInit, ViewContainerRef, ViewChild, OnChanges} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'system-componentset',
    templateUrl: './src/systemcomponents/templates/systemcomponentset.html'
})
export class SystemComponentSet implements AfterViewInit, OnChanges {
    @ViewChild('componentcontainer', {read: ViewContainerRef, static: true}) private componentcontainer: ViewContainerRef;
    @Input() private componentset: string = '';
    @Input() private forceReloadOnChange: boolean = false;

    private viewInitialized: boolean = false;
    private _componentset: string = '';
    private _componentRefs: any[] = [];

    constructor(private metadata: metadata) {
    }

    public ngAfterViewInit() {
        // render the componentset
        this.renderComnponentset();

        // set the view to initialized
        this.viewInitialized = true;
    }

    public ngOnChanges() {
        if (this.viewInitialized && (this.componentset != this._componentset || this.forceReloadOnChange)) {
            // destroy all components if the componentset has changed
            for (let _componentRef of this._componentRefs) {
                _componentRef.destroy();
            }
            this._componentRefs = [];

            // render the componentset
            this.renderComnponentset();
        }
    }

    private renderComnponentset() {
        if (this.componentset) {
            for (let component of this.metadata.getComponentSetObjects(this.componentset)) {
                this.metadata.addComponent(component.component, this.componentcontainer).subscribe(componentRef => {
                    componentRef.instance.componentconfig = component.componentconfig;

                    // keep in the stack so we can destroy it when the set changes
                    this._componentRefs.push(componentRef);
                });
            }
        }

        // keep the componentset we have rendered in teh object so to onyl reredner on change
        this._componentset = this.componentset;
    }
}
