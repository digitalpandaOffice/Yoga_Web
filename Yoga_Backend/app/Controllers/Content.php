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

    // GET /content/exam-eligibility
    public function examEligibility() {
        $this->handleGetContent('exam-eligibility', [
            'hero' => [
                'title' => 'Examination Eligibility',
                'subtitle' => 'Criteria and prerequisites for appearing in Diploma and Certificate examinations.'
            ],
            'intro' => [
                'title' => 'Who Can Apply?',
                'description' => 'Candidates must meet the following age and academic requirements to be eligible for the examinations.'
            ],
            'criteria_cards' => [
                [
                    'icon' => '🎂',
                    'title' => 'Age Requirements',
                    'items' => [
                        'Prarambhik (Year 1): Minimum 6 years of age.',
                        'Bhushan (Year 2): Minimum 8 years of age.',
                        'Visharad (Year 3): Minimum 12 years of age.'
                    ]
                ],
                [
                    'icon' => '🎓',
                    'title' => 'Academic Qualification',
                    'items' => [
                        'Prarambhik: No formal schooling required.',
                        'Bhushan: Must have passed Prarambhik.',
                        'Visharad: Must have passed Bhushan or equivalent.'
                    ]
                ],
                [
                    'icon' => '📅',
                    'title' => 'Attendance & Training',
                    'items' => [
                        'Minimum 75% attendance in practical classes.',
                        'Must be a registered student of an affiliated center.',
                        'Completion of internal assessments is mandatory.'
                    ]
                ]
            ],
            'general_rules' => [
                'Direct admission to higher years is possible only through a lateral entry test conducted by the board.',
                'Students must carry their Admit Card and a valid ID proof to the examination hall.',
                'Any malpractice or use of unfair means will lead to immediate disqualification for 3 years.',
                'Re-evaluation requests must be submitted within 15 days of result declaration.'
            ]
        ]);
    }

    // GET /content/admit-card
    public function admitCard() {
        $this->handleGetContent('admit-card', [
            'hero' => [
                'title' => 'Download Admit Card',
                'subtitle' => 'Get ready for your upcoming examinations'
            ],
            'instructions' => [
                'title' => 'Enter Details',
                'note' => 'Note: Admit cards are usually available 2 weeks before the examination date.'
            ]
        ]);
    }

    // GET /content/gallery-section
    public function gallerySection() {
        $this->handleGetContent('gallery-section', [
            'hero' => [
                'title' => 'Our Gallery',
                'subtitle' => 'Glimpses of our events, campus, and activities.'
            ],
            'stats' => [
                'stat1' => ['number' => '150+', 'label' => 'Student Performances'],
                'stat2' => ['number' => '25+', 'label' => 'Art Exhibitions'],
                'stat3' => ['number' => '50+', 'label' => 'Workshops Conducted'],
                'stat4' => ['number' => '500+', 'label' => 'Happy Students']
            ],
            'featured' => [
                'title' => 'Featured Highlights',
                'item1' => ['title' => 'Best Performance of 2024', 'desc' => 'Outstanding classical dance performance.', 'image' => 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=400&q=60'],
                'item2' => ['title' => 'International Art Exhibition', 'desc' => 'Student artworks featured globally.', 'image' => 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=400&q=60'],
                'item3' => ['title' => 'Music Excellence Award', 'desc' => 'Music department received prestigious award.', 'image' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=60']
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
