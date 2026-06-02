<?php
session_start();

$password_hash = '$2y$10$wE8w9N6K1h/R7D331d2Qj.b4.kC.Z12PZ/E/n3YdC8UuP/cI1aEoq'; // Bcrypt hash of 'SOVREIGNITY'
// Support both 'SOVREIGNITY' and 'SOVEREIGNTY' case-insensitively
$valid_passwords = ['sovreignity', 'sovereignty'];

if (isset($_POST['action']) && $_POST['action'] == 'login') {
    $pass = strtolower(trim($_POST['password'] ?? ''));
    if (in_array($pass, $valid_passwords)) {
        $_SESSION['kenneth_auth'] = true;
    } else {
        $error = "Incorrect passcode. Security violation logged.";
    }
}

if (isset($_GET['action']) && $_GET['action'] == 'logout') {
    $_SESSION['kenneth_auth'] = false;
    session_destroy();
    header("Location: dashboard.php");
    exit;
}

$authenticated = $_SESSION['kenneth_auth'] ?? false;

// Read Database Submissions
define('SECURE_ARCHIVE', true);
$db_file = __DIR__ . '/submissions_db.php';
$submissions = [];
if (file_exists($db_file)) {
    $submissions = include $db_file;
}
if (!is_array($submissions)) {
    $submissions = [];
}
// Reverse to show newest first
$submissions = array_reverse($submissions);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kenneth's Briefing Room — Native Works</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --night: #12100E;
    --sand: #D8D2C8;
    --plaster: #EAE6DF;
    --plaster-light: #F4F1EC;
    --border: rgba(30, 27, 23, 0.1);
    --true-north: #8E3B28; /* Terracotta Brand color */
    --forest: #3E5A44;
    --mid: #5A5650;
    --shadow-raised: 0 10px 30px rgba(18, 16, 14, 0.05);
    --shadow-engraved: inset 0 2px 5px rgba(18, 16, 14, 0.05);
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'Share Tech Tech', monospace;
  }

  body {
    background-color: var(--plaster-light);
    color: var(--night);
    font-family: var(--font-body);
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  /* ── AUTH PANEL ── */
  .login-container {
    max-width: 420px;
    margin: 120px auto;
    padding: 40px;
    background: var(--plaster);
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: 0 20px 50px rgba(18, 16, 14, 0.08);
    text-align: center;
  }

  .login-logo {
    margin-bottom: 24px;
  }

  .login-title {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 400;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .login-subtitle {
    font-size: 13px;
    color: var(--mid);
    margin-bottom: 30px;
  }

  .form-group {
    text-align: left;
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--mid);
    margin-bottom: 8px;
  }

  .form-input {
    width: 100%;
    box-sizing: border-box;
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--plaster-light);
    color: var(--night);
    font-size: 14px;
    letter-spacing: 3px;
    text-align: center;
    outline: none;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    border-color: var(--true-north);
    box-shadow: var(--shadow-engraved);
  }

  .btn-submit {
    width: 100%;
    padding: 16px;
    background: var(--night);
    color: var(--plaster-light);
    border: none;
    border-radius: 4px;
    font-size: 11px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  .btn-submit:hover {
    background: var(--true-north);
  }

  .error-message {
    font-size: 12px;
    color: var(--true-north);
    margin-top: 16px;
    font-weight: 500;
  }

  /* ── DASHBOARD PANEL ── */
  .dashboard-header {
    background: var(--night);
    color: var(--plaster-light);
    padding: 24px clamp(16px, 4vw, 40px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--true-north);
  }

  .logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dashboard-wordmark {
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: 2.5px;
    font-weight: 500;
  }

  .btn-logout {
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--plaster-light);
    text-decoration: none;
    border: 1px solid rgba(234, 230, 223, 0.2);
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .btn-logout:hover {
    border-color: var(--true-north);
    color: var(--true-north);
  }

  .main-content {
    max-width: 1200px;
    margin: 40px auto;
    padding: 0 clamp(16px, 3vw, 40px);
    box-sizing: border-box;
  }

  .dashboard-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
  }

  .dashboard-title {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 400;
    margin: 0;
  }

  .lead-count {
    font-size: 13px;
    color: var(--mid);
  }

  /* Filter buttons */
  .filters-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
  }

  .filter-btn {
    background: var(--plaster);
    border: 1px solid var(--border);
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-weight: 600;
    color: var(--mid);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .filter-btn.active, .filter-btn:hover {
    background: var(--night);
    color: var(--plaster-light);
    border-color: var(--night);
  }

  /* Lead grid & cards */
  .leads-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .lead-card {
    background: var(--plaster);
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: var(--shadow-raised);
    padding: 24px clamp(16px, 3vw, 32px);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    transition: all 0.3s ease;
  }

  .lead-card:hover {
    box-shadow: 0 15px 40px rgba(18, 16, 14, 0.08);
  }

  .lead-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .lead-header-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .lead-track-badge {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 2px;
    color: #fff;
  }

  .track-business {
    background: var(--true-north);
  }

  .track-creator {
    background: var(--forest);
  }

  .lead-name {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }

  .lead-meta {
    font-size: 13px;
    color: var(--mid);
    display: flex;
    flex-wrap: wrap;
    gap: clamp(10px, 2vw, 24px);
  }

  .lead-meta span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Vector Visualizer */
  .vectors-bar-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
  }

  .vector-pill {
    background: var(--plaster-light);
    border: 1px solid var(--border);
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .vector-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mid);
  }

  .level-high { background: var(--true-north); }
  .level-mid { background: #D98C45; }
  .level-low { background: #68736B; }

  .lead-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    text-align: right;
  }

  .rec-badge-box {
    text-align: right;
  }

  .rec-label {
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--mid);
    font-weight: 600;
    margin-bottom: 4px;
    display: block;
  }

  .rec-product {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 500;
    color: var(--true-north);
    margin: 0;
  }

  .btn-brief {
    background: var(--night);
    color: var(--plaster-light);
    border: none;
    border-radius: 4px;
    padding: 12px 20px;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
    margin-top: 16px;
  }

  .btn-brief:hover {
    background: var(--true-north);
  }

  /* Playbook Brief Modal */
  .brief-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(18, 16, 14, 0.7);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 3vw, 40px);
    box-sizing: border-box;
  }

  .brief-content-wrapper {
    background: var(--plaster-light);
    border: 1px solid var(--border);
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 30px 80px rgba(0,0,0,0.3);
    position: relative;
  }

  .modal-header {
    background: var(--night);
    color: var(--plaster-light);
    padding: 24px 32px;
    border-bottom: 2px solid var(--true-north);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title-wrap h2 {
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 400;
    margin: 0;
  }

  .modal-title-wrap p {
    font-size: 12px;
    color: var(--sand);
    opacity: 0.8;
    margin: 4px 0 0 0;
  }

  .btn-close-modal {
    background: transparent;
    border: 1px solid rgba(234, 230, 223, 0.3);
    color: var(--plaster-light);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-close-modal:hover {
    border-color: var(--true-north);
    color: var(--true-north);
  }

  .modal-body {
    padding: 32px;
  }

  /* Brief Sections */
  .brief-section-card {
    background: var(--plaster);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px 24px;
    margin-bottom: 20px;
  }

  .brief-section-title {
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--true-north);
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(142, 59, 40, 0.15);
    padding-bottom: 6px;
  }

  .brief-quote {
    font-family: var(--font-display);
    font-size: 20px;
    font-style: italic;
    color: var(--night);
    line-height: 1.5;
    margin: 0 0 8px 0;
  }

  .brief-action-tip {
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--mid);
    margin: 0;
    font-weight: 400;
  }

  .badge-row {
    display: flex;
    gap: clamp(10px, 2vw, 24px);
    margin-bottom: 24px;
  }

  .badge-col {
    flex-grow: 1;
    background: var(--plaster);
    border: 1px solid var(--border);
    padding: 12px;
    border-radius: 4px;
    text-align: center;
  }

  .badge-col span {
    display: block;
  }

  .badge-col-val {
    font-family: var(--font-display);
    font-size: 20px;
    color: var(--true-north);
    font-weight: 500;
    margin-top: 4px;
  }

  .empty-state {
    text-align: center;
    padding: 60px;
    background: var(--plaster);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--mid);
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .lead-card {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .lead-right {
      align-items: flex-start;
      text-align: left;
    }
    
    .btn-brief {
      width: 100%;
    }
  }
