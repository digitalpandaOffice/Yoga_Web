<?php
namespace App\Controllers;

use Core\Controller;

class Content extends Controller {
    
    // GET /content/home
    public function home() {
        $this->handleGetContent('home', [
            'hero' => [],
            'about' => [],
            'stats' => [],
            'features' => [],
            'values' => [],
            'highlights' => [],
            'footer' => []
        ]);
    }

    // GET /content/syllabus
    public function syllabus() {
        $this->handleGetContent('syllabus', [
            'hero' => [
                'title' => 'Course Syllabus',
                'subtitle' => 'Comprehensive curriculum details for all our diploma and certificate programs.',
                'backgroundImage' => ''
            ],
            'syllabus_cards' => []
        ]);
    }

    // GET /content/results
    public function results() {
        $this->handleGetContent('results', [
            'hero' => [
                'title' => 'Examination Results',
                'subtitle' => 'Check your diploma and certificate course results online',
                'backgroundImage' => ''
            ],
            'form_options' => [
                'courses' => [
                    ['value' => 'fine-arts', 'label' => 'Diploma in Fine Arts'],
                    ['value' => 'kathak', 'label' => 'Diploma in Kathak'],
                    ['value' => 'bharatanatyam', 'label' => 'Diploma in Bharatanatyam'],
                    ['value' => 'vocal', 'label' => 'Hindustani Vocal'],
                    ['value' => 'theatre', 'label' => 'Theatre & Dramatics']
                ],
                'years' => [
                    ['value' => '2024-25', 'label' => '2024-2025'],
                    ['value' => '2023-24', 'label' => '2023-2024'],
                    ['value' => '2022-23', 'label' => '2022-2023']
                ]
            ]
        ]);
    }

    // GET /content/exam-dates
    public function examDates() {
        $this->handleGetContent('exam-dates', [
            'hero' => [
                'title' => 'Examination Dates',
                'subtitle' => 'Schedule for upcoming Diploma and Certificate examinations for the academic year 2025-2026.'
            ],
            'schedule_header' => [
                'title' => 'Examination Schedule 2025-2026',
                'description' => 'Select your course below to view the specific examination routine for your batch.'
            ],
            'download_section' => [
                'title' => 'Need a Hard Copy?',
                'text' => 'Download the complete consolidated examination routine for all departments.',
                'pdf_url' => '#'
            ]
        ]);
    }

    private function handleGetContent($page, $defaultStructure) {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $contentModel = $this->model('Content');
        $data = $contentModel->getContentByPage($page);

        if (empty($data)) {
            $data = $defaultStructure;
        }

        $this->json($data);
    }

    // POST /content/update
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->json(['error' => 'Method not allowed'], 405);
        }

        $input = json_decode(file_get_contents("php://input"), true);
        
        if (!$input) {
            $this->json(['error' => 'Invalid JSON data'], 400);
        }

        $contentModel = $this->model('Content');
        $pageSlug = $_GET['page'] ?? 'home'; 

        $success = true;
        foreach ($input as $sectionKey => $contentValue) {
            if (!$contentModel->updateContent($pageSlug, $sectionKey, $contentValue)) {
                $success = false;
            }
        }

        if ($success) {
            $this->json(['message' => 'Content updated successfully']);
        } else {
            $this->json(['error' => 'Some content failed to update'], 500);
        }
    }
}
