<?php
namespace App\Models;

use Core\Model;
use PDO;

class Franchise extends Model {
    public function create($data) {
        $sql = "INSERT INTO franchise_applications (applicant_name, email, phone, city, message, form_data, reference_no) VALUES (:name, :email, :phone, :city, :message, :form_data, :reference_no)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':name' => $data['applicant_name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':city' => $data['city'],
            ':message' => $data['message'],
            ':form_data' => $data['form_data'],
            ':reference_no' => $data['reference_no']
        ]);
    }

    public function getByRef($refNo) {
        $stmt = $this->conn->prepare("SELECT * FROM franchise_applications WHERE reference_no = :refNo");
        $stmt->execute([':refNo' => $refNo]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getAll() {
        $stmt = $this->conn->query("SELECT * FROM franchise_applications ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status) {
        $stmt = $this->conn->prepare("UPDATE franchise_applications SET status = :status WHERE id = :id");
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    public function approveApplication($id) {
        try {
            $this->conn->beginTransaction();

            // 1. Update Application Status
            $this->updateStatus($id, 'Approved');

            // 2. Fetch Application Data
            $stmt = $this->conn->prepare("SELECT * FROM franchise_applications WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $app = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($app) {
                // 3. Generate Code (YOGA + ID + First 3 chars of city)
                $cityCode = strtoupper(substr($app['city'], 0, 3));
                $code = "EDV-{$cityCode}-" . str_pad($app['id'], 3, '0', STR_PAD_LEFT);

                // 4. Insert into Active Franchises
                $sql = "INSERT INTO active_franchises (application_id, franchise_code, owner_name, email, phone, city, address) 
                        VALUES (:app_id, :code, :name, :email, :phone, :city, :address)";
                
                $insert = $this->conn->prepare($sql);
                $insert->execute([
                    ':app_id' => $app['id'],
                    ':code' => $code,
                    ':name' => $app['applicant_name'],
                    ':email' => $app['email'],
                    ':phone' => $app['phone'],
                    ':city' => $app['city'],
                    ':address' => $app['city'] // Fallback address
                ]);
            }

            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollBack();
            return $e->getMessage(); // Return error message for debugging
        }
    }

    public function getActiveFranchises() {
        $stmt = $this->conn->query("SELECT * FROM active_franchises ORDER BY joined_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- Financials ---
    public function getPayments() {
        $sql = "SELECT p.*, f.owner_name, f.franchise_code 
                FROM franchise_payments p
                JOIN active_franchises f ON p.franchise_id = f.id
                ORDER BY p.payment_date DESC";
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addPayment($data) {
        $sql = "INSERT INTO franchise_payments (franchise_id, transaction_id, description, amount, payment_date, status)
                VALUES (:franchise_id, :transaction_id, :description, :amount, :payment_date, :status)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($data);
    }

    // --- Resources ---
    public function getResources() {
        $stmt = $this->conn->query("SELECT * FROM franchise_resources ORDER BY uploaded_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addResource($title, $filePath, $fileSize) {
        $sql = "INSERT INTO franchise_resources (title, file_path, file_size) VALUES (:title, :path, :size)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([':title' => $title, ':path' => $filePath, ':size' => $fileSize]);
    }

    // --- Settings ---
    public function getSettings() {
        $stmt = $this->conn->query("SELECT * FROM franchise_settings");
        return $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // Returns [key => value] array
    }

    public function saveSettings($settings) {
        $sql = "INSERT INTO franchise_settings (setting_key, setting_value) 
                VALUES (:key, :value) 
                ON DUPLICATE KEY UPDATE setting_value = :value";
        $stmt = $this->conn->prepare($sql);
        
        try {
            $this->conn->beginTransaction();
            foreach ($settings as $key => $value) {
                $stmt->execute([':key' => $key, ':value' => $value]);
            }
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

}
