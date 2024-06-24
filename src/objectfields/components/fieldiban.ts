/**
 * @module ObjectFields
 */

import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

/**
 * a field to display a IBAN input with validation
 * https://www.ibantest.com/en/how-is-the-iban-check-digit-calculated
 * */

@Component({
    selector: 'field-iban',
    templateUrl: '../templates/fieldiban.html',
})

export class fieldIban extends fieldGeneric {

    /**
     * country code
     */
    public countryCode: string = '';
    /**
     * array of all countries
     */
    public countries: any[] = [];
    /**
     * number of spaces in the input that will be added to the IbanMaxLength
     */
    public spacesInInput: number = 0;
    /**
     * length of the bank code
     */
    public bankCodeLength: number = 0;
    /**
     * maximum length of the IBAN depending on the country
     */
    public IBANLength: number;
    /**
     * maximum default iban length
     */
    public maxDefaultIbanLength: number = 34;
    /**
     * a helper variable to determine the start and the end of the country code
     */
    public countryStart: number = 2;
    /**
     * check input validation
     */
    public isValid: boolean = true;
    /**
     * field message mark guid
     */
    public mark: string;
    /**
     * zeroes that will be added to the end of the input
     */
    public zeroes: string = '00';


    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
        this.countries = this.metadata.getCountries();
        this.mark = this.model.generateGuid();
    }

    public modulo() {
        try {
            const iban = this.normalizeIBAN(this.value);
            const { bankCode, accountNumber } = this.extractIBANParts(iban);
            const bban = bankCode + accountNumber;
            const countryCode = this.translateLettersToNumbers(this.countryCode);

            if (this.isValidChecksum(bban, countryCode, iban)) {
                this.setValid();
            } else {
                this.setInvalid();
            }
        } catch (e) {
            this.setInvalid();
        }
    }

    private normalizeIBAN(value) {
        return value.trim().replace(/ /g, '');
    }

    private extractIBANParts(iban) {
        const bankCodeEnd = 4 + Number(this.bankCodeLength);
        return {
            bankCode: iban.substring(4, bankCodeEnd),
            accountNumber: iban.substring(bankCodeEnd, Number(this.IBANLength))
        };
    }

    private isValidChecksum(bban, countryCode, iban) {
        const modulo97 = 98n - BigInt(bban + countryCode + this.zeroes) % 97n;
        return Number(modulo97) === Number(iban.substring(2, 4));
    }

    private setValid() {
        this.isValid = true;
        this.model.resetFieldMessages(this.fieldname, 'error', this.mark);
    }

    private setInvalid() {
        this.isValid = false;
        this.model.setFieldMessage('error', this.language.getLabel('LBL_INPUT_INVALID'), this.fieldname, this.mark);
    }

    /**
     * get the length of the bank code
     */
    public getBankCodeLength() {
        return this.bankCodeLength = this.getCountriesInfo('bankcode_length');
    }

    /**
     * check how many spaces are in the input and add it to the IbanMaxLength
     */
    public checkSpaces() {
        let spaces = this.value.match(/ /g);
        if(spaces) this.spacesInInput = spaces.length;
    }

    /**
     * add spaces after every 4th character and set all the necessary variables
     */
    public addSpacesAndSetVariables() {
        this.value = this.value.replace(/ /g, '').replace(/(.{4})/g, '$1 ').trim().toUpperCase();
        this.countryCode = this.value.substring(0, this.countryStart);

        this.max();
        this.checkSpaces();
        this.getBankCodeLength();

        if(this.value === '') this.setValid();
    }

    public max() {
        // get the maximum length of the IBAN depending on the country
        this.IBANLength = this.getCountriesInfo('iban_length');

        if (this.IBANLength) {
            return Number(this.IBANLength) + this.spacesInInput;
        } else {
            return this.maxDefaultIbanLength;
        }
    }

    /**
     * gets the needed information from the countries array
     *
     * @param info represents the information that is needed
     */
    public getCountriesInfo(info) {
        return this.countries['countries'].filter(item => item.cc === this.countryCode)[0]?.[info];
    }

    /**
     * if input is true, call modulo function
     */
    public checkInputLength() {
        if(this.value) this.modulo()
    }

    /**
     * Translates a letter to a number according to ISO/IEC 7064 standard.
     * @param letter The letter to translate.
     */
    public letterToNumber(letter) {
        if (letter.length !== 1 || !/[A-Za-z]/.test(letter)) return

        const upperCaseLetter = letter.toUpperCase();
        const asciiValue = upperCaseLetter.charCodeAt(0);

        if (asciiValue >= 65 && asciiValue <= 90) {
            return asciiValue - 55;
        }
    }

    /**
     * Translates a string of letters to numbers.
     * @param letters The string of letters to translate.
     */
    public translateLettersToNumbers(letters) {
        return letters.split('')
            .map(letter => this.letterToNumber(letter).toString())
            .join('');
    }

}