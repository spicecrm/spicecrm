import {Component, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {broadcast} from '../../../services/broadcast.service';
import {session} from '../../../services/session.service';

@Component({
    templateUrl: './src/modules/deployment/templates/deploymentcractive.html',
    host: {
        '[style.display]': 'getDisplay()'
    },
})
export class DeploymentCRActive implements OnDestroy{

    activeID = '';
    activeName = '';
    broadcastsubscription: any = null;

    constructor(private language: language, private backend: backend, private broadcast: broadcast, private session: session, private router: Router) {
        this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
            this.activeID = crresponse.id;
            this.activeName = crresponse.name;
        })

        // listen to the briacaset
        this.broadcastsubscription = this.broadcast.message$.subscribe(message => {
            if (message.messagedata.module !== 'SystemDeploymentCRs')
                return;

            switch (message.messagetype) {
                case 'cr.setactive':
                    this.activeID = message.messagedata.id;
                    this.activeName = message.messagedata.name;
                    break;

            }
        })
    }

    get crName(){
        return this.activeName != '' ? this.activeName : '-none-';
    }

    get isAdmin(){
        return this.session.isAdmin;
    }

    ngOnDestroy(){
        this.broadcastsubscription.unsubscribe();
    }


    getDisplay() {

        return this.isAdmin ? 'inherit' : 'none';
    }

    goCR(){
        this.router.navigate(['/module/SystemDeploymentCRs' + (this.activeID ? '/' + this.activeID : '')]);
    }
}