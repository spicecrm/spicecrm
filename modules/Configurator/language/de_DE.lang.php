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
	/*'ADMIN_EXPORT_ONLY'=>'Admin export only',*/
	'ADVANCED'=> 'Erweitert',
	'DEFAULT_CURRENCY_ISO4217'=> 'ISO 4217 Währungs Code',
	'DEFAULT_CURRENCY_NAME'=> 'Währungsname',
	'DEFAULT_CURRENCY_SYMBOL'=> 'Währungssymbol',
	'DEFAULT_CURRENCY'=> 'Standardwährung',
	'DEFAULT_DATE_FORMAT'=> 'Standard Datumsformat',
	'DEFAULT_DECIMAL_SEP'					=> 'Dezimalzeichen',
	'DEFAULT_LANGUAGE'=> 'Standardsprache',
	'DEFAULT_NUMBER_GROUPING_SEP'			=> '1000er Trennzeichen',
	'DEFAULT_SYSTEM_SETTINGS'=> 'Benutzer Interface',
	'DEFAULT_THEME'=> 'Standarddesign',
	'DEFAULT_TIME_FORMAT'=> 'Standard Zeitformat',
/*	'DISABLE_EXPORT'=>'Disable export',*/
	'DISPLAY_RESPONSE_TIME'=> 'Server Antwortzeiten anzeigen',
	/*'EXPORT'=>'Export', */
	'EXPORT_CHARSET' => 'Default Export Character Set',
	'EXPORT_DELIMITER' => 'Export Delimiter',
	'IMAGES'=> 'Logos',
	'LBL_ADMIN_WIZARD' => 'Admin Wizard',
	'LBL_ALLOW_USER_TABS' => 'Benutzern erlauben, die Reiter (Tabs) zu konfigurieren',
	'LBL_CONFIGURE_SETTINGS_TITLE' => 'Systemeinstellungen',
	'LBL_ENABLE_MAILMERGE' => 'Serienbriefe aktivieren?',
	'LBL_LOGVIEW' => 'Log Einstellungen konfigurieren',
	'LBL_MAIL_SMTPAUTH_REQ'				=> 'SMTP Authentfiizierung verwenden?',
	'LBL_MAIL_SMTPPASS'					=> 'SMTP Passwort:',
	'LBL_MAIL_SMTPPORT'					=> 'SMTP Port:',
	'LBL_MAIL_SMTPSERVER'				=> 'SMTP Server:',
	'LBL_MAIL_SMTPUSER'					=> 'SMTP User-Name:',
	'LBL_MAIL_SMTPTYPE'                => 'SMTP Server Typ:',
	'LBL_MAIL_SMTP_SETTINGS'           => 'SMTP Server Spezifikation',
	'LBL_CHOOSE_EMAIL_PROVIDER'        => 'Wählen Sie Ihren Email Anbieter',
	'LBL_YAHOOMAIL_SMTPPASS'					=> 'Yahoo! Mail Passwort',
	'LBL_YAHOOMAIL_SMTPUSER'					=> 'Yahoo! Mail ID',
	'LBL_GMAIL_SMTPPASS'					=> 'Gmail Passwort',
	'LBL_GMAIL_SMTPUSER'					=> 'Gmail Email Adresse',
	'LBL_EXCHANGE_SMTPPASS'					=> 'Exchange Passwort',
	'LBL_EXCHANGE_SMTPUSER'					=> 'Exchange Benutzername',
	'LBL_EXCHANGE_SMTPPORT'					=> 'Exchange Server Port',
	'LBL_EXCHANGE_SMTPSERVER'				=> 'Exchange Server',
    'LBL_ALLOW_DEFAULT_SELECTION'           => 'Benutzern erlauben unter diesem Account Emails zu versenden:',
    'LBL_ALLOW_DEFAULT_SELECTION_HELP'          => 'Wenn Sie diese Option auswählen können Benutzer unter einem Email Account Emails aus Sugar versenden. Dies ist der selbe Account unter dem auch Systememails versendet werden. Wenn Sie diese Option nicht auswählen können Benutzer immer noch emails versenden, müssen dazu aber Ihren eigenen Email Account konfigurieren.',
	'LBL_MAILMERGE_DESC' => 'Diese Option sollte nur markiert sein, wenn Sie das Sugar Plug-in für Microsoft® Word® besitzen.',
	'LBL_MAILMERGE' => 'Serienbrief',
	'LBL_MIN_AUTO_REFRESH_INTERVAL' => 'Minimum Dashlet Auto-Aktualisieren Intervalle',
	'LBL_MIN_AUTO_REFRESH_INTERVAL_HELP' => 'Dieser Wert ist den kleinste "Auto-Aktualisieren" Wert. Bitte &#39;Nie&#39; definieren und die Funktion Auto-Aktualisieren zu deaktivieren.',
	'LBL_MODULE_FAVICON'               => 'Modul-Ikone als Favicon anzeigen',
    'LBL_MODULE_FAVICON_HELP'   => 'If you are in a module with an icon, use the module&#39;s icon as the favicon, instead of the theme&#39;s favicon, in the browser tab.',
	'LBL_MODULE_NAME'=> 'Systemeinstellungen',
    'LBL_MODULE_ID'  => 'Konfigurator',
	'LBL_MODULE_TITLE'=> 'Benutzer Interface',
	'LBL_NOTIFY_FROMADDRESS' => '&#39;Von&#39; Adresse:',
	'LBL_NOTIFY_SUBJECT' => 'E-Mail Betreff:',
	'LBL_PORTAL_ON_DESC' => 'Erlaubt es einem externen Kunden auf Tickets, Notizen und andere Daten über das Selbstbedienungsportal zuzugreifen.',
	'LBL_PORTAL_ON' => 'Selbstbedienungsportal Integration einschalten?',
	'LBL_PORTAL_TITLE' => 'Kunden Selbstbedienungsportal',
	'LBL_PROXY_AUTH'=> 'Zugangsinformationen?',
	'LBL_PROXY_HOST'=> 'Proxy Host',
	'LBL_PROXY_ON_DESC'=> 'Proxy Server Adresse und Authentifizierungs Einstellungen konfigurieren',
	'LBL_PROXY_ON'=> 'Proxy Server verwenden',
	'LBL_PROXY_PASSWORD'=> 'Passwort',
	'LBL_PROXY_PORT'=> 'Port',
	'LBL_PROXY_TITLE'=> 'Proxy Einstellungen',
	'LBL_PROXY_USERNAME'=> 'Benutzername',
	'LBL_RESTORE_BUTTON_LABEL'=> 'Wiederherstellen',
	'LBL_SYSTEM_SETTINGS' => 'Systemeinstellungen',
	'LBL_SKYPEOUT_ON_DESC' => 'Ermöglicht es Benutzern auf eine Telefonnummer zu klicken, um Anrufe direkt mit SkypeOut® zu tätigen. Die Nummern müssen korrekt formatiert sein. Dies heißt:  "+" "Ländervorwahl" "Telefon Nummer"',
	'LBL_SKYPEOUT_ON' => 'SkypeOut® Integration aktivieren?',
	'LBL_SKYPEOUT_TITLE' => 'SkypeOut®',
	'LBL_USE_REAL_NAMES'	=> 'Vollständigen Namen anzeigen (nicht Benutzername)',
	'LBL_USE_REAL_NAMES_DESC'			=> 'Display users&#39; full names instead of their User Names in assignment fields.',
    'LBL_DISALBE_CONVERT_LEAD' => 'Interessentenumwandlungsfunktion für umgewadelten Interessenten deaktivieren',
    'LBL_DISALBE_CONVERT_LEAD_DESC' => 'Wenn ein Interessent bereits umgewandelt ist, wird diese Funktion entfernt',
    'LBL_ENABLE_ACTION_MENU' => 'Aktionen in Menues anzeigen.',
    'LBL_ENABLE_ACTION_MENU_DESC' => 'Auswählen, um Detail Ansicht und Subpanel Aktionen in einem Dropdown menue anzuzeigen. Wenn diese Option nicht ausgewählt ist, werden Detail Ansicht und Subpanel Aktionen als seperate Buttons angezeigt',
    'LIST_ENTRIES_PER_LISTVIEW'=> 'Listview-Objekte per Seite',
	'LIST_ENTRIES_PER_SUBPANEL'=> 'Subpanel-Objekte per Seite',
	'LOG_MEMORY_USAGE'=> 'Memory Verbrauch loggen',
	'LOG_SLOW_QUERIES'=> 'Langsame Abfragen loggen',
    'LOCK_HOMEPAGE_HELP'=> 'Diese Einstellung verhindert<BR> 1) Das Hinzufügen neuer Homepages im Home Modul und <BR>2) Die Änderung der Platzierung von Dashlets durch Ziehen und Loslassen',
    'CURRENT_LOGO'=> 'Derzeitiges Logo',
    'CURRENT_LOGO_HELP'=> 'This logo is displayed at the top left-hand corner of the Sugar application.',
    'NEW_LOGO'=> 'Neues Logo hochladen (212x40 pixel)',
	'NEW_LOGO_HELP'=> 'Das Bildformat kann entweder .jpg oder .png sein.<BR>Die empfohlene Größe ist 212x40 px.',
    'NEW_QUOTE_LOGO'=> 'Neues Angebot Logo hochladen (867x74)',
    'NEW_QUOTE_LOGO_HELP'=> 'Das verlangte Bildformat ist .jpg.<BR>Die empfohlene Größe ist 867x74 px.',
    'QUOTES_CURRENT_LOGO'=> 'Aktuelles Logo in den Angeboten',
	'SLOW_QUERY_TIME_MSEC'=> 'Grenzwert (in msec) damit eine Abfrage als langsam gilt',
	'STACK_TRACE_ERRORS'=> 'Zeige stack trace of errors',
	'UPLOAD_MAX_SIZE'=> 'Maximale Dateigröße beim Upload',
	'VERIFY_CLIENT_IP'=> 'Benutzer IP Adresse validieren',
    'LOCK_HOMEPAGE' => 'Anpassung des Homepage Layouts durch Benutzer verhindern',
    'LOCK_SUBPANELS' => 'Anpassung der Subpanel Layouts durch Benutzer verhindern',
    'MAX_DASHLETS' => 'Maximale Anzahl der Sugar Dashlets auf der Homepage',
	'SYSTEM_NAME'=> 'Systemname',
	'SYSTEM_NAME_WIZARD'=> 'Name_',
	'SYSTEM_NAME_HELP'=> 'Dieser Wert wird im Titel Ihres Browsers dargestellt.',
    'LBL_LDAP_TITLE'=> 'LDAP Authentifizierung Support',
    'LBL_LDAP_ENABLE'=> 'LDAP aktiveren',
    'LBL_LDAP_SERVER_HOSTNAME'=> 'Server:',
    'LBL_LDAP_SERVER_PORT'=> 'Port Nummer:',
    'LBL_LDAP_ADMIN_USER'=> 'Authentifizierter Benutzer:',
    'LBL_LDAP_ADMIN_USER_DESC'=> 'Wird verwendet um nach dem Sugar Benutzer zu suchen. [Muss u.U. voll qualifiziert werden] Falls nicht angegeben wird anonym verbunden.',
    'LBL_LDAP_ADMIN_PASSWORD'=> 'Authentifiziertes  Passwort:',
	'LBL_LDAP_AUTHENTICATION'=> 'Authentication:',
	'LBL_LDAP_AUTHENTICATION_DESC'=> 'Bind to the LDAP server using a specific users credentials',
    'LBL_LDAP_AUTO_CREATE_USERS'=> 'Benutzer autom. erstellen:',
    'LBL_LDAP_USER_DN'=> 'User DN:',
	'LBL_LDAP_GROUP_DN'=> 'Group DN:',
	'LBL_LDAP_GROUP_DN_DESC'=> 'Example: <em>ou=groups,dc=example,dc=com</em>',
	'LBL_LDAP_USER_FILTER'=> 'User Filter:',
	'LBL_LDAP_GROUP_MEMBERSHIP'=> 'Group Membership:',
	'LBL_LDAP_GROUP_MEMBERSHIP_DESC'=> 'Users must be a member of a specific group',
	'LBL_LDAP_GROUP_USER_ATTR'=> 'User Attribute:',
	'LBL_LDAP_GROUP_USER_ATTR_DESC'=> 'The unique identifier of the person that will be used to check if they are a member of the group Example: <em>uid</em>',
	'LBL_LDAP_GROUP_ATTR_DESC'=> 'The attribute of the Group that will be used to filter against the User Attribute Example: <em>memberUid</em>',
	'LBL_LDAP_GROUP_ATTR'=> 'Group Attribute:',
	'LBL_LDAP_USER_FILTER_DESC'=> 'Any additional filter params to apply when authenticating users e.g.<em>is_sugar_user=1 or (is_sugar_user=1)(is_sales=1)</em>',
    'LBL_LDAP_LOGIN_ATTRIBUTE'=> 'Login Attribute:',
    'LBL_LDAP_BIND_ATTRIBUTE'=> 'Bind Attribute:',
    'LBL_LDAP_BIND_ATTRIBUTE_DESC'=> 'Um die LDAP Benutzerbeispiele zu binden:[<b>AD:</b> userPrincipalName] [<b>openLDAP:</b> userPrincipalName] [<b>Mac OS X:</b> uid]',
    'LBL_LDAP_LOGIN_ATTRIBUTE_DESC'=> 'Um die LDAP Benutzerbeispiele zu suchen:[<b>AD:</b> userPrincipalName] [<b>openLDAP:</b> dn] [<b>Mac OS X:</b> dn]',
    'LBL_LDAP_SERVER_HOSTNAME_DESC'=> 'Beispiel: ldap.example.com',
    'LBL_LDAP_SERVER_PORT_DESC'=> 'Beispiel: 389',
	'LBL_LDAP_GROUP_NAME'=> 'Gruppen Name:',
	'LBL_LDAP_GROUP_NAME_DESC'=> 'Beispiel cn=sugarcrm',
    'LBL_LDAP_USER_DN_DESC'=> 'Beispiel: ou=people,dc=example,dc=com',
    'LBL_LDAP_AUTO_CREATE_USERS_DESC'=> 'Falls ein authentifizierter Benuzter nicht existiert, wird einer in Sugar erstellt.',
    'LBL_LDAP_ENC_KEY'	=> 'Kodierungsschlüssel:',
    'DEVELOPER_MODE'=> 'Entwickler Modus',

	'SHOW_DOWNLOADS_TAB' => 'Download Tab anzeigen',
	'SHOW_DOWNLOADS_TAB_HELP' => 'Wenn ausgewählt, erscheint der Download Tab bei der User-Einstellungen, wo der User dann die Sugar Plug-Ins und andere Dateien sieht.',
    'LBL_LDAP_ENC_KEY_DESC'	=> 'Für SOAP Authentifizierung bei Benutzung von LDAP.',
    'LDAP_ENC_KEY_NO_FUNC_DESC' => 'Die php_mcrypt muss in der php.ini aktiviert sein.',
    'LBL_ALL' => 'Alle',
    'LBL_MARK_POINT' => 'Markierungspunkt',
    'LBL_NEXT_' => 'Weiter>>',
    'LBL_REFRESH_FROM_MARK' => 'Ab Marke aktualisieren',
    'LBL_SEARCH' => 'Suche:',
    'LBL_REG_EXP' => 'Reg Exp:',
    'LBL_IGNORE_SELF' => 'Ignoriere Eigene:',
    'LBL_MARKING_WHERE_START_LOGGING'=> 'Markieren von wo Logging gestartet wird',
    'LBL_DISPLAYING_LOG'=> 'Log anzeigen',
    'LBL_YOUR_PROCESS_ID'=> 'Ihre Prozess ID',
    'LBL_YOUR_IP_ADDRESS'=> 'Ihre IP Adresse lautet',
    'LBL_IT_WILL_BE_IGNORED'=> 'wird es ignoriert',
    'LBL_LOG_NOT_CHANGED'=> 'Der Log wurde nicht geändert',
    'LBL_ALERT_JPG_IMAGE' => 'Das Dateiformat für das Bild muss JPEG sein. Laden Sie eine neue Datei mit der Endung .jpg hoch.',
    'LBL_ALERT_TYPE_IMAGE' => 'Das Dateiformat für das Bild muss JPEG oder PNG sein. Laden Sie eine neue Datei mit der Endung .jpg oder .png hoch.',
    'LBL_ALERT_SIZE_RATIO' => 'Das Seitenverhältnis des Bildes sollte zwischen 1:1 und 10:1 sein. Das Bild wird skaliert.',
    'LBL_ALERT_SIZE_RATIO_QUOTES' => 'Das Seitenverhältnis des Bildes muss zwischen 3:1 und 20:1 sein. Laden Sie eine neue Datei mit diesem Seitenverhältnis hoch.',
    'ERR_ALERT_FILE_UPLOAD' => 'Fehler während des Hochladens des Bildes.',
    'LBL_LOGGER'=> 'Logger Einstellungen',
	'LBL_LOGGER_FILENAME'=> 'Name der Logdatei',
	'LBL_LOGGER_FILE_EXTENSION'=> 'Erweiterung',
	'LBL_LOGGER_MAX_LOG_SIZE'=> 'Maximale Log Größe',
	'LBL_LOGGER_DEFAULT_DATE_FORMAT'=> 'Standard Datumsformat',
	'LBL_LOGGER_LOG_LEVEL'=> 'Log Stufe',
        'LBL_LEAD_CONV_OPTION' => 'Interessenten Umwandlungsoptionen',
        'LEAD_CONV_OPT_HELP' => '<b>Kopieren</b> - Alle Interessentenaktivitäten werden bei der Umwandlung nach Benutzerangaben kopiert. Kopien werden für jeden ausgewählten Satz erstellt.<br><br><b>Verschieben</b> - Alle Interessenten Aktivitäten bei der Umstellung zu einem vom Benutzer ausgewählten neuen Satzart verschieben. <br><br><b>Do Nothing</b> - Keine Aktivitäten bei der Umwandlung kopieren oder verschieben. Die Interessenten Aktivitäten bleiben beim Interessent.',
        'LBL_CONFIG_AJAX' => 'AJAX Benutzeroberfläche konfigurieren',
        'LBL_CONFIG_AJAX_DESC' => 'AJAX UI für bestimmte Module aktivieren oder deaktivieren.',
	'LBL_LOGGER_MAX_LOGS'=> 'Maximalzahl der logs (vor Übertrag)',
	'LBL_LOGGER_FILENAME_SUFFIX' => 'Nach dem Dateinamen anhängen',
	'LBL_VCAL_PERIOD' => 'vCal Updates Zeitperiode:',
    'LBL_IMPORT_MAX_RECORDS' => 'Importiere - Maximum Anzahlsätze',
    'LBL_IMPORT_MAX_RECORDS_HELP' => 'Die maximale Anzahl Zeilen definieren, die importiert werden können. Wenn die Satzanzahl überscshritten wird<br>, der Benutzer erhält einen Warnhinweis.  <br> Wenn keine Zahl vorhanden ist, können unbegrenzte Zeilen importiert werden.',
	'vCAL_HELP' => 'Use this setting to determine the number of months in advance of the current date that Free/Busy information for calls and meetings is published.<BR>To turn Free/Busy publishing off, enter "0".  The minimum is 1 month; the maximum is 12 months.',
    'LBL_PDFMODULE_NAME' => 'PDF Einstellungen',
    'SUGARPDF_BASIC_SETTINGS' => 'Dokumenteigenschaften',
    'SUGARPDF_ADVANCED_SETTINGS' => 'Erweiterte Einstellung',
    'SUGARPDF_LOGO_SETTINGS' => 'Bilder',

    'PDF_CREATOR' => 'PDF Creator',
    'PDF_CREATOR_INFO' => 'Definiert den Erzeuger des Dokuments <br>Das ist für gewöhnlich der Name der Applikation, welches das PDF generiert.',

    'PDF_AUTHOR' => 'Autor',
    'PDF_AUTHOR_INFO' => 'Der Autor wird in den Dokumenteigenschaft angezeigt.',

    'PDF_HEADER_LOGO' => 'Für Angebote-PDF-Dokumente',
    'PDF_HEADER_LOGO_INFO' => 'Dieses Bild wird im Header in Angebote-PDF-Dokumente angezeigt.',

    'PDF_NEW_HEADER_LOGO' => 'Neues Bild für Angebote wählen',
    'PDF_NEW_HEADER_LOGO_INFO' => 'Das Dateiformat kann entweder .jpg oder .png sein (Nur .jpg für EZPDF)<BR>Die empfohlene Größe ist 867x74px.',

    'PDF_HEADER_LOGO_WIDTH' => 'Angebote Bildbreite',
    'PDF_HEADER_LOGO_WIDTH_INFO' => 'Verändert die Größe des hochgeladenen Bildes, welches im Angebote-PDF-Dokumente angezeigt wird.(nur TCPDF)',

    'PDF_SMALL_HEADER_LOGO' => 'Für Reports-PDF-Dokumente',
    'PDF_SMALL_HEADER_LOGO_INFO' => 'Dieses Bild wird im Header in Reports-PDF-Dokument angezeigt.<br> Dieses Bild wird auch links oben in der Sugar-Applikation angezeigt.',

    'PDF_NEW_SMALL_HEADER_LOGO' => 'Bitte wählen Sie ein Neues Bild für Reports aus',
    'PDF_NEW_SMALL_HEADER_LOGO_INFO' => 'Das Dateiformat kann entweder .jpg oder .png sein (Only .jpg for EZPDF)<BR>Die empfohlene Größe ist 212x40 px.',

    'PDF_SMALL_HEADER_LOGO_WIDTH' => 'Reports Bildbreite',
    'PDF_SMALL_HEADER_LOGO_WIDTH_INFO' => 'Verändert die Größe des hochgeladenen Bildes, welches im Reports-PDF-Dokumente angezeigt wird.(nur TCPDF)',


    'PDF_HEADER_STRING' => 'Header String',
    'PDF_HEADER_STRING_INFO' => 'Header Beschriftung',

    'PDF_HEADER_TITLE' => 'Header Titel',
    'PDF_HEADER_TITLE_INFO' => 'String to print as title on document header',

    'PDF_FILENAME' => 'Standard-Dateiname',
    'PDF_FILENAME_INFO' => 'Standard-Dateiname für generierte PDF Dateien',

    'PDF_TITLE' => 'Titel',
    'PDF_TITLE_INFO' => 'Der Titel wird in den Dokuemnteigenschaften angezeigt',

    'PDF_SUBJECT' => 'Betreff',
    'PDF_SUBJECT_INFO' => 'Der Betriff wird in der Dokumenteingenschaft angezeigt.',

    'PDF_KEYWORDS' => 'Kennwort',
    'PDF_KEYWORDS_INFO' => 'Associate Keywords with the document, generally in the form "keyword1 keyword2..."',

    'PDF_COMPRESSION' => 'Compression',
    'PDF_COMPRESSION_INFO' => 'Activates or deactivates page compression. <br>When activated, the internal representation of each page is compressed, which leads to a compression ratio of about 2 for the resulting document.',

    'PDF_JPEG_QUALITY' => 'JPEG Qualität (1-100)',
    'PDF_JPEG_QUALITY_INFO' => 'Setzt den vorgegebenen JPEG-Qualität (1-100)',

    'PDF_PDF_VERSION' => 'PDF Version',
    'PDF_PDF_VERSION_INFO' => 'Setzt die PDF Version .',

    'PDF_PROTECTION' => 'Dokument-Schutz',
    'PDF_PROTECTION_INFO' => 'Set document protection<br>- copy: copy text and images to the clipboard<br>- print: print the document<br>- modify: modify it (except for annotations and forms)<br>- annot-forms: add annotations and forms<br>Note: the protection against modification is for people who have the full Acrobat product.',

    'PDF_USER_PASSWORD' => 'User Password',
    'PDF_USER_PASSWORD_INFO' => 'If you don\&#39;t set any password, the document will open as usual. <br>If you set a user password, the PDF viewer will ask for it before displaying the document. <br>The master password, if different from the user one, can be used to get full access.',

    'PDF_OWNER_PASSWORD' => 'Owner Password',
    'PDF_OWNER_PASSWORD_INFO' => 'If you don\&#39;t set any password, the document will open as usual. <br>If you set a user password, the PDF viewer will ask for it before displaying the document. <br>The master password, if different from the user one, can be used to get full access.',

    'PDF_ACL_ACCESS' => 'Access Control',
    'PDF_ACL_ACCESS_INFO' => 'Default Access Control for the PDF generation.',

    'K_CELL_HEIGHT_RATIO' => 'Cell Height Ratio',
    'K_CELL_HEIGHT_RATIO_INFO' => 'If the height of a cell is smaller than (Font Height x Cell Height Ratio), then (Font Height x Cell Height Ratio) is used as the cell height.<br>(Font Height x Cell Height Ratio) is also used as the height of the cell when no height is define.',

    'K_TITLE_MAGNIFICATION' => 'Title Magnification',
    'K_TITLE_MAGNIFICATION_INFO' => 'Title magnification respect main font size.',

    'K_SMALL_RATIO' => 'Small Font Factor',
    'K_SMALL_RATIO_INFO' => 'Reduction factor for small font.',

    'HEAD_MAGNIFICATION' => 'Head Magnification',
    'HEAD_MAGNIFICATION_INFO' => 'Magnification factor for titles.',

    'PDF_IMAGE_SCALE_RATIO' => 'Image scale ratio',
    'PDF_IMAGE_SCALE_RATIO_INFO' => 'Ratio used to scale the images',

    'PDF_UNIT' => 'Unit',
    'PDF_UNIT_INFO' => 'document unit of measure',
	'PDF_GD_WARNING'=> 'You do not have the GD library installed for PHP. Without the GD library installed, only JPEG logos can be displayed in PDF documents.',
    'ERR_EZPDF_DISABLE'=> 'Warning : The EZPDF class is disabled from the config table and it set as the PDF class. Please "Save" this form to set TCPDF as the PDF Class and return in a stable state.',
    'LBL_IMG_RESIZED'=> '(resized for display)',


    'LBL_FONTMANAGER_BUTTON' => 'PDF Font Manager',
    'LBL_FONTMANAGER_TITLE' => 'PDF Font Manager',
    'LBL_FONT_BOLD' => 'Bold',
    'LBL_FONT_ITALIC' => 'Italic',
    'LBL_FONT_BOLDITALIC' => 'Bold/Italic',
    'LBL_FONT_REGULAR' => 'Regular',

    'LBL_FONT_TYPE_CID0' => 'CID-0',
    'LBL_FONT_TYPE_CORE' => 'Core',
    'LBL_FONT_TYPE_TRUETYPE' => 'TrueType',
    'LBL_FONT_TYPE_TYPE1' => 'Type1',
    'LBL_FONT_TYPE_TRUETYPEU' => 'TrueTypeUnicode',

    'LBL_FONT_LIST_NAME' => 'Name',
    'LBL_FONT_LIST_FILENAME' => 'Filename',
    'LBL_FONT_LIST_TYPE' => 'Type',
    'LBL_FONT_LIST_STYLE' => 'Style',
    'LBL_FONT_LIST_STYLE_INFO' => 'Style of the font',
    'LBL_FONT_LIST_ENC' => 'Encoding',
    'LBL_FONT_LIST_EMBEDDED' => 'Embedded',
    'LBL_FONT_LIST_EMBEDDED_INFO' => 'Check to embed the font into the PDF file',
    'LBL_FONT_LIST_CIDINFO' => 'CID Information',
    'LBL_FONT_LIST_CIDINFO_INFO' => "Examples :".
