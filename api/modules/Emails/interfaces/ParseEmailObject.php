<?php

namespace SpiceCRM\modules\Emails\interfaces;

class ParseEmailObject
{
    public function __construct(
        public string $subject,
        public string $from,
        public string $date_sent,
        public array $recipients,
        public string $body,
        public bool $isHtml
    ) {}
}