const DATABASE = {
  "EVD-2967": {
    name: "ELENA VOSS",
    alias: "VOSS",
    dob: "14 NOV 1991",
    nationality: "UNITED STATES",
    status: "PERSON OF INTEREST",
    clearance: "LEVEL 03",
    caseNo: "CF-24-1187",
    confidence: "98.7%",
    photo: "assets/persons/EVD-1047/person.jpg",
    note: "Latent print recovered from evidence item E-17. Database comparison returned a high-confidence association with the subject record.",
    fingers: {
      "LEFT THUMB": "296__M_Left_thumb_finger_Zcut.BMP",
      "LEFT INDEX": "296__M_Left_index_finger_Zcut.BMP",
      "LEFT MIDDLE": "296__M_Left_middle_finger_Zcut.BMP",
      "LEFT RING": "296__M_Left_ring_finger_Zcut.BMP",
      "LEFT LITTLE": "296__M_Left_little_finger_Zcut.BMP",
      "RIGHT THUMB": "296__M_Right_thumb_finger_Zcut.BMP",
      "RIGHT INDEX": "296__M_Right_index_finger_Zcut.BMP",
      "RIGHT MIDDLE": "296__M_Right_middle_finger_Zcut.BMP",
      "RIGHT RING": "296__M_Right_ring_finger_Zcut.BMP",
      "RIGHT LITTLE": "296__M_Right_little_finger_Zcut.BMP"
    }
  },

  "EVD-2219": {
    name: "MARCUS HALE",
    alias: "HALE",
    dob: "03 FEB 1988",
    nationality: "UNITED STATES",
    status: "SUBJECT OF INTEREST",
    clearance: "LEVEL 02",
    caseNo: "CF-25-0421",
    confidence: "97.9%",
    photo: "assets/persons/EVD-2219/person.jpg",
    note: "Latent print comparison generated a database association. Secondary case-file review is required before investigative action.",
    fingers: {
      "LEFT THUMB": "assets/persons/EVD-2219/left-thumb.jpg",
      "LEFT INDEX": "assets/persons/EVD-2219/left-index.jpg",
      "LEFT MIDDLE": "assets/persons/EVD-2219/left-middle.jpg",
      "LEFT RING": "assets/persons/EVD-2219/left-ring.jpg",
      "LEFT LITTLE": "assets/persons/EVD-2219/left-little.jpg",
      "RIGHT THUMB": "assets/persons/EVD-2219/right-thumb.jpg",
      "RIGHT INDEX": "assets/persons/EVD-2219/right-index.jpg",
      "RIGHT MIDDLE": "assets/persons/EVD-2219/right-middle.jpg",
      "RIGHT RING": "assets/persons/EVD-2219/right-ring.jpg",
      "RIGHT LITTLE": "assets/persons/EVD-2219/right-little.jpg"
    }
  },

  "EVD-3301": {
    name: "NORA VALE",
    alias: "VALE",
    dob: "27 JUL 1995",
    nationality: "CANADA",
    status: "SUBJECT",
    clearance: "LEVEL 01",
    caseNo: "CF-25-0913",
    confidence: "96.8%",
    photo: "assets/persons/EVD-3301/person.jpg",
    note: "Database match established from latent print evidence. Record contains linked biometric material and an active case reference.",
    fingers: {
      "LEFT THUMB": "assets/persons/EVD-3301/left-thumb.jpg",
      "LEFT INDEX": "assets/persons/EVD-3301/left-index.jpg",
      "LEFT MIDDLE": "assets/persons/EVD-3301/left-middle.jpg",
      "LEFT RING": "assets/persons/EVD-3301/left-ring.jpg",
      "LEFT LITTLE": "assets/persons/EVD-3301/left-little.jpg",
      "RIGHT THUMB": "assets/persons/EVD-3301/right-thumb.jpg",
      "RIGHT INDEX": "assets/persons/EVD-3301/right-index.jpg",
      "RIGHT MIDDLE": "assets/persons/EVD-3301/right-middle.jpg",
      "RIGHT RING": "assets/persons/EVD-3301/right-ring.jpg",
      "RIGHT LITTLE": "assets/persons/EVD-3301/right-little.jpg"
    }
  }
};

const evidenceId = document.getElementById("evidenceId");
const fileInput = document.getElementById("fingerprintFile");
const dropZone = document.getElementById("dropZone");
const previewWrap = document.getElementById("previewWrap");
const preview = document.getElementById("fingerprintPreview");
const fileName = document.getElementById("fileName");
const removeFile = document.getElementById("removeFile");
const analyzeBtn = document.getElementById("analyzeBtn");
const consoleEl = document.getElementById("console");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const resultSection = document.getElementById("resultSection");
const matchResult = document.getElementById("matchResult");

let selectedFile = null;

dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", e => setFile(e.target.files[0]));

["dragenter", "dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
});
["dragleave", "drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
  });
});
dropZone.addEventListener("drop", e => setFile(e.dataTransfer.files[0]));

removeFile.addEventListener("click", e => {
  e.stopPropagation();
  selectedFile = null;
  fileInput.value = "";
  previewWrap.classList.add("hidden");
  preview.removeAttribute("src");
  fileName.textContent = "NO FILE";
});

function setFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  selectedFile = file;
  fileName.textContent = file.name.toUpperCase();
  preview.src = URL.createObjectURL(file);
  previewWrap.classList.remove("hidden");
}

function log(text, type = "") {
  const line = document.createElement("div");
  line.className = `console-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString("en-US", {hour12:false})}] ${text}`;
  consoleEl.appendChild(line);
  while (consoleEl.children.length > 13) consoleEl.removeChild(consoleEl.firstChild);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeId(value) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

async function analyze() {
  const id = normalizeId(evidenceId.value);

  if (!id) {
    evidenceId.focus();
    log("ERROR: EVIDENCE ID REQUIRED", "bad");
    return;
  }

  // Do not start analysis without a fingerprint image
  if (!selectedFile) {
    consoleEl.innerHTML = `
      <div class="console-line bad">
        [ERROR] BIOMETRIC ANALYSIS HALTED
      </div>
      <div class="console-line muted">
        NO LATENT PRINT IMAGE DETECTED
      </div>
      <div class="console-line muted">
        EVIDENCE IMAGE REQUIRED FOR ANALYSIS
      </div>
      <div class="console-line bad">
        [!] ACTION REQUIRED: UPLOAD FINGERPRINT EVIDENCE
      </div>
    `;

    progressText.textContent = "INPUT REQUIRED";
    progressPercent.textContent = "0%";
    progressBar.style.width = "0%";

    return;
  }

  analyzeBtn.disabled = true;
  resultSection.classList.add("hidden");
  matchResult.innerHTML = "";
  consoleEl.innerHTML = "";

  const record = DATABASE[id];

  log("INITIALIZING BIOMETRIC SERVICES...", "info");
  await sleep(450);
  log(`EVIDENCE ID ACCEPTED: ${id}`, "good");
  await sleep(350);
  log("SECURE CHANNEL ESTABLISHED", "good");
  await sleep(350);
  log("READING LOCAL EVIDENCE IMAGE...", "info");
  await sleep(450);
  log("IMAGE QUALITY CHECK: PASSED", "good");
  await sleep(300);
  log("EXTRACTING LATENT PRINT FEATURES...", "info");
  await sleep(500);
  log("MINUTIAE VECTOR GENERATED", "good");
  await sleep(300);
  log("QUERYING BIOMETRIC DATABASE...", "warn");

  progressText.textContent = "ANALYZING";
  for (let p = 0; p <= 100; p += 4) {
    progressBar.style.width = `${p}%`;
    progressPercent.textContent = `${p}%`;
    await sleep(55);
  }

  await sleep(450);

  if (record) {
    log("DATABASE RESPONSE RECEIVED", "good");
    await sleep(250);
    log("CANDIDATE RECORD LOCATED", "good");
    await sleep(250);
    log(`MATCH CONFIDENCE: ${record.confidence}`, "good");
    progressText.textContent = "MATCH FOUND";
    renderMatch(record, id);
  } else {
    log("DATABASE RESPONSE RECEIVED", "warn");
    await sleep(250);
    log("NO ASSOCIATED SUBJECT RECORD", "bad");
    await sleep(250);
    log("IDENTIFICATION STATUS: NEGATIVE", "bad");
    progressText.textContent = "NO MATCH";
    renderNoMatch(id);
  }

  analyzeBtn.disabled = false;
}

function imageOrPlaceholder(src, alt) {
  return `<img src="${src}" alt="${escapeHtml(alt)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';">
          <div class="photo-placeholder" style="display:none;">IMAGE NOT LOADED<br><br>${escapeHtml(src)}</div>`;
}

function renderMatch(record, id) {
  const fingers = Object.entries(record.fingers).map(([name, src], index) => `
    <div class="finger">
      ${imageOrPlaceholder(src, name)}
      <span class="finger-name">${escapeHtml(name)}</span>
      <span class="finger-id">PRINT REF ${String(index + 1).padStart(2, "0")}</span>
    </div>
  `).join("");

  matchResult.innerHTML = `
    <article class="result-card">
      <div class="result-banner match-banner">
        <div>
          <div class="kicker">BIOMETRIC DATABASE RESPONSE</div>
          <h2>✓ MATCH CONFIRMED</h2>
        </div>
        <div class="confidence">CONFIDENCE ${escapeHtml(record.confidence)}</div>
      </div>

      <div class="subject-layout">
        <div class="subject-photo">
          ${imageOrPlaceholder(record.photo, `${record.name} subject photograph`)}
        </div>

        <div>
          <div class="kicker">SUBJECT RECORD / ${escapeHtml(id)}</div>
          <h3 class="subject-name">${escapeHtml(record.name)}</h3>
          <div class="alias">ALIAS: ${escapeHtml(record.alias)}</div>

          <div class="meta-grid">
            <div class="meta-item"><span>DATE OF BIRTH</span><strong>${escapeHtml(record.dob)}</strong></div>
            <div class="meta-item"><span>NATIONALITY</span><strong>${escapeHtml(record.nationality)}</strong></div>
            <div class="meta-item"><span>STATUS</span><strong>${escapeHtml(record.status)}</strong></div>
            <div class="meta-item"><span>CLEARANCE</span><strong>${escapeHtml(record.clearance)}</strong></div>
            <div class="meta-item"><span>CASE NUMBER</span><strong>${escapeHtml(record.caseNo)}</strong></div>
            <div class="meta-item"><span>EVIDENCE ROUTE</span><strong>${escapeHtml(id)}</strong></div>
          </div>

          <div class="case-note">${escapeHtml(record.note)}</div>
        </div>
      </div>

      <div class="finger-section">
        <div class="finger-title">REGISTERED FINGERPRINTS / TEN-PRINT RECORD</div>
        <div class="fingerprint-grid">${fingers}</div>
      </div>
    </article>
  `;

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderNoMatch(id) {
  matchResult.innerHTML = `
    <article class="result-card">
      <div class="result-banner no-match-banner">
        <div>
          <div class="kicker">BIOMETRIC DATABASE RESPONSE</div>
          <h2>✕ NO DATABASE IDENTIFICATION</h2>
        </div>
        <div class="confidence">STATUS: NEGATIVE</div>
      </div>
      <div class="no-match">
        <div class="big">[ 0 ]</div>
        <h2>NO ASSOCIATED SUBJECT RECORD FOUND</h2>
        <p>
          The submitted evidence was processed successfully, but the requested
          evidence identifier did not return an associated subject record.
        </p>
        <p>
          Verify the evidence identifier and consult the originating case file
          before initiating a secondary search.
        </p>
        <div class="ref">QUERY REFERENCE: ${escapeHtml(id)}</div>
      </div>
    </article>
  `;

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

analyzeBtn.addEventListener("click", analyze);

evidenceId.addEventListener("keydown", e => {
  if (e.key === "Enter") analyze();
});
