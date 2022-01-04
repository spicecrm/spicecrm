/**
 * @module GlobalComponents
 */
import {Component, ViewChild, ViewContainerRef, Renderer2, ElementRef} from '@angular/core';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-header-actions',
    templateUrl: '../templates/globalheaderactions.html'
})
export class GlobalHeaderActions  {

    @ViewChild('actioncontainerheader', {
        read: ViewContainerRef,
        static: true
    })public actioncontainerheader: ViewContainerRef;

    /**
     * the open boolean indicator
     *
     * @private
     */
   public isOpen: boolean = false;

   public clickListener: any;

    /**
     * indicates that the add is visible
     * requires that we can ate last add one of the modules
     *
     * @private
     */
   public isVisible: boolean = false;

    /**
     * holds if we are initialized
     *
     * @private
     */
    private isInitialized: boolean = false;

    constructor(public renderer: Renderer2,public elementRef: ElementRef,public session: session,public metadata: metadata,public language: language) {

    }

    /**
     * initializte the component and load all elements
     */
    public initialize() {
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderActions');
        if (componentconfig && componentconfig.actionset) {
            let actionsetitems = this.metadata.getActionSetItems(componentconfig.actionset);
            for (let actionsetitem of actionsetitems) {
                // check if we have a module and if we can add
                if (actionsetitem.actionconfig?.module) {
                    if (!this.metadata.checkModuleAcl(actionsetitem.actionconfig?.module, 'create')) {
                        continue;
                    }
                }

                // set to visible if we at least found one item
                this.isVisible = true;

                this.metadata.addComponent(actionsetitem.component, this.actioncontainerheader).subscribe((componentRef) => {
                    componentRef.instance.actionconfig = actionsetitem.actionconfig;
                    if (componentRef.instance.closemenu) {
                        componentRef.instance.closemenu.subscribe((close) => {
                            this.isOpen = false;
                        });
                    }
                });
            }
        }
        this.isInitialized = true;
    }

    /**
     * toggle the open space
     *
     * @private
     */
    public toggleOpen() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            if(!this.isInitialized) this.initialize();

            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * clock event handler
     *
     * @param event
     * @private
     */
    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }
}
