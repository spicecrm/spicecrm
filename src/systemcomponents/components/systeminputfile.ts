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
    templateUrl: '../templates/systeminputfile.html',
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
    @ViewChild('inputFile', {read: ViewContainerRef, static: false}) public inputFile: ViewContainerRef;
    /**
     * holds the field name of the file from parent
     * @private
     */
    @Input() public fieldName: string;
    /**
     * holds the disabled boolean from parent
     * @private
     */
    @Input() public accept: string = '*';
    /**
     * holds the disabled boolean from parent
     * @private
     */
    @Input() public disabled: boolean = false;
    /**
     * holds the error status from parent
     * @private
     */
    @Input() public hasError = false;
    /**
     * holds the disabled boolean from parent
     * @private
     */
    @Output() public onRemove = new EventEmitter();
    /**
     * holds the uploading boolean
     * @private
     */
    public isUploading: boolean = false;
    /**
     * holds the uploading boolean
     * @private
     */
    public elementID: string = _.uniqueId('input-file');
    /**
     * ControlValueAccessor change emitter
     * @private
     */
    public onChange: (value: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string, remove: () => void}) => void;
    /**
     * ControlValueAccessor touched emitter
     * @private
     */
    public onTouched: () => void;
    /**
     * holds the file progress value
     * @private
     */
    public fileProgress: number = 0;
    /**
     * holds the file value
     * @private
     */
    public file: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string };

    constructor(public configurationService: configurationService,
                public session: session,
                public toast: toast,
                public helper: helper,
                public model: model,
                public backend: backend,
                public modal: modal,
                public cdRef: ChangeDetectorRef,
                public language: language) {
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
            filename: this.file.file_name,
            filemimetype: this.file.file_mime_type
        };

        this.backend.postRequestWithProgress('common/spiceattachments', null, fileBody, progressSubscription)
            .subscribe(res => {
                this.file.file_md5 = res[0].filemd5;
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
    public async readFileAsync(file): Promise<any> {
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