"<ul><li>".
"Chinese Traditional :<br>".
"<pre>\$enc=\'UniCNS-UTF16-H\';<br>".
"\$cidinfo=array(\'Registry\'=>\'Adobe\', \'Ordering\'=>\'CNS1\',\'Supplement\'=>0);<br>".
"include(\'include/tcpdf/fonts/uni2cid_ac15.php\');</pre>".
"</li><li>".
"Chinese Simplified :<br>".
"<pre>\$enc=\'UniGB-UTF16-H\';<br>".
"\$cidinfo=array(\'Registry\'=>\'Adobe\', \'Ordering\'=>\'GB1\',\'Supplement\'=>2);<br>".
"include(\'include/tcpdf/fonts/uni2cid_ag15.php\');</pre>".
"</li><li>".
"Korean :<br>".
"<pre>\$enc=\'UniKS-UTF16-H\';<br>".
"\$cidinfo=array(\'Registry\'=>\'Adobe\', \'Ordering\'=>\'Korea1\',\'Supplement\'=>0);<br>".
"include(\'include/tcpdf/fonts/uni2cid_ak12.php\');</pre>".
"</li><li>".
"Japanese :<br>".
"<pre>\$enc=\'UniJIS-UTF16-H\';<br>".
"\$cidinfo=array(\'Registry\'=>\'Adobe\', \'Ordering\'=>\'Japan1\',\'Supplement\'=>5);<br>".
"include(\'include/tcpdf/fonts/uni2cid_aj16.php\');</pre>".
"</li></ul>".
"More help : www.tcpdf.org",
    'LBL_FONT_LIST_FILESIZE' => 'Font Size (KB)',
    'LBL_ADD_FONT' => 'Add a font',
    'LBL_BACK' => 'Back',
    'LBL_REMOVE' => 'rem',
    'LBL_JS_CONFIRM_DELETE_FONT' => 'Are you sure that you want to delete this font?',

    'LBL_ADDFONT_TITLE' => 'Add a PDF Font',
    'LBL_PDF_PATCH' => 'Patch',
    'LBL_PDF_PATCH_INFO' => 'Custom modification of the encoding. Write a PHP array.<br>Example :<br>ISO-8859-1 does not contain the euro symbol. To add it at position 164, write "array(164=>\\\'Euro\\\')".',
    'LBL_PDF_ENCODING_TABLE' => 'Encoding Table',
    'LBL_PDF_ENCODING_TABLE_INFO' => 'Name of the encoding table.<br>This option is ignored for TrueType Unicode, OpenType Unicode and symbolic fonts.<br>The encoding defines the association between a code (from 0 to 255) and a character contained in the font.<br>The first 128 are fixed and correspond to ASCII.',
    'LBL_PDF_FONT_FILE' => 'Font File',
    'LBL_PDF_FONT_FILE_INFO' => '.ttf or .otf or .pfb file',
    'LBL_PDF_METRIC_FILE' => 'Metric File',
    'LBL_PDF_METRIC_FILE_INFO' => '.afm or .ufm file',
    'LBL_ADD_FONT_BUTTON' => 'Add',
    'JS_ALERT_PDF_WRONG_EXTENSION' => 'This file do not have a good file extension.',
    'LBL_PDF_INSTRUCTIONS' => 'Instructions',
    'PDF_INSTRUCTIONS_ADD_FONT' => <<<BSOFR
