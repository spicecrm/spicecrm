<?php
/***** SPICE-HEADER-SPACEHOLDER *****/

namespace SpiceCRM\modules\OutputTemplates\handlers\pdf;

use SpiceCRM\includes\ErrorHandlers\ServiceUnavailableException;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class ExternalPdfServiceHandler extends ChromeLocalPdfHandler
{

    public function process( $html = null, array $options = null )
    {
        parent::process( $html, $options );

        $this->htmlOfPdfCreation = $this->createHtmlForPdf( $this->html_content ); # Save the HTML code the PDF is based on.
        $this->getExternalPdf( $this->htmlOfPdfCreation );
    }

    /**
     * Contact an other Spice CRM System to generate a PDF file.
     * @param $htmlOutput The HTML code for the PDF file.
     * @return void
     * @throws ServiceUnavailableException In case the other CRM System doesn´t do it´s job.
     */
    public function getExternalPdf( $htmlOutput )
    {
        $username = SpiceConfig::getInstance()->config['outputtemplates']['external_pdf_service__user'];
        $password = SpiceConfig::getInstance()->config['outputtemplates']['external_pdf_service__password'];

        $ch = curl_init(  );
        $curlBody = json_encode([ 'html' => $htmlOutput ],JSON_FORCE_OBJECT );
        $curlOptions = [
            CURLOPT_URL => SpiceConfig::getInstance()->config['outputtemplates']['external_pdf_service__endpoint'].'/common/pdfservice',
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $curlBody,
            CURLOPT_USERPWD => "$username:$password",
            CURLOPT_HTTPHEADER => [ 'Content-Type: application/json', 'Content-Length: '.strlen( $curlBody ) ]
        ];
        curl_setopt_array( $ch, $curlOptions );
        $logEntryHandler = new APILogEntryHandler();
        $logEntryHandler->generateOutgoingLogEntry($curlOptions, 'pdfservice');
        $logEntryHandler->writeOutogingLogEntry();
        $result = curl_exec( $ch );
        $logEntryHandler->updateOutgoingLogEntry($ch, $result);

        $result = json_decode( $result, true );

        $info = curl_getinfo( $ch );
        if ( $info['http_code'] != 200 ) {
            LoggerManager::getLogger()
                ->error('External PDF Service not available or not accessible. External system reports: HTTP error '.$info['http_code'].', "'
                    .$result['error']['message']
                    .( isset( $result['error']['errorCode'] ) ? '", error code "'.$result['error']['errorCode'].'"' : '' ));
            throw ( new ServiceUnavailableException('External PDF Service not available or not accessible. Contact Admin, see CRM log.'))->setFatal( false );
        }

        $this->content = base64_decode( $result['document'] );
        curl_close($ch);
    }

}
