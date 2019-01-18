import {
    Component,
    ElementRef,
    HostListener,
    EventEmitter,
    Output,
    Renderer, ViewChildren, QueryList, ViewChild, ViewContainerRef, DoCheck
} from '@angular/core';
import {toast} from '../../services/toast.service';
import {session} from '../../services/session.service';
import {layout} from '../../services/layout.service';
import {ActivationStart, Router} from '@angular/router';
import {ObjectActionContainerItem} from "../../objectcomponents/components/objectactioncontaineritem";


@Component({
    selector: 'global-header',
    templateUrl: './src/globalcomponents/templates/globalheader.html',
    providers: []
})
export class GlobalHeader implements DoCheck {

    @ViewChild('header', {read: ViewContainerRef}) private header: ViewContainerRef;

    constructor(private session: session, private router: Router, private toast: toast, private elementRef: ElementRef, private layout: layout) {

        this.router.events.subscribe((val: any) => {
            if (val instanceof ActivationStart) {
                if (val.snapshot.params.module === 'Users' && val.snapshot.params.id) {
                    if (!this.session.authData.admin && val.snapshot.params.id != this.session.authData.userId) {
                        this.toast.sendToast('You are not allowed to view or edit foreign user data.', 'warning', null, 3);
                        this.router.navigate(['/module/Users']);
                    }
                }
            }
        });

    }

    public ngDoCheck(): void {
        if (this.header) {
            this.layout.headerheight = this.header.element.nativeElement.getBoundingClientRect().height;
        } else {
            this.layout.headerheight = 0;
        }
    }

    get issmall() {
        return this.layout.screenwidth == 'small';
    }
}