Fonts supported by SugarPDF :
<ul>
<li>TrueTypeUnicode (UTF-8 Unicode)</li>
<li>OpenTypeUnicode</li>
<li>TrueType</li>
<li>OpenType</li>
<li>Type1</li>
<li>CID-0</li>
</ul>
<br>
If you choose to not embed your font in the PDF, the generated PDF file will be lighter but a substitution will be use if the font is not available in the system of your reader.
<br><br>
Adding a PDF font to SugarCRM requires to follow steps 1 and 2 of the TCPDF Fonts documentation available in the "DOCS" section of the <a href="http://www.tcpdf.org" target="_blank">TCPDF website</a>.
<br><br>The pfm2afm and ttf2ufm utils are available in fonts/utils in the TCPDF package that you can download on the "DOWNLOAD" section of the <a href="http://www.tcpdf.org" target="_blank">TCPDF website</a>.
<br><br>Load the metric file generated in step 2 and your font file below.
BSOFR
,
    'ERR_MISSING_CIDINFO' => 'The field CID Information cannot be empty.',
    'LBL_ADDFONTRESULT_TITLE' => 'Result of the add font process',
    'LBL_STATUS_FONT_SUCCESS' => 'SUCCESS : The font has been added to SugarCRM.',
    'LBL_STATUS_FONT_ERROR' => 'ERROR : The font has not been added. Look at the log below.',
    'LBL_FONT_MOVE_DEFFILE' => 'Font definition file move to : ',
    'LBL_FONT_MOVE_FILE' => 'Font file move to : ',

