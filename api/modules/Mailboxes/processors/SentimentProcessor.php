<?php
namespace SpiceCRM\modules\Mailboxes\processors;

use Exception;
use SpiceCRM\extensions\modules\GoogleLanguage\GoogleLanguageDocument;

class SentimentProcessor extends Processor
{
    /**
     * process
     *
     * One of content, or gcs_content_uri must be set.
     * If the gcs_content_uri will be used, the condition should be changed accordingly.
     *
     * @throws Exception
     */
    public function process() {
        if (strip_tags($this->email->body != '')) {
            $document = new GoogleLanguageDocument($this->email->body);

            if ($this->email->body == strip_tags($this->email->body)) {
                $document->setType(GoogleLanguageDocument::CONTENT_TYPES[PLAIN_TEXT]);
            }

            try {
                $result = $document->analyzeSentiment();
                $this->email->saveSentiment($result->documentSentiment->score, $result->documentSentiment->magnitude);
            } catch (Exception $e) {
                $this->email->saveSentiment(null, null);
            }
        }
    }
}
