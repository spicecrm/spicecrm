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
 * render a html input file and allows the user to drop content. the content is passed to the frontend to take the proper action.
 * the change can be persistet - otherwiese after the upload the file is resert and a new file can be uploaded
 * also the format that the content shoudl be reutrned can be defined as either text or base64 encoded
 *
 */
@Component({
    selector: 'system-input-file-content',
    templateUrl: '../templates/systeminputfilecontent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemInputFileContent),
        multi: true
    }]
})
export class SystemInputFileContent implements ControlValueAccessor {
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
     * determines the used encoding for the returned content
     */
    @Input() public contenttype: 'base64'|'text' = 'base64';

    /**
     * set to persistent if the file should be stroed .. otherwise the filename is removed after the upload
     */
    @Input() public persistens: boolean = false;

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
    public onChange: (value) => void;
    /**
     * ControlValueAccessor touched emitter
     * @private
     */
    public onTouched: () => void;

    /**
     * holds the file value
     * @private
     */
    public file: { file_name: string, file_mime_type: string, file_md5?: string, file_size?: string };

    constructor(public configurationService: configurationService,
                public session: session,
                public toast: toast,
                public helper: helper,
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


        const fileContent = await this.readFileAsync(files[0]);

        /**
         * emit the content
         */
        this.onChange(fileContent);

        // if we do not persist the file remove it again
        if(!this.persistens){
            this.file = undefined;
            this.cdRef.detectChanges();
        }

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
            switch(this.contenttype) {
                case 'text':
                    reader.readAsText(file);
                    break;
                default:
                    reader.readAsDataURL(file);
                    break;
            }
        });
    }

    /**
     * remove file and emit the action to parent
     * @private
     */
    public removeFile() {
        this.file = undefined;
        this.cdRef.detectChanges();
        this.onChange(null);
    }
}
