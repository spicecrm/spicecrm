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
 * @module SystemComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {configurationService} from "../../services/configuration.service";
import {session} from "../../services/session.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {helper} from "../../services/helper.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {backend} from "../../services/backend.service";
import {BehaviorSubject} from "rxjs";

/** @ignore */
declare var _;

/**
 * render a html input file and handle a model file data binding
 */
@Component({
    selector: 'system-input-file',
    templateUrl: './src/systemcomponents/templates/systeminputfile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemInputFile),
        multi: true
    }]
})
export class SystemInputFile implements ControlValueAccessor {
    /**
     * holds a view container reference for the input file
     * @private
     */
    @ViewChild('inputFile', {read: ViewContainerRef, static: false}) private inputFile: ViewContainerRef;
    /**
     * holds the field name of the file from parent
     * @private
     */
    @Input() private fieldName: string;
    /**
     * holds the disabled boolean from parent
     * @private
     */
    @Input() private accept: string = '*';
    /**
     * holds the disabled boolean from parent
     * @private
     */
    @Input() private disabled: boolean = false;
    /**
     * holds the disabled boolean from parent
     * @private
     */
    @Output() private onRemove = new EventEmitter();
    /**
     * holds the uploading boolean
     * @private
     */
    private isUploading: boolean = false;
    /**
     * holds the uploading boolean
     * @private
     */
    private elementID: string = _.uniqueId('input-file');
    /**
     * ControlValueAccessor change emitter
     * @private
     */
    private onChange: (value: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string, remove: () => void}) => void;
    /**
     * ControlValueAccessor touched emitter
     * @private
     */
    private onTouched: () => void;
    /**
     * holds the file progress value
     * @private
     */
    private fileProgress: number = 0;
    /**
     * holds the file value
     * @private
     */
    private file: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string };

    constructor(private configurationService: configurationService,
                private session: session,
                private toast: toast,
                private helper: helper,
                private model: model,
                private backend: backend,
                private modal: modal,
                private cdRef: ChangeDetectorRef,
                private language: language) {
    }

    /**
     * ControlValueAccessor Interface
     */
    public registerOnChange(fn: any): void {
        this.onChange = (val) => {
            fn(val);
        };
    }

    /**
     * ControlValueAccessor Interface
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * ControlValueAccessor write value from parent
     */
    public writeValue(value: any): void {
        this.file = value;
    }

    /**
     * uploads the attachment to the server
     *
     * @param files
     */
    public async uploadFile(files) {

        if (files.length == 0) return;

        this.isUploading = true;
        this.cdRef.detectChanges();

        this.file = {
            file_name: files[0].name,
            file_mime_type: files[0].type,
            file_size: this.helper.humanFileSize(files[0].size)
        };

        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        if (maxSize && files[0].size > maxSize) {
            this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [this.file.file_name, this.helper.humanFileSize(maxSize)]), 'error');
            return;
        }

        let progressSubscription = new BehaviorSubject<number>(0);
        progressSubscription.subscribe(value => {
            this.fileProgress = Math.floor(value);
            this.cdRef.detectChanges();
        });

        const fileContent = await this.readFileAsync(files[0]);

        const fileBody = {
            file: fileContent.substring(fileContent.indexOf('base64,') + 7),
            file_name: this.file.file_name,
            file_mime_type: this.file.file_mime_type
        };

        this.backend.postRequestWithProgress('bean/file/upload', null, fileBody, progressSubscription)
            .subscribe(res => {
                this.file.file_md5 = res.file_md5;
                this.onChange({
                    ...this.file,
                    remove: () => this.removeFile(true)
                });
                this.isUploading = false;
                this.cdRef.detectChanges();
            });

    }

    /**
     * read file async and return promise
     * @param file
     */
    private async readFileAsync(file): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.toString());
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * remove file and emit the action to parent
     * @private
     */
    public removeFile(silent?) {
        this.file = undefined;
        this.cdRef.detectChanges();
        if (silent) return;
        this.onRemove.emit();
    }
}
