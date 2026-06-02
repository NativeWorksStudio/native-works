<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Extract contact fields
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $role = strip_tags(trim($_POST["role"]));
    $company = strip_tags(trim($_POST["company"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $message = strip_tags(trim($_POST["message"]));

    $track = isset($_POST["track"]) ? strtolower(strip_tags(trim($_POST["track"]))) : '';
    $scores = strip_tags(trim($_POST["scores"]));
    $recommendation = strip_tags(trim($_POST["recommendation"]));

    // Check required fields
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the required contact fields.";
        exit;
    }

    // Extract all 17 answers
    $answers = [];
    for ($i = 1; $i <= 17; $i++) {
        $answers["q$i"] = isset($_POST["q$i"]) ? strip_tags(trim($_POST["q$i"])) : '';
    }

    // 2. Append to Secure Database
    define('SECURE_ARCHIVE', true);
    $db_file = __DIR__ . '/submissions_db.php';
    
    $submissions = [];
    if (file_exists($db_file)) {
        $submissions = include $db_file;
    }
    if (!is_array($submissions)) {
        $submissions = [];
    }

    $new_entry = [
        "id" => uniqid('sub_', true),
        "timestamp" => date('Y-m-d H:i:s'),
        "track" => $track,
        "name" => $name,
        "email" => $email,
        "role" => $role,
        "company" => $company,
        "phone" => $phone,
        "message" => $message,
        "scores" => $scores,
        "recommendation" => $recommendation,
        "answers" => $answers
    ];

    $submissions[] = $new_entry;

    // Save database file
    file_put_contents($db_file, '<?php defined("SECURE_ARCHIVE") or die("Forbidden");' . "\n" . 'return ' . var_export($submissions, true) . ';');

    // 3. Send Email Notification
    $recipient = "info@nativeworks.studio";
    $subject = "New Assessment [" . strtoupper($track) . "] — $name ($company)";

    $email_content = "NEW ASSESSMENT SUBMISSION\n";
    $email_content .= "====================================\n\n";
    $email_content .= "Track: " . strtoupper($track) . "\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Role/Medium: $role\n";
    $email_content .= "Company/Channel: $company\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Scores: $scores\n";
    $email_content .= "Recommendation: $recommendation\n\n";
    if (!empty($message)) {
        $email_content .= "Optional Message:\n$message\n\n";
    }
    $email_content .= "Access Kenneth's Sales Dashboard on the website for the full Discovery Call Playbook brief.";

    $email_headers = "From: NativeWorks Portal <info@nativeworks.studio>\r\nReply-To: $email";

    @mail($recipient, $subject, $email_content, $email_headers);

    // 4. Redirect to Thank You page
    header("Location: thank-you.html");
    exit;
} else {
    http_response_code(403);
    echo "Method not allowed.";
}
?>