// Font manager
    'ERR_LOADFONTFILE' => 'ERROR: LoadFontFile error!',
    'ERR_FONT_EMPTYFILE' => 'ERROR: Empty filename!',
    'ERR_FONT_UNKNOW_TYPE' => 'ERROR: Unknow font type:',
    'ERR_DELETE_CORE_FILE' => 'ERROR: It is not possible to delete a core font.',
    'ERR_NO_FONT_PATH' => 'ERROR: No font path available!',
    'ERR_NO_CUSTOM_FONT_PATH' => 'ERROR: No custom font path available!',
    'ERR_FONT_NOT_WRITABLE' => 'is not writable.',
    'ERR_FONT_FILE_DO_NOT_EXIST' => 'doesn\'t exist or is not a directory.',
    'ERR_FONT_MAKEFONT' => 'ERROR: MakeFont error',
    'ERR_FONT_ALREADY_EXIST' => 'ERROR : This font already exist. Rollback...',
    'ERR_PDF_NO_UPLOAD' => 'Error during the upload of the font or metric file.',

// Wizard
    'LBL_WIZARD_TITLE' => 'Admin Wizard',
    'LBL_WIZARD_WELCOME_TAB' => 'Willkommen',
    'LBL_WIZARD_WELCOME_TITLE' => 'Willkommen bei Sugar!',
    'LBL_WIZARD_WELCOME' => 'Klicken Sie <b>Weiter</b> um Sugar jetzt anzupassen und zu lokalisieren. Wenn Sie dies später tun wollen, klicken Sie<b>Überspringen</b>.',
    'LBL_WIZARD_NEXT_BUTTON' => 'Weiter >',
    'LBL_WIZARD_BACK_BUTTON' => '< Zurück',
    'LBL_WIZARD_SKIP_BUTTON' => 'Überspringen',
    'LBL_WIZARD_FINISH_BUTTON' => 'Ende',
    'LBL_WIZARD_CONTINUE_BUTTON' => 'Weiter',
    'LBL_WIZARD_FINISH_TAB' => 'Ende',
    'LBL_WIZARD_FINISH_TITLE' => 'Die Grundeinstellungen sind vorgenommen',
    'LBL_WIZARD_FINISH' => 'Klicken Sie <b>Weiter</b> um Benutzereinstellungen vorzunehmen.<br/><br />
