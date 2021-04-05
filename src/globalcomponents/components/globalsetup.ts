/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {Router} from '@angular/router';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Component({
    selector: 'global-setup',
    templateUrl: './src/globalcomponents/templates/globalsetup.html'
})
export class GlobalSetup {
    // systemid: string = '000';
    // systemname: string = '';
    // systemurl: string = '';
    // systemproxy: number = 1;
    // systemdevmode: number = 0;
    // systemloginprogressbar: number = 1;
    // systemallowforgotpass: number = 0;
    //
    // checking: boolean = false;
    //
    // constructor(
    //     private toast: toast,
    //     private http: HttpClient,
    //     private router: Router,
    //     private configurationService: configurationService,
    // ) {
    //
    // }
    //
    //
    // get saveEnabled(){
    //     return this.systemname != '' && this.systemurl != '' && !this.checking;
    // }
    //
    // testConnection(){
    //     this.checking = true;
    //     this.http.get('config/check', {params: {url: btoa(this.systemurl)} }).subscribe(
    //         (res : any) => {
    //             var response = res;
    //             if(response.success != true){
    //                 this.toast.sendToast(response.message, 'error');
    //                 this.checking = false;
    //             } else {
    //                 this.saveConnection()
    //             }
    //         },
    //         (err: any) => {
    //             switch (err.status) {
    //                 case 401:
    //
    //                     break;
    //             }
    //         });
    // }
    //
    // saveConnection(){
    //     this.checking = true;
    //
    //     let body = {
    //         id: this.systemid,
    //         display: this.systemname,
    //         backendUrl: this.systemurl,
    //         proxy: this.systemproxy,
    //         developerMode: this.systemdevmode,
    //         loginProgressBar: this.systemloginprogressbar,
    //         allowForgotPass: this.systemloginprogressbar
    //     }
    //
    //     this.http.post('config/set', body, {}).subscribe(
    //         (res : any) => {
    //             var response = res;
    //             if(response.success == true){
    //                 this.configurationService.setSiteData(response.site);
    //                 this.router.navigate(['/login']);
    //             } else {
    //                 this.checking = false;
    //             }
    //         },
    //         (err: any) => {
    //             switch (err.status) {
    //                 case 401:
    //
    //                     break;
    //             }
    //         });
    // }
}
