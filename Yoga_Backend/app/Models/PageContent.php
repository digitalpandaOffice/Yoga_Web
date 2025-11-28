<?php
namespace App\Models;

use Core\Model;
use PDO;

class PageContent extends Model {
    public function getByPage($pageSlug) {
        $stmt = $this->conn->prepare("SELECT * FROM page_content WHERE page_slug = :slug");
        $stmt->bindParam(':slug', $pageSlug);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function updateSection($pageSlug, $sectionKey, $content, $imageUrl = null) {
        // Check if exists
        $stmt = $this->conn->prepare("SELECT id FROM page_content WHERE page_slug = :slug AND section_key = :key");
        $stmt->execute([':slug' => $pageSlug, ':key' => $sectionKey]);
        
        if ($stmt->fetch()) {
            $sql = "UPDATE page_content SET content_value = :content";
            if ($imageUrl) {
                $sql .= ", image_url = :image";
            }
            $sql .= " WHERE page_slug = :slug AND section_key = :key";
        } else {
            $sql = "INSERT INTO page_content (page_slug, section_key, content_value, image_url) VALUES (:slug, :key, :content, :image)";
        }

        $stmt = $this->conn->prepare($sql);
        $params = [
            ':slug' => $pageSlug,
            ':key' => $sectionKey,
            ':content' => $content
        ];
        if ($imageUrl || strpos($sql, ':image') !== false) {
            $params[':image'] = $imageUrl;
        }

        return $stmt->execute($params);
    }
}
