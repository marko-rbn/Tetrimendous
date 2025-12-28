<?php
header('Content-Type: application/json');

error_log('save-score.php requested');   // track if there is abuse

// Read the JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate input exists
if (!$data || !isset($data['name']) || !isset($data['score']) || !isset($data['level'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// Sanitize and validate data
$name = trim($data['name']);
$name = substr($name, 0, 20); // Limit to 20 characters
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

$score = (int) $data['score'];
$level = (int) $data['level'];

// Validate score and level are reasonable
if ($score < 0 || $score > 999999 || $level < 1 || $level > 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid score or level']);
    exit;
}

// Use server date
$date = date('Y-m-d');

// Create new entry
$newEntry = [
    'name' => $name,
    'score' => $score,
    'level' => $level,
    'date' => $date
];

error_log('New entry: ' . json_encode($newEntry));  // log new entry for debugging

$filename = 'hi-scores.json';

// Lock file for reading and writing
$fp = fopen($filename, 'c+');
if (!$fp) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not open file']);
    exit;
}

flock($fp, LOCK_EX);

// Read existing scores
$fileContent = stream_get_contents($fp);
$highScores = json_decode($fileContent, true);

// Initialize if empty or invalid
if (!is_array($highScores)) {
    $highScores = [];
}

// Add new entry
$highScores[] = $newEntry;

// Sort by score descending
usort($highScores, function($a, $b) {
    return $b['score'] - $a['score'];
});

// Keep only top 10
$highScores = array_slice($highScores, 0, 10);

// Write back to file
rewind($fp);
ftruncate($fp, 0);
fwrite($fp, json_encode($highScores, JSON_PRETTY_PRINT));

flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['success' => true, 'message' => 'Score saved successfully']);
?>
