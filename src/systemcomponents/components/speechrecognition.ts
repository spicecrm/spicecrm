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
import {Component, OnInit, ChangeDetectorRef, ApplicationRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from '../../services/toast.service';

declare var window: any;

@Component({
    templateUrl: './src/systemcomponents/templates/speechrecognition.html'
})
export class SpeechRecognition implements OnInit {

    private self;

    private recognition: any;
    private start_timestamp: any;

    private textfield: any;
    private part1fromField: string;
    private part2fromField: string;

    private theText = '';
    private theTextNewest = '';

    private theTextHtml = '';

    private dirty = false;

    private errorOccurred = false;

    private toRestart = false;
    private recognizing = false;
    private cancelling = false;
    private stopping = false;
    private pausing = false;
    private working = false;

    private languages = [{id: 'de_DE', name: 'Deutsch'}, {id: 'en_US', name: 'English'}];
    private selectedLanguage = 0;

    constructor(private language: language, private metadata: metadata, private toast: toast, private changeDetRef: ChangeDetectorRef, private applicationRef: ApplicationRef) {
    }

    public ngOnInit() {


        if (!window.webkitSpeechRecognition) {
            this.toast.sendToast('Sorry, speech recognition is possible only with Google Chrome.', 'error');
            this.self.destroy();
        }

        if (this.language.currentlanguage === 'de_DE') this.selectedLanguage = 0;
        else this.selectedLanguage = 1;

        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

        this.recognition.continuous = true;
        this.recognition.lang = this.languages[this.selectedLanguage].id;
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
                    this.sendErrorToast(this.language.getLabel('MSG_NO_NETWORK'));
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

    private doRestart() {
        this.toRestart = true;
        this.recognition.stop();
    }

    private applyText() {
        this.theText += (this.theText === '' ? this.capitalize(this.theTextNewest) : this.theTextNewest);
        this.theTextNewest = '';
    }

    private acceptAndClose() {

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

    private start(event = null) {
        if (this.recognizing) return;
        this.recognizing = true;
        this.recognition.start();
        if (event) this.start_timestamp = event.timeStamp;
    }

    private buttonAcceptClose() {
        this.stopping = true;
        if (this.pausing) this.acceptAndClose();
        else this.recognition.stop();
    }

    private buttonPause() {
        this.pausing = !this.pausing;
        this.changeDetRef.detectChanges();
        this.applicationRef.tick();
        this.pausing && this.recognition.stop();
        !this.pausing && this.recognition.start();
    }

    private buttonCancel() {
        this.cancelling = true;
        this.pausing && this.recognition.start();
        this.recognition.abort();
        this.self.destroy();
    }

    private changeLang(event) {
        this.selectedLanguage = event.target.selectedIndex;
        this.recognition.lang = this.languages[this.selectedLanguage].id;
        this.doRestart();
    }

    private capitalize(string: string) {
        if (this.part1fromField.length === 0) return string.replace(/\S/, m => m.toUpperCase());
        else return string;
    }

    private linebreaks2html(string: string) {
        return string.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    }

    private sendErrorToast(message: string) {
        this.toast.sendToast(this.language.getLabel('ERR_SPEECH_RECOGNITION') + ': ' + message + '.', 'error', '', false);
    }
}
