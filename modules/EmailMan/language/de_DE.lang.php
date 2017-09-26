<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
/*********************************************************************************
 * This file is part of the twentyreasons German language pack.
 * Copyright (C) 2012 twentyreasons business solutions.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 ********************************************************************************/
 
$mod_strings = array (
	'LBL_SEND_DATE_TIME'						=> 'Sendedatum',
	'LBL_IN_QUEUE'								=> 'In Warteschlange?',
	'LBL_IN_QUEUE_DATE'							=> 'Warteschlange Datum',

	'ERR_INT_ONLY_EMAIL_PER_RUN'				=> 'Nur Ganzzahlwerte zulässig für Anzahl E-Mails pro Batch.',

	'LBL_ATTACHMENT_AUDIT'						=> 'wurde gesendet. Es wurde nicht lokal dupliziert um Speicher zu sparen.',
	'LBL_CONFIGURE_SETTINGS'					=> 'Konfigurieren',
	'LBL_CUSTOM_LOCATION'						=> 'Benutzerdefiniert',
	'LBL_DEFAULT_LOCATION'						=> 'Standard',
	
	'LBL_DISCLOSURE_TITLE'						=> 'Vertraulichkeitshinweis an jede E-Mail anhängen',
	'LBL_DISCLOSURE_TEXT_TITLE'					=> 'Inhalt Vertraulichkeitshinweis',
	'LBL_DISCLOSURE_TEXT_SAMPLE'				=> 'Dieses E-Mail sowie angehängte Anlagen sind vertraulich und nur für die benannte Person oder Firma bestimmt. Sollten Sie dieses E-Mail irrtümlicherweise erhalten haben, benachrichtigen Sie bitte den Absender und entfernen Sie das E-Mail nebst Anlagen von Ihrem System. Vielen Dank.',
	
	'LBL_EMAIL_DEFAULT_CHARSET'					=> 'E-Mail Nachrichten mit diesem Zeichensatz erstellen',
	'LBL_EMAIL_DEFAULT_EDITOR'					=> 'E-Mail Nachrichten mit diesem Client erstellen',
	'LBL_EMAIL_DEFAULT_DELETE_ATTACHMENTS'		=> 'Verknüpfte Notizen und Anhänge mit den E-Mails löschen',
	'LBL_EMAIL_GMAIL_DEFAULTS'					=> 'Gmail Standardwerte füllen',
	'LBL_EMAIL_PER_RUN_REQ'						=> 'Anzahl der Mails gesendet pro Batch:',
	'LBL_EMAIL_SMTP_SSL'						=> 'SMTP über SSL aktivieren',
	'LBL_EMAIL_USER_TITLE'						=> 'Benutzer E-Mail Standard',
	'LBL_EMAIL_OUTBOUND_CONFIGURATION'			=> 'Ausgehende Email Konfiguration',
	'LBL_EMAILS_PER_RUN'						=> 'Anzahl Mails gesendet pro Batch:',
	'LBL_ID'									=> 'ID',
	'LBL_LIST_CAMPAIGN'							=> 'Kampagne',
	'LBL_LIST_FORM_PROCESSED_TITLE'				=> 'Verarbeitet',
	'LBL_LIST_FORM_TITLE'						=> 'Warteschlange',
	'LBL_LIST_FROM_EMAIL'						=> 'Von E-Mail',
	'LBL_LIST_FROM_NAME'						=> 'Von Name',
	'LBL_LIST_IN_QUEUE'							=> 'In Arbeit',
	'LBL_LIST_MESSAGE_NAME'						=> 'Marketing Nachricht',
	'LBL_LIST_RECIPIENT_EMAIL'					=> 'Empfänger E-Mail',
	'LBL_LIST_RECIPIENT_NAME'					=> 'Emfpänger Name',
	'LBL_LIST_SEND_ATTEMPTS'					=> 'Sendeversuche',
	'LBL_LIST_SEND_DATE_TIME'					=> 'Senden Ein',
	'LBL_LIST_USER_NAME'						=> 'Benutzername',
	'LBL_LOCATION_ONLY'							=> 'Ort',
	'LBL_LOCATION_TRACK'						=> 'Speicherort der Kampagnentracking Dateien (z.B. campaign_tracker.php)',
    'LBL_CAMP_MESSAGE_COPY'                     => 'Kopien der Kampagnen Nachrichten behalten:',
    'LBL_CAMP_MESSAGE_COPY_DESC'                     => 'Wollen Sie den kompletten Text <bold>JEDER</bold> gesendeten E-Mail für alle Kampagnen speichern? <bold>Wir empfehlen dies nicht zu tun (ist Standard)</bold>. Auf diese Art wird nur die Vorlage und die notwendigen Parameter gespeichert, um die individuelle Nachricht wiederherstellen zu können.',
	'LBL_MAIL_SENDTYPE'							=> 'E-Mail Transfer Agent:',
	'LBL_MAIL_SMTPAUTH_REQ'						=> 'SMTP Authentfiizierung verwenden?',
	'LBL_MAIL_SMTPPASS'							=> 'SMTP Passwort:',
	'LBL_MAIL_SMTPPORT'							=> 'SMTP Port:',
	'LBL_MAIL_SMTPSERVER'						=> 'SMTP Server:',
	'LBL_MAIL_SMTPUSER'							=> 'SMTP User-Name:',
	'LBL_CHOOSE_EMAIL_PROVIDER'        => 'Wählen Sie Ihren Email Anbieter',
	'LBL_YAHOOMAIL_SMTPPASS'					=> 'Yahoo! Mail Passwort',
	'LBL_YAHOOMAIL_SMTPUSER'					=> 'Yahoo! Mail ID',
	'LBL_GMAIL_SMTPPASS'					=> 'Gmail Passwort',
	'LBL_GMAIL_SMTPUSER'					=> 'Gmail Email Adresse',
	'LBL_EXCHANGE_SMTPPASS'					=> 'Exchange Passwort',
	'LBL_EXCHANGE_SMTPUSER'					=> 'Exchange Benutzername',
	'LBL_EXCHANGE_SMTPPORT'					=> 'Exchange Server Port',
	'LBL_EXCHANGE_SMTPSERVER'				=> 'Exchange Server',
	'LBL_EMAIL_LINK_TYPE'				=> 'E-Mail Client',
    'LBL_EMAIL_LINK_TYPE_HELP'			=> '<b>Sugar Mail Client:</b> Send emails using the email client in the Sugar application.<br><b>External Mail Client:</b> Send email using an email client outside of the Sugar application, such as Microsoft Outlook.',
	'LBL_MARKETING_ID'							=> 'Marketing ID',
    'LBL_MODULE_ID'                             => 'EmailMan',
	'LBL_MODULE_NAME'							=> 'E-Mail Einstellungen',
	'LBL_CONFIGURE_CAMPAIGN_EMAIL_SETTINGS'    => 'Konfiguration Kampagnen Email Einstellungen',
	'LBL_MODULE_TITLE'							=> 'Ausgehende E-Mail Warteschlange Verwaltung',
	'LBL_NOTIFICATION_ON_DESC' 					=> 'Versendet eine Benachrichtigung wenn ein Eintrag einem Benutzer zugewiesen wird.',
	'LBL_NOTIFY_FROMADDRESS' 					=> '&#39;Von&#39; Adresse:',
	'LBL_NOTIFY_FROMNAME' 						=> '&#39;Von&#39; Name:',
	'LBL_NOTIFY_ON'								=> 'Benachrichtigung ein?',
	'LBL_NOTIFY_SEND_BY_DEFAULT'				=> 'Benachrichtigung für neue Benutzer als Standard setzen?',
	'LBL_NOTIFY_TITLE'							=> 'E-Mail Benachrichtigungs Optionen',
	'LBL_OLD_ID'								=> 'Alte ID',
	'LBL_OUTBOUND_EMAIL_TITLE'					=> 'Ausgehende E-Mail Optionen',
	'LBL_RELATED_ID'							=> 'Verknüpfte ID',
	'LBL_RELATED_TYPE'							=> 'Verknüpfter Typ',
	'LBL_SAVE_OUTBOUND_RAW'						=> 'Ausgehende E-Mails als Quelltext speichern',
	'LBL_SEARCH_FORM_PROCESSED_TITLE'			=> 'Verarbeitet Suche',
	'LBL_SEARCH_FORM_TITLE'						=> 'Suche Warteschlange',
	'LBL_VIEW_PROCESSED_EMAILS'					=> 'Verarbeitete E-Mails anzeigen',
	'LBL_VIEW_QUEUED_EMAILS'					=> 'E-Mail Warteschlange anzeigen',
	'TRACKING_ENTRIES_LOCATION_DEFAULT_VALUE'	=> 'Wert von site_url in config.php',
	'TXT_REMOVE_ME_ALT'							=> 'Zum Abmelden von dieser E-Mail Liste gehen Sie zu',
	'TXT_REMOVE_ME_CLICK'						=> 'hier klicken',
	'TXT_REMOVE_ME'								=> 'Um sich von der E-Mail Liste abzumelden .',
	'LBL_NOTIFY_SEND_FROM_ASSIGNING_USER'		=> 'Benachrichtigung senden wenn E-Mail Adresse zugewiesen wurde?',

	'LBL_SECURITY_TITLE'						=> 'E-Mail Sicherheitseinstellungen',
	'LBL_SECURITY_DESC'							=> 'Wählen Sie was NICHT erlaubt sein soll bei eingehenden E-Mails oder im E-Mail Modul angezeigt werden soll.',
	'LBL_SECURITY_APPLET'						=> 'Applet Tag',
	'LBL_SECURITY_BASE'							=> 'Base Tag',
	'LBL_SECURITY_EMBED'						=> 'Embed Tag',
	'LBL_SECURITY_FORM'							=> 'Form Tag',
	'LBL_SECURITY_FRAME'						=> 'Frame Tag',
	'LBL_SECURITY_FRAMESET'						=> 'Frameset Tag',
	'LBL_SECURITY_IFRAME'						=> 'iFrame Tag',
	'LBL_SECURITY_IMPORT'						=> 'Import Tag',
	'LBL_SECURITY_LAYER'						=> 'Layer Tag',
	'LBL_SECURITY_LINK'							=> 'Link Tag',
	'LBL_SECURITY_OBJECT'						=> 'Object Tag',
	'LBL_SECURITY_OUTLOOK_DEFAULTS'				=> 'Wählen Sie Standard Minimum Sicherheitsmaßnahmen',
	'LBL_SECURITY_SCRIPT'						=> 'Script Tag',
	'LBL_SECURITY_STYLE'						=> 'Style Tag',
	'LBL_SECURITY_TOGGLE_ALL'					=> 'Alle Optionen umschalten',
	'LBL_SECURITY_XMP'							=> 'mp Tag',
    'LBL_YES'                                   => 'Ja',
    'LBL_NO'                                    => 'Nein',
    'LBL_PREPEND_TEST'                          => '[Test]:',
	'LBL_SEND_ATTEMPTS'							=> 'Sendeversuche',
	'LBL_OUTGOING_SECTION_HELP'                 => 'Configure the default outgoing mail server for sending email notifications, including workflow alerts.',
    'LBL_ALLOW_DEFAULT_SELECTION'               => 'Allow users to use this account for outgoing email:',
    'LBL_ALLOW_DEFAULT_SELECTION_HELP'          => 'When this option selected, all users will be able to send emails using the same outgoing<br> mail account used to send system notifications and alerts.  If the option is not selected,<br> users can still use the outgoing mail server after providing their own account information.',
    'LBL_FROM_ADDRESS_HELP'                     => 'When enabled, the assigning user\&#39;s name and email address will be included in the From field of the email. This feature might not work with SMTP servers that do not allow sending from a different email account than the server account.',
	'LBL_GMAIL_LOGO' => 'Gmail',
	'LBL_YAHOO_MAIL_LOGO' => 'Yahoo Mail',
	'LBL_EXCHANGE_LOGO' => 'Exchange',
	'LBL_HELP' => 'Hilfe',
);
?>
