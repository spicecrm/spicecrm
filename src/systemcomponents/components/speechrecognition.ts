/**
 * @module SystemComponents
 */
import {Component, OnInit, ChangeDetectorRef, ApplicationRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from '../../services/toast.service';

declare var window: any;

@Component({
    templateUrl: '../templates/speechrecognition.html'
})
export class SpeechRecognition implements OnInit {

    public self;

    public recognition: any;
    public start_timestamp: any;

    public textfield: any;
    public part1fromField: string;
    public part2fromField: string;

    public theText = '';
    public theTextNewest = '';

    public theTextHtml = '';

    public dirty = false;

    public errorOccurred = false;

    public toRestart = false;
    public recognizing = false;
    public cancelling = false;
    public stopping = false;
    public pausing = false;
    public working = false;

    public languages = [{id: 'de_DE', name: 'Deutsch'}, {id: 'en_US', name: 'English'}];
    public selectedLanguage = 0;

    constructor(public language: language, public metadata: metadata, public toast: toast, public changeDetRef: ChangeDetectorRef, public applicationRef: ApplicationRef) {
    }

    public ngOnInit() {


        if ( !window.SpeechRecognition && !window.webkitSpeechRecognition ) {
            this.toast.sendToast('Sorry, speech recognition is not possible with your web browser.', 'error');
            this.self.destroy();
        }

        if (this.language.currentlanguage === 'de_DE') this.selectedLanguage = 0;
        else this.selectedLanguage = 1;

        this.recognition = new ( window.SpeechRecognition || window.webkitSpeechRecognition )();

        this.recognition.continuous = true;
        this.recognition.lang = this.languages[this.selectedLanguage].id.replace('_', '-');
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.part1fromField =
            this.textfield.element.nativeElement.value.substring(0, this.textfield.element.nativeElement.selectionStart);
        this.part2fromField =
            this.textfield.element.nativeElement.value.substring(this.textfield.element.nativeElement.selectionEnd);

        this.recognition.onresult = (speech) => {

            this.working = true;
            this.changeDetRef.detectChanges();

            let dummy: string = '';
            let isFinal = true;
            for (let result of speech.results) {
                if (!result.isFinal) isFinal = false;
                dummy += result[0].transcript;
                this.theTextNewest = dummy;
            }

            if (isFinal) {
                this.working = false;
                this.changeDetRef.detectChanges();
            }

            if (!this.dirty && this.theTextNewest) this.dirty = true;

            if (this.dirty) {
                this.theTextHtml = '<p>' + this.linebreaks2html(this.capitalize(this.theText + ' ' + this.theTextNewest)) + '</p>';
                this.changeDetRef.detectChanges();
            }

        };

        this.recognition.onerror = (event) => {

            switch (event.error) {

                case 'network':
                    this.errorOccurred = true;
                    this.sendErrorToast(this.language.getLabel('MSG_NO_NETWORK'),'warning');
                    break;

                case 'no-speech':
                    if (!this.stopping) {
                        this.recognition.stop(); // ???
                    }
                    return;

                case 'audio-capture':
                    this.errorOccurred = true;
                    this.sendErrorToast(this.language.getLabel('MSG_NO_MICROPHONE'));
                    break;

                case 'not-allowed':
                    this.errorOccurred = true;
                    if (event.timeStamp - this.start_timestamp < 100) this.sendErrorToast(this.language.getLabel('LBL_BLOCKED'));
                    else this.sendErrorToast(this.language.getLabel('LBL_DENIED'));
                    break;

                default:
                    break;

            }

            this.applicationRef.tick();

        };

        this.recognition.onend = (event) => {

            this.working = false;

            if (this.cancelling) {
                this.self.destroy();
                return;
            }

            if (this.pausing && !this.stopping) {
                this.applyText();
                return;
            }

            this.acceptAndClose();

        };

        this.start();

    }

    public doRestart() {
        this.toRestart = true;
        this.recognition.stop();
    }

    public applyText() {
        this.theText += (this.theText === '' ? this.capitalize(this.theTextNewest) : this.theTextNewest);
        this.theTextNewest = '';
    }

    public acceptAndClose() {

        this.applyText();

        if (this.errorOccurred) {
            if (this.theText === '' && this.theTextNewest === '') this.self.destroy();
            return;
        }

        if (!this.stopping) {
            this.recognition.start();
            if (this.toRestart) this.toRestart = false;
            return;
        }

        this.recognizing = false;
        this.textfield.element.nativeElement.value =
           this.part1fromField + this.theText + this.part2fromField;
        this.textfield.element.nativeElement.dispatchEvent( new Event('change') );

        this.self.destroy();

    }

    public start(event = null) {
        if (this.recognizing) return;
        this.recognizing = true;
        this.recognition.start();
        if (event) this.start_timestamp = event.timeStamp;
    }

    public buttonAcceptClose() {
        this.stopping = true;
        if (this.pausing) this.acceptAndClose();
        else this.recognition.stop();
    }

    public buttonPause() {
        this.pausing = !this.pausing;
        this.changeDetRef.detectChanges();
        this.applicationRef.tick();
        this.pausing && this.recognition.stop();
        !this.pausing && this.recognition.start();
    }

    public buttonCancel() {
        this.cancelling = true;
        this.pausing && this.recognition.start();
        this.recognition.abort();
        this.self.destroy();
    }

    public changeLang(event) {
        this.selectedLanguage = event.target.selectedIndex;
        this.recognition.lang = this.languages[this.selectedLanguage].id;
        this.doRestart();
    }

    public capitalize(string: string) {
        if (this.part1fromField.length === 0) return string.replace(/\S/, m => m.toUpperCase());
        else return string;
    }

    public linebreaks2html(string: string) {
        return string.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    }

    public sendErrorToast(message: string, type: 'error'|'warning' = 'error') {
        this.toast.sendToast(this.language.getLabel('ERR_SPEECH_RECOGNITION') + ': ' + message + '.', type, '', type !== 'error' );
    }
}
