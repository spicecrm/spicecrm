import {
    Component,
    ElementRef,
    HostListener,
    EventEmitter,
    Output,
    Renderer
} from '@angular/core';
import {toast} from '../../services/toast.service';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import { ActivationStart, Router } from '@angular/router';


@Component({
    selector: 'global-header',
    templateUrl: './app/globalcomponents/templates/globalheader.html',
    providers: []
})
export class GlobalHeader {
    constructor(private session: session, private router: Router, private toast: toast ) {

        this.router.events.subscribe((val:any) => {
            if ( val instanceof ActivationStart ) {
                if ( val.snapshot.params.module === 'Users' && val.snapshot.params.id ) {
                    if ( !this.session.authData.admin && val.snapshot.params.id != this.session.authData.userId ) {
                    this.toast.sendToast('You are not allowed to view or edit foreign user data.','warning', null, 3 );
                    this.router.navigate(['/module/Users']);
                }
            }}
        });

    }
}

