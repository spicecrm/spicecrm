<?php

namespace SpiceCRM\includes\SpiceTextMentions;

class SpiceTextMentions
{
    /**
     * check if the text contains mentions
     * @param string $text
     * @return bool
     */
    public static function hasMentions(string $text): bool
    {
        return str_contains($text, 'data-mention=');
    }

    /**
     * extract mentioned beans from text
     * @param string $text
     * @return array
     */
    public static function extractMentionedBeans(string $text): array
    {
        $doc = new \DOMDocument();
        $doc->loadHTML($text);

        $xpath = new \DOMXPath($doc);

        $nodes = $xpath->query('//a[@data-mention]');
        $mentions = [];

        foreach ($nodes as $node) {
            $mentions[] = (object) [
                'module' => $node->getAttribute('data-module'),
                'id' => $node->getAttribute('data-bean-id')
            ];
        }

        return $mentions;
    }
}