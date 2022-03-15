/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'style-cache-cleaner',
    templateUrl: '../templates/stylecachecleaner.html',
})
export class StyleCacheCleaner {
    public is_loading = false;

    constructor(
        public backend: backend,
        public toast: toast,
        public language: language
    ) {}


    /**
     * Send a request to delete the following cache-file \vendor\dompdf\dompdf\lib\fonts\dompdf_font_family_cache.php
     */
    public cleanCache() {
        this.is_loading = true;
        this.backend.getRequest(`admin/cleanup/stylecache`).subscribe(
            res => {
                if(res) {
                    this.toast.sendToast(this.language.getLabel("LBL_CACHE_FILE_DELETED"), "success");
                } else {
                    this.toast.sendToast(this.language.getLabel("LBL_CACHE_FILE_NOT_FOUND"), "info");
                }
                this.is_loading = false;
            }
        );
    }
}
