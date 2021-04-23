/**
 * @module ModuleSAPIDOCs
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {modellist} from "../../../services/modellist.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'sapidocs-monitor',
    templateUrl: './src/modules/sapidocs/templates/sapidocsmonitor.html',
    providers: [modellist, model]
})
export class SAPIDOCsMonitor {

    /**
     * an elament ref to the container to render the compoonentsets
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * holds references to the rendered components. if rerendering they need to be destoryed when the route changes
     */
    private componentRefs: any = [];

    /**
     * true if the angular view has been initialized
     * @private
     */
    private viewInitialized: boolean = false;

    /**
     * the subscription to the list view changes since the component is rendered here
     */
    private modellistSubscription: any;

    constructor(private language: language, private metadata: metadata, private navigationtab: navigationtab, private modellist: modellist, private model: model) {
        this.initialize();
    }

    /**
     * set the tab info
     * initialize the model list service
     */
    private initialize() {
        // set the tab info
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_SAP_IDOCS_MONITOR'), displayicon: 'settings'});

        this.model.module = 'SAPIdocs';

        // set the module and get the list
        this.modellist.initialize(this.model.module);

        this.modellistSubscription = this.modellist.listTypeComponent$.subscribe(() =>
            this.handleListTypeChange()
        );
    }

    /**
     * set the component name build the container if the view is initialized
     * @private
     */
    private handleListTypeChange() {
        if (!this.viewInitialized) return;
        this.buildContainer();
    }

    /**
     * register the listener to the modellist service to
     */
    public ngAfterViewInit() {
        this.viewInitialized = true;
        this.buildContainer();
    }

    /**
     * unsubscribe from the modellist service so this can b e closed and cleaned up properly
     */
    public ngOnDestroy(): void {
        this.modellistSubscription.unsubscribe();
    }

    /**
     * renders a compoentnset in the container
     *
     */
    private buildContainer() {
        if (!this.modellist.currentList.listcomponent) {
            return;
        }
        // clean the existing rendered components
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // render the new component
        this.metadata.addComponent(this.modellist.currentList.listcomponent, this.container).subscribe(componentRef => {
            this.componentRefs.push(componentRef);
        });
    }
}

