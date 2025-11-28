<?php
namespace App\Models;

use Core\Model;
use PDO;

class Content extends Model {
    // Fetch all content for a specific page
    public function getContentByPage($pageSlug) {
        $stmt = $this->conn->prepare("SELECT section_key, content_value FROM page_content WHERE page_slug = :page_slug");
        $stmt->bindParam(':page_slug', $pageSlug);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $content = [];
        
        foreach ($results as $row) {
            // Try to decode JSON, otherwise keep as string
            $decoded = json_decode($row['content_value'], true);
            $content[$row['section_key']] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $row['content_value'];
        }
        
        return $content;
    }

    // Update or Insert content for a specific section
    public function updateContent($pageSlug, $sectionKey, $contentValue) {
        // If content is an array/object, encode it to JSON
        if (is_array($contentValue) || is_object($contentValue)) {
            $contentValue = json_encode($contentValue);
        }

        // Check if exists
        $check = $this->conn->prepare("SELECT id FROM page_content WHERE page_slug = :page_slug AND section_key = :section_key");
        $check->bindParam(':page_slug', $pageSlug);
        $check->bindParam(':section_key', $sectionKey);
        $check->execute();

        if ($check->rowCount() > 0) {
            // Update
            $stmt = $this->conn->prepare("UPDATE page_content SET content_value = :content_value WHERE page_slug = :page_slug AND section_key = :section_key");
        } else {
            // Insert
            $stmt = $this->conn->prepare("INSERT INTO page_content (page_slug, section_key, content_value) VALUES (:page_slug, :section_key, :content_value)");
        }

        $stmt->bindParam(':page_slug', $pageSlug);
        $stmt->bindParam(':section_key', $sectionKey);
        $stmt->bindParam(':content_value', $contentValue);
        
        return $stmt->execute();
    }
}
