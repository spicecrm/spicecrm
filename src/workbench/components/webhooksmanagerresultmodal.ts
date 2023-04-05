/**
 * @module WorkbenchModule
 */
import {

    Component, ComponentRef, Input, OnInit
} from '@angular/core';
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {metadata} from "../../services/metadata.service";
import {modelutilities} from "../../services/modelutilities.service";
import {WebHookI} from "../interfaces/systemui.interfaces";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";

@Component({
    selector: 'web-hooks-manager-result-modal',
    templateUrl: '../templates/webhooksmanagerresultmodal.html',

})
export class WebHooksManagerResultModal{

    public self: ComponentRef<WebHooksManagerResultModal>;
    public data: any;
    @Input() public webhook: any;

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        public modelutilities: modelutilities,
        public toast: toast,
    ) {

    }


    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    public callWebHooks(webHook: WebHookI){
        this.backend.postRequest(`system/webhook`, null, webHook).subscribe((res: any) => {
            this.data = res.result;
            // loadingModal.emit(true);
        });
    }
}
