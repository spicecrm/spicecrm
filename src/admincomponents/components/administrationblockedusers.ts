/**
 * @module AdminComponentsModule
 */
import { Component, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { modal } from '../../services/modal.service';
import { toast } from '../../services/toast.service';
import { take } from 'rxjs/operators';
import { metadata } from '../../services/metadata.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'administration-blocked-users',
    templateUrl: '../templates/administrationblockedusers.html'
})
export class AdministrationBlockedUsers implements OnInit {

    public blockedUsers = [];

    /**
     * inidcates that we are loading
     * @private
     */
    public isLoading = false;
    public isUnblocking = {};

    constructor( public backend: backend, public modal: modal, public toast: toast, public metadata: metadata ) { }

    public ngOnInit() {
        this.loadBlockedUsers();
    }

    public loadBlockedUsers() {
        this.isLoading = true;
        let conf = this.metadata.getComponentConfig('LoginRestriction');
        let modulefilter = conf && conf.modulefilter ? conf.modulefilter : {};
        const params = {
            modulefilter: '7cf2fab0-b845-5a96-6045-2cef7c7f91d9',
            limit: -99,
            source: 'db',
            fields: ['id', 'user_name', 'login_blocked', 'login_blocked_until']
        };
        const sortArray = [{
            sortfield: 'user_name',
            sortdirection: 'ASC'
        }];
        this.backend.getList('Users', sortArray, params)
            .pipe(take(1))
            .subscribe((response: any) => {
                this.blockedUsers = response.list;
                this.blockedUsers = this.blockedUsers.sort( (a,b) => {
                    return a.user_name.localeCompare(b.user_name);
                });
                this.isLoading = false;
            });
    }

    public unBlockUser( userId, username ) {
        this.isUnblocking[userId] = true;
        this.backend.postRequest('module/Users/'+userId, null, { login_blocked: '0', login_blocked_until: '' })
            .pipe(take(1))
            .subscribe(data => {
                this.isUnblocking[userId] = false;
                if ( data.login_blocked === '0' && data.login_blocked_until === '' ) {
                    this.toast.sendToast('User '+data.user_name+' successfully un-blocked.', 'success', null );
                    this.blockedUsers.some( (user,index) => {
                        if ( user.id === userId ) {
                            this.blockedUsers.splice(index,1);
                            return true;
                        }
                    });
                }
            },
                error => {
                    this.isUnblocking[userId] = false;
                    this.toast.sendToast('Error un-blocking User '+username+'.', 'error', error.error.error.message );
                });
    }

}
