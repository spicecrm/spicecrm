import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import {language} from '../../services/language.service';
import { toast } from '../../services/toast.service';

declare var window: any;

@Component({
    templateUrl: './app/systemcomponents/templates/speechrecognition.html'
})
export class SpeechRecognition implements OnInit {

    debug: boolean = false;

    self;

    recognition: any = {};
    start_timestamp: any;

    textfield: any;
    part1fromField: string;
    part2fromField: string;

    theText = '';
    theTextNewest = '';

    theTextHtml = '';

    dirty = false;

    errorOccurred = false;

    isFinal = false;

    toRestart = false;
    recognizing = false;
    cancelling = false;
    stopping = false;
    pausing = false;
    working = false;

    languages = [ { id: 'de_DE', name: 'Deutsch' }, { id: 'en_US', name: 'English' } ];
    selectedLanguage = 0;

    constructor( private language: language, private metadata: metadata, private toast: toast, private changeDetRef: ChangeDetectorRef, private applicationRef: ApplicationRef ) { }

    ngOnInit() {

        if ( !window.chrome || !window.chrome.webstore ) {
            this.toast.sendToast('Sorry, speech recognition is possible only with Google Chrome.','error');
            this.self.destroy();
        }

        if ( this.language.currentlanguage === 'de_DE' ) this.selectedLanguage = 0;
        else this.selectedLanguage = 1;

        // this.recognition = new window.webkitSpeechRecognition();

        this.recognition = new ( window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition )();

        this.debug && console.log( 'webspeech object: ', this.recognition );

        this.recognition.continuous = true;
        this.recognition.lang = this.languages[this.selectedLanguage].id;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.part1fromField =
            this.textfield.element.nativeElement.value.substring( 0, this.textfield.element.nativeElement.selectionStart );
        this.debug && console.log('selection start/end: ', this.textfield.element.nativeElement.selectionStart, this.textfield.element.nativeElement.selectionEnd );
        this.part2fromField =
            this.textfield.element.nativeElement.value.substring( this.textfield.element.nativeElement.selectionEnd );

        this.recognition.onresult = ( speech ) => {

            this.debug && console.log( 'result callback' );
            this.debug && console.log( 'results: ', speech.results );
            this.debug && console.log( 'results length: ', speech.results.length );
            this.debug && console.log( 'result index: ',speech.resultIndex);

            this.working = true; this.changeDetRef.detectChanges();

            let dummy: string = '';
            let isFinal = true;
            for ( let i = 0; i < speech.results.length; ++i) {
                if ( ! speech.results[i].isFinal ) isFinal = false;
                if( 1 || speech.results[i].isFinal ) {
                    if( this.debug ) console.log( 'isFinal' );
                    if( this.debug ) console.log( 'Transcript', speech.results[i][0].transcript );
                    dummy += speech.results[i][0].transcript;
                    if( this.debug ) console.log( 'dummy', dummy );
                    this.theTextNewest = dummy;
                }
            }
            this.isFinal = isFinal;

            if ( this.isFinal ) {
                this.working = false;
                this.changeDetRef.detectChanges();
            }

            this.debug && console.log('theText: ',this.theText);

            if ( !this.dirty && this.theTextNewest ) this.dirty = true;

            if ( this.dirty ) {
                this.theTextHtml = '<p>' + this.linebreaks2html( this.capitalize( this.theText + ' ' + this.theTextNewest ) ) + '</p>';
                this.changeDetRef.detectChanges();
            }

        };

        this.recognition.onerror = ( event ) => {

            this.debug && console.log( 'error callback: ', event.error );

            switch ( event.error ) {

                case 'network':
                    this.errorOccurred = true;
                    this.sendErrorToast( this.language.getLabel( 'MSG_NO_NETWORK' ));
                    break;

                case 'no-speech':
                    if ( !this.stopping ) {
                        this.recognition.stop(); //???
                    }
                    return;

                case 'audio-capture':
                    this.errorOccurred = true;
                    this.sendErrorToast( this.language.getLabel('MSG_NO_MICROPHONE' ));
                    break;

                case 'not-allowed':
                    this.errorOccurred = true;
                    if( event.timeStamp - this.start_timestamp < 100 )
                        this.sendErrorToast( this.language.getLabel('LBL_BLOCKED' ));
                    else
                        this.sendErrorToast( this.language.getLabel( 'LBL_DENIED' ));
                    break;

                default: break;

            }

            this.applicationRef.tick();

        };

        this.recognition.onend = ( event ) => {

            this.working = false;

            if ( this.cancelling ) {
                this.self.destroy();
                return;
            }

            if ( this.pausing ) {
                this.verwendeText();
                return;
            }

            this.debug && console.log( 'callback onend' );
            this.close();

        };

        this.start();

    }

    doRestart() {
        this.toRestart = true;
        this.recognition.stop();
    }

    verwendeText() {
        this.theText += ( this.theText === '' ? this.capitalize( this.theTextNewest ) : this.theTextNewest );
        this.theTextNewest = '';
    }

    close() {

        this.verwendeText();

        if ( this.errorOccurred ) {
            if ( this.theText === '' && this.theTextNewest === '' ) this.self.destroy();
            return;
        }

        if ( !this.stopping ) {
            this.recognition.start();
            if ( this.toRestart ) this.toRestart = false;
            return;
        }

        this.recognizing = false;

        this.textfield.element.nativeElement.value =
            this.part1fromField + this.theText + this.part2fromField;

        this.self.destroy();

    }

    start( event = null ) {
        if ( this.recognizing ) return;
        this.recognizing = true;
        this.recognition.start();
        if ( event ) this.start_timestamp = event.timeStamp;
    }

    buttonAcceptClose() {
        this.debug && console.log( 'accept&close button' );
        this.stopping = true;
        this.recognition.stop();
    }

    buttonPause() {
        this.debug && console.log( 'pause button' );
        this.pausing = !this.pausing;
        this.changeDetRef.detectChanges();
        this.applicationRef.tick();
        this.pausing && this.recognition.stop();
        !this.pausing && this.recognition.start();
    }

    buttonCancel() {
        this.recognition.stop();
        this.cancelling = true;
    }

    changeLang( event ) {
        this.selectedLanguage = event.target.selectedIndex;
        this.recognition.lang = this.languages[this.selectedLanguage].id;
        this.doRestart();
    }

    capitalize( string: string ) {
        if ( this.part1fromField.length === 0 )
            return string.replace(/\S/, function(m) { return m.toUpperCase(); });
        else return string;
    }

    linebreaks2html( string: string ) {
        return string.replace( /\n\n/g, '</p><p>').replace( /\n/g, '<br>' );
    }

    sendErrorToast( message: string ) {
        this.toast.sendToast(this.language.getLabel('ERR_SPEECH_RECOGNITION')+': '+message+'.', 'error', '', false );
    }

}