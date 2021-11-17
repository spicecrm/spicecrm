/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/admincomponents/templates/administrationblockedusers.html'
})
export class AdministrationBlockedUsers implements OnInit {

    private blockedUsers = [];

    /**
     * inidcates that we are loading
     * @private
     */
    private isLoading = false;
    private isUnblocking = {};

    constructor( private backend: backend, private modal: modal, private toast: toast, private metadata: metadata ) { }

    public ngOnInit() {
        this.loadBlockedUsers();
    }

    private loadBlockedUsers() {
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

    private unBlockUser( userId, username ) {
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