Um weitere Systemeinstellungen vorzunehmen, klicken Sie <a href="index.php?module=Administration&action=index" target="_blank">hier</a>.',
    'LBL_WIZARD_SYSTEM_TITLE' => 'Branding',
    'LBL_WIZARD_SYSTEM_DESC' => 'Geben Sie den Namen Ihrer Firma und Ihr Logo an, um Ihr Sugar anzupassen.',
    'LBL_WIZARD_LOCALE_DESC' => 'Geben Sie Ihre Ländereinstellungen an. Das sind die Standard-Systemeinstellungen, Ihre Benutzer können eigene Einstellungen wählen.',
    'LBL_WIZARD_SMTP_DESC' => 'Richten Sie das E-Mail Konto ein, von dem Sugar E-Mails wie z.B. Zuweisungsbenachrichtigungen und neue Passwörter sendet.',
    'LBL_MOBILE_MOD_REPORTS_RESTRICTION' => '* The Reports module is only available for the Sugar Mobile iPhone client.',
	'LBL_GMAIL_LOGO' => 'Gmail Logo' /*for 508 compliance fix*/,
	'LBL_YAHOO_MAIL' => 'Yahoo Mail' /*for 508 compliance fix*/,
	'LBL_EXCHANGE_LOGO' => 'Exchange' /*for 508 compliance fix*/,
	'LBL_LOADING' => 'Bitte warten...' /*for 508 compliance fix*/,
	'LBL_DELETE' => 'Löschen' /*for 508 compliance fix*/,
	'LBL_WELCOME' => 'Willkommen' /*for 508 compliance fix*/,
	'LBL_LOGO' => 'Logo' /*for 508 compliance fix*/,
    'LBL_MOBILE_MOD_REPORTS_RESTRICTION' => '* Das Berichtsmodul ist nur für Sugar Mobile native clients verfügbar',
);


?>

