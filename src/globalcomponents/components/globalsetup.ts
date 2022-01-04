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
    templateUrl: '../templates/globalsetup.html'
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
    //    public toast: toast,
    //    public http: HttpClient,
    //    public router: Router,
    //    public configurationService: configurationService,
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
