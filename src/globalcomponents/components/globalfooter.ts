/**
 * @module GlobalComponents
 */
import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {session} from '../../services/session.service';
import {footer} from '../../services/footer.service';
import {modal} from '../../services/modal.service';
import {broadcast} from "../../services/broadcast.service";
import {metadata} from "../../services/metadata.service";

/* @ignore */
declare var _;

@Component({
    selector: 'global-footer',
    templateUrl: '../templates/globalfooter.html'
})
export class GlobalFooter implements OnInit, AfterViewInit {

    @ViewChild('footercontainer', {read: ViewContainerRef, static: true}) public footercontainer: ViewContainerRef;
    @ViewChild('modalcontainer', {read: ViewContainerRef, static: true}) public modalcontainer: ViewContainerRef;
    @ViewChild('modalbackdrop', {read: ViewContainerRef, static: true}) public modalbackdrop: ViewContainerRef;
    @ViewChild('hiddenContainer', {read: ViewContainerRef, static: true}) public hiddenContainer: ViewContainerRef;
    /**
     * reference to the loaded hidden components
     * @private
     */
    private loadedComponents: { component: string, componentconfig: string }[] = [];

    constructor(public session: session,
                public footer: footer,
                public modalservice: modal,
                private metadata: metadata,
                private broadcast: broadcast) {
    }

    /**
     * subscribe to loader changes
     */
    public ngOnInit() {
        this.subscribeToLoader();
    }

    /**
     * load component set components in the footer container
     * @param id
     */
    public loadCustomComponentset(id: string) {

        const items = this.metadata.getComponentSetObjects(id);

        items.forEach(item => {

            if (this.loadedComponents.some(loadedItem => loadedItem.component == item.component && _.isEqual(loadedItem.componentconfig, item.componentconfig))) return;

            this.metadata.addComponent(item.component, this.hiddenContainer).subscribe(ref => {
                ref.instance.componentconfig = item.componentconfig;
                this.loadedComponents.push(item);
            });
        });
    }

    public ngAfterViewInit() {
        this.footer.footercontainer = this.footercontainer;
        this.footer.modalcontainer = this.modalcontainer;
        this.footer.modalbackdrop = this.modalbackdrop;
    }

    /**
     * subscribe to loader complete to load the custom componentset
     * @private
     */
    private subscribeToLoader() {

        this.broadcast.message$.subscribe(msg => {

            if (msg.messagetype != 'loader.primarycompleted') return;

            const config = this.metadata.getComponentConfig('GlobalFooter');

            if (!config?.componentset) {
                return;
            }

            this.loadCustomComponentset(config.componentset);
        });
    }
}
