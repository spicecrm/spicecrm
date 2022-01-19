/**
 * @module ModuleReportsDesigner
 */
import {AfterViewInit, Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reports-designer-visualize-item',
    templateUrl: '../templates/reportsdesignervisualizeitem.html'
})
export class ReportsDesignerVisualizeItem implements AfterViewInit {

    /**
     * @input component: string
     */
    @Input() public component: string = '';
    @ViewChild('itemContainer', {static: true, read: ViewContainerRef}) public itemContainer: ViewContainerRef;
    public componentRef: any;

    constructor(public language: language, public metadata: metadata) {
    }

    /**
     * call render view
     */
    public ngAfterViewInit() {
        this.render();
    }

    /**
     * destroy component reference
     */
    public ngOnDestroy() {
        if (this.componentRef) this.componentRef.destroy();
    }

    /**
     * render the component in the container
     */
    public render() {
        this.metadata.addComponent(this.component, this.itemContainer)
            .subscribe(componentRef => this.componentRef = componentRef);
    }
}