</style>
</head>
<body>

<?php if (!$authenticated): ?>
  <!-- ── SECURITY AUTHENTICATION ROOM ── -->
  <div class="login-container">
    <div class="login-logo">
      <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="#1E1B17" stroke-width="0.75" fill="none"/>
        <path d="M16,16 L17.2,11 L16,2 L14.8,11 Z" fill="#8E3B28"/>
        <path d="M16,16 L17,19.5 L16,25 L15,19.5 Z" fill="#1E1B17"/>
        <circle cx="16" cy="16" r="2" fill="#1E1B17"/>
      </svg>
    </div>
    <h1 class="login-title">Kenneth's Desk</h1>
    <p class="login-subtitle">Sales Briefings & Sovereign Auditing Panel</p>

    <form method="POST" action="dashboard.php">
      <input type="hidden" name="action" value="login">
      <div class="form-group">
        <label for="password" class="form-label">Sovereign Key passcode</label>
        <input type="password" id="password" name="password" class="form-input" required placeholder="••••••••" autofocus autocomplete="current-password">
      </div>
      <button type="submit" class="btn-submit">Unlock brief list</button>
    </form>

    <?php if (isset($error)): ?>
      <p class="error-message"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>
  </div>

<?php else: ?>
  <!-- ── SOVEREIGN BRIEFINGS DASHBOARD ── -->
  <header class="dashboard-header">
    <div class="logo-wrap">
      <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="#D8D2C8" stroke-width="0.75" fill="none" opacity="0.4"/>
        <path d="M16,16 L17.2,11 L16,2 L14.8,11 Z" fill="#8E3B28"/>
        <path d="M16,16 L17,19.5 L16,25 L15,19.5 Z" fill="#D8D2C8"/>
        <circle cx="16" cy="16" r="2" fill="#D8D2C8"/>
      </svg>
      <span class="dashboard-wordmark">NATIVE WORKS</span>
    </div>
    <a href="dashboard.php?action=logout" class="btn-logout">Lock Panel</a>
  </header>

  <main class="main-content">
    <div class="dashboard-title-bar">
      <div>
        <h1 class="dashboard-title">Briefing Room</h1>
        <span class="lead-count">Kenneth's dynamic sales directory</span>
      </div>
      <span class="lead-count"><?php echo count($submissions); ?> total prospects loaded</span>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <button class="filter-btn active" onclick="filterLeads('all', this)">All Tracks</button>
      <button class="filter-btn" onclick="filterLeads('business', this)">Business</button>
      <button class="filter-btn" onclick="filterLeads('creator', this)">Creator</button>
    </div>

    <!-- Lead List -->
    <div class="leads-list">
      <?php if (empty($submissions)): ?>
        <div class="empty-state">
          <h3>No submissions archived yet</h3>
          <p>Submit your assessment questionnaire on the website to see it appear here dynamically.</p>
        </div>
      <?php else: ?>
        <?php foreach ($submissions as $lead): 
          $track = strtolower($lead['track'] ?? 'business');
          $pname = htmlspecialchars($lead['name'] ?? 'N/A');
          $pcompany = htmlspecialchars($lead['company'] ?? 'N/A');
          $prole = htmlspecialchars($lead['role'] ?? 'N/A');
          $pemail = htmlspecialchars($lead['email'] ?? 'N/A');
          $pphone = htmlspecialchars($lead['phone'] ?? 'N/A');
          $pmessage = htmlspecialchars($lead['message'] ?? 'N/A');
          $pscores = $lead['scores'] ?? '';
          $prec = htmlspecialchars($lead['recommendation'] ?? 'N/A');
          $pdate = date('M d, Y — H:i', strtotime($lead['timestamp'] ?? 'now'));
          
          // Parse score string: "URGENCY: 3/4 — SOPHISTICATION: 2/4"
          $parsed_scores = [];
          $parts = explode(' — ', $pscores);
          foreach ($parts as $p) {
              $pair = explode(': ', $p);
              if (count($pair) == 2) {
                  $parsed_scores[strtolower($pair[0])] = (int)explode('/', $pair[1])[0];
              }
          }
          
          // Encode answers and data safely for JavaScript modal injection
          $js_data = htmlspecialchars(json_encode([
              "track" => $track,
              "name" => $pname,
              "company" => $pcompany,
              "role" => $prole,
              "email" => $pemail,
              "phone" => $pphone,
              "message" => $pmessage,
              "scores" => $parsed_scores,
              "recommendation" => $prec,
              "date" => $pdate,
              "answers" => $lead['answers'] ?? []
          ]), ENT_QUOTES, 'UTF-8');
        ?>
          <div class="lead-card" data-track="<?php echo $track; ?>">
            <div class="lead-main">
              <div class="lead-header-info">
                <span class="lead-track-badge <?php echo ($track == 'business') ? 'track-business' : 'track-creator'; ?>">
                  <?php echo $track; ?>
                </span>
                <h3 class="lead-name"><?php echo $pname; ?></h3>
                <span style="color:var(--mid);font-size:14px;">at <strong><?php echo $pcompany; ?></strong> (<?php echo $prole; ?>)</span>
              </div>

              <div class="lead-meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <?php echo $pemail; ?>
                </span>
                <?php if (!empty($pphone)): ?>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <?php echo $pphone; ?>
                  </span>
                <?php endif; ?>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <?php echo $pdate; ?>
                </span>
              </div>

              <!-- Signal vector visualization -->
              <div class="vectors-bar-row">
                <?php foreach ($parsed_scores as $vecName => $score): 
                  $class = 'level-low';
                  if ($score >= 3) $class = 'level-high';
                  elseif ($score == 2) $class = 'level-mid';
                ?>
                  <div class="vector-pill">
                    <span class="vector-dot <?php echo $class; ?>"></span>
                    <span style="text-transform:capitalize;"><?php echo $vecName; ?>: <strong><?php echo $score; ?>/4</strong></span>
                  </div>
                <?php endforeach; ?>
              </div>
            </div>

            <div class="lead-right">
              <div class="rec-badge-box">
                <span class="rec-label">Lead Suggestion</span>
                <span class="rec-product"><?php echo explode(' [', $prec)[0]; ?></span>
              </div>
              <button class="btn-brief" onclick="openBriefPlaybook(<?php echo $js_data; ?>)">Playbook Brief →</button>
            </div>
          </div>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </main>

  <!-- ── PLAYBOOK BRIEF MODAL ── -->
  <div class="brief-modal" id="brief-modal">
    <div class="brief-content-wrapper">
      <header class="modal-header">
        <div class="modal-title-wrap">
          <h2 id="m-prospect-name">Name</h2>
          <p id="m-prospect-meta">Briefing meta info</p>
        </div>
        <button class="btn-close-modal" onclick="closeBriefPlaybook()">✕</button>
      </header>

      <div class="modal-body">
        <!-- Signal vectors visual list -->
        <div class="badge-row">
          <div class="badge-col"><span>Urgency</span><span id="m-urgency" class="badge-col-val">0/4</span></div>
          <div class="badge-col"><span>Sophistication</span><span id="m-soph" class="badge-col-val">0/4</span></div>
          <div class="badge-col"><span>Sovereignty</span><span id="m-sov" class="badge-col-val">0/4</span></div>
          <div class="badge-col"><span>Automation</span><span id="m-auto" class="badge-col-val">0/4</span></div>
          <div class="badge-col"><span id="m-fifth-label">Budget</span><span id="m-fifth-val" class="badge-col-val">0/4</span></div>
        </div>

        <!-- Section 1: Opening Moves -->
        <div class="brief-section-card">
          <h4 class="brief-section-title">Move 1 — The opening bridge</h4>
          <p class="brief-quote" id="play-opening-line">"Opening move here..."</p>
          <p class="brief-action-tip"><strong>Action Tip:</strong> Proactively referencing what they want to achieve in 12 months immediately breaks standard vendor script habits and earns high trust.</p>
        </div>

        <!-- Section 2: Bridge Question -->
        <div class="brief-section-card">
          <h4 class="brief-section-title">Move 2 — The bridge question</h4>
          <p class="brief-quote" id="play-bridge-line">"Bridge question here..."</p>
          <p class="brief-action-tip"><strong>Action Tip:</strong> Calibrated to their urgency trigger. Let them expand on the context behind their recent platform scare or operations bottleneck.</p>
        </div>

        <!-- Section 3: Confirm Fragility -->
        <div class="brief-section-card">
          <h4 class="brief-section-title">Move 3 — Confirming the fragility</h4>
          <p class="brief-quote" id="play-fragility-line">"Confirming fragility here..."</p>
          <p class="brief-action-tip"><strong>Action Tip:</strong> Get them to detail how their daily treadmill or back-office operational load affects their peace of mind before presenting the solution.</p>
        </div>

        <!-- Section 4: Sovereignty Trojan -->
        <div class="brief-section-card">
          <h4 class="brief-section-title">Move 4 — The Sovereignty Bridge</h4>
          <p class="brief-quote" id="play-sovereignty-line">"Sovereignty bridge here..."</p>
          <p class="brief-action-tip"><strong>Action Tip:</strong> Trojan Horse bridge. Highlight the scope of sensitive business data they expose to third parties and shift the focus to sovereign identity.</p>
        </div>

        <!-- Section 5: Dynamic Recommendation -->
        <div class="brief-section-card">
          <h4 class="brief-section-title">Move 5 — Product recommendation & close</h4>
          <p class="brief-quote" id="play-recommendation-line">"Recommendation here..."</p>
          <p class="brief-action-tip" style="margin-top:12px;"><strong>Kenneth's Closing Close:</strong> <span id="play-close-line" style="font-weight:600;color:var(--true-north);">"What does it take to start?"</span></p>
        </div>
      </div>
    </div>
  </div>

  <script>
    function filterLeads(track, btn) {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.lead-card').forEach(card => {
        if (track === 'all' || card.dataset.track === track) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function openBriefPlaybook(data) {
      document.getElementById('m-prospect-name').innerText = data.name;
      document.getElementById('m-prospect-meta').innerText = `${data.company} (${data.role}) — ${data.date}`;

      // Populate Signal Vector pill scores
      document.getElementById('m-urgency').innerText = `${data.scores.urgency || 0}/4`;
      document.getElementById('m-soph').innerText = `${data.scores.sophistication || 0}/4`;
      document.getElementById('m-sov').innerText = `${data.scores.sovereignty || 0}/4`;
      document.getElementById('m-auto').innerText = `${data.scores.automation || 0}/4`;

      const isBusiness = data.track === 'business';
      document.getElementById('m-fifth-label').innerText = isBusiness ? 'Budget' : 'Earning';
      document.getElementById('m-fifth-val').innerText = isBusiness ? `${data.scores.budget || 0}/4` : `${data.scores.earning || 0}/4`;

      // ── PLAYBOOK COMPILATION LOGIC ──
      let openingLine = '';
      let bridgeLine = '';
      let fragilityLine = '';
      let sovereigntyLine = '';
      let closeLine = '';

      const answers = data.answers || {};

      if (isBusiness) {
        // Section 1 Opening
        const q16 = answers.q16 || '';
        if (q16.includes('clarity')) {
          openingLine = `"You told us you want clarity in twelve months. Let's get you there in this conversation."`;
        } else if (q16.includes('concrete')) {
          openingLine = `"You told us you want two or three concrete things working in twelve months. Tell me which three would matter most."`;
        } else if (q16.includes('woven')) {
          openingLine = `"You told us you want AI woven into how the company runs in twelve months. That's a real ambition. Let's talk about what that looks like."`;
        } else {
          openingLine = `"You told us you want full sovereignty in twelve months. That tells us a lot about what kind of partner you're looking for. Let's start there."`;
        }

        // Section 2 Bridge
        const q2 = answers.q2 || '';
        if (q2.includes('competitor')) {
          bridgeLine = `"Tell me about the competitor. What did they do, and how did your team find out?"`;
        } else if (q2.includes('stretched')) {
          bridgeLine = `"Where is the strain showing up first? Whose calendar tells the story?"`;
        } else if (q2.includes('Leadership decided')) {
          bridgeLine = `"What does leadership want to be true twelve months from now that isn't true today?"`;
        } else {
          bridgeLine = `"What's been on your mind lately about the way your business runs?"`;
        }

        // Section 3 Fragility
        const q7 = answers.q7 || '';
        const q10 = answers.q10 || '';
        let area = q7.toLowerCase().includes('back office') ? 'the back office' : 'your operations';
        let treadmill = q10.toLowerCase().includes('drafting') ? 'drafting' : 'messages triage';
        fragilityLine = `"You said most of the friction lives in ${area}, and that ${treadmill} feels most like a treadmill. Before I tell you what we'd do about that, walk me through a typical week — where does the time actually go?"`;

        // Section 4 Sovereignty
        const q13 = answers.q13 || '';
        if (q13.includes('in-house')) {
          sovereigntyLine = `[Sold Case] "Based on your focus on maximum infrastructure privacy, you're already sold on sovereignty. Let me skip the standard pitch and show you what this actually looks like."`;
        } else if (q13.includes('Private setup')) {
          sovereigntyLine = `"What pushed you toward private setups rather than public? Is there a specific compliance situation behind it?"`;
        } else if (q13.includes('acceptable for non-sensitive')) {
          sovereigntyLine = `"What would you consider sensitive in your business? Most companies underestimate that surface area until they map it."`;
        } else {
          sovereigntyLine = `"What would have to change for public AI solutions to no longer be acceptable for your organization?"`;
        }

      } else {
        // CREATOR TRACK

        // Section 1 Opening
        const q16 = answers.q16 || '';
        if (q16.includes('anxious')) {
          openingLine = `"You told us you want to feel less anxious in twelve months. That's an honest answer and we take it seriously. Let's talk about what would actually make that true."`;
        } else if (q16.includes('Earning')) {
          openingLine = `"You told us you want to earn more directly from your audience in twelve months. Tell me about your audience first — who are they, and what's the relationship?"`;
        } else if (q16.includes('publishing')) {
          openingLine = `"You told us you want to run your own publishing and payment infrastructure in twelve months. That's a real ambition. Let's talk about what gets you there."`;
        } else {
          openingLine = `"You told us you want full sovereignty. That tells us a lot about what kind of partner you're looking for. Let's start there."`;
        }

        // Section 2 Bridge
        const q2 = answers.q2 || '';
        if (q2.includes('dropped')) {
          bridgeLine = `"Tell me about the reach drop. When did it start, what changed, and what have you tried?"`;
        } else if (q2.includes('rules')) {
          bridgeLine = `"Which platform, and what did they change? Has it affected your income yet?"`;
        } else if (q2.includes('lost their account')) {
          bridgeLine = `"Tell me about that. What happened to them, and what was your first thought when you saw it?"`;
        } else {
          bridgeLine = `"What's been on your mind lately about your situation?"`;
        }

        // Section 3 Fragility
        const q8 = answers.q8 || '';
        let fragType = q8.includes('account') ? 'my account itself' : (q8.includes('reach') ? 'my reach' : 'my contact with my audience');
        fragilityLine = `"You told us ${fragType} is the most fragile part of your operation. Walk me through that. What does fragility actually look like in your day-to-day?"`;

        // Section 4 Sovereignty
        const q13 = answers.q13 || '';
        if (q13.includes('Almost nothing')) {
          sovereigntyLine = `"That's the honest answer most creators don't say out loud. The good news is — it's fixable. The bad news is — it doesn't fix itself. Let me show you what fixing it actually looks like."`;
        } else if (q13.includes('emails')) {
          sovereigntyLine = `"Good — you're a step ahead. The question is what you can do with those emails outside of email itself. Have you ever thought about what a Substack alternative would look like if it were yours?"`;
        } else if (q13.includes('Most of it')) {
          sovereigntyLine = `"You're in better shape than most. What we'd add is the infrastructure to make those direct channels yours, not just your version of someone else's platform."`;
        } else {
          sovereigntyLine = `"Then we're talking about a different conversation. You're not looking for a starter kit; you're looking for a partner. Let's talk about what that looks like."`;
        }
      }

      // Section 5 Recommendation
      const cleanRec = data.recommendation.split(' [Posture:')[0];
      const posture = data.recommendation.includes('Posture:') ? data.recommendation.split('Posture: ')[1].replace(']', '') : 'Standard matching posture.';
      document.getElementById('play-recommendation-line').innerHTML = `<strong>Lead Product Pitch:</strong> ${cleanRec}<br><span style="display:block;margin-top:8px;font-size:13.5px;color:var(--mid);font-style:italic;"><strong>Sales Posture:</strong> ${posture}</span>`;

      // Section 6 Close (based on urgency)
      const uScore = data.scores.urgency || 0;
      if (uScore >= 3) {
        closeLine = `"What does it take to start in the next two weeks?"`;
      } else if (uScore == 2) {
        closeLine = `"Let's send you a written assessment by Friday. Then we book a follow-up."`;
      } else {
        closeLine = `"Let me put you on our occasional update list. When something changes for you, you have my email."`;
      }

      document.getElementById('play-opening-line').innerText = openingLine;
      document.getElementById('play-bridge-line').innerText = bridgeLine;
      document.getElementById('play-fragility-line').innerText = fragilityLine;
      document.getElementById('play-sovereignty-line').innerText = sovereigntyLine;
      document.getElementById('play-close-line').innerText = closeLine;

      document.getElementById('brief-modal').style.display = 'flex';
    }

    function closeBriefPlaybook() {
      document.getElementById('brief-modal').style.display = 'none';
    }
  </script>
<?php endif; ?>
</body>
</html>
