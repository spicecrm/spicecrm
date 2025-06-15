import {AfterViewInit, Component, ComponentRef} from '@angular/core';
import {Router} from "@angular/router";
import {ComponentSetItemI} from "../interfaces/objectcomponents.interfaces";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: 'object-route-redirect',
    template: '',
    standalone: false
})
export class ObjectRouteRedirect implements AfterViewInit, ComponentSetItemI {

    public self: ComponentRef<this>;

    /**
     * holds the config route for the navigation
     */
    public componentconfig: { route: string };

    constructor(private router: Router,
                private metadata: metadata) {
    }

    /**
     * redirect to the route after initializing the component view
     */
    public ngAfterViewInit() {

        if (!this.componentconfig?.route) {
            this.componentconfig = this.metadata.getComponentConfig('ObjectRouteRedirect');
        }

        if (!!this.componentconfig?.route) {
            this.router.navigate([this.componentconfig.route]);
        } else {
            this.self.destroy();
        }
    }
}