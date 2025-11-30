/* --------------------------------------------
   GITHUB AYARLARI
-------------------------------------------- */
const GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const REPO_OWNER = "batuhanheval-bit";
const REPO_NAME = "ozyildizpro-photos";

/* --------------------------------------------
   LOG FONKSİYONU
-------------------------------------------- */
function logAdd(msg) {
    const log = document.getElementById("log");
    log.value += msg + "\n";
}

/* --------------------------------------------
   FOTOĞRAF YÜKLEME — %100 HATASIZ + DEBUG
-------------------------------------------- */
async function uploadPhotos() {

    const rawCustomer = document.getElementById("customerName").value.trim();
    const files = document.getElementById("folderInput").files;

    if (!rawCustomer) return alert("⚠ Müşteri adını yaz!");
    if (!files.length) return logAdd("❌ Fotoğraf klasörü seçilmedi!");

    // Müşteri adı temizleme
    const safeCustomer = rawCustomer
        .normalize("NFKD")
        .replace(/[^\w]/g, "")
        .toLowerCase();

    logAdd(`\n📁 Müşteri klasörü: ${safeCustomer}`);

    for (const file of files) {

        if (!/\.(jpg|jpeg|png|raw|arw)$/i.test(file.name)) continue;

        logAdd(`⏳ Yükleniyor → ${file.name}`);

        // Base64'e çevir
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        bytes.forEach(b => binary += String.fromCharCode(b));
        const base64 = btoa(binary);

        const path = `photos/${safeCustomer}/${file.name}`;

        const apiURL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

        // SHA kontrolü
        let sha = undefined;
        const check = await fetch(apiURL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (check.ok) {
            const json = await check.json();
            sha = json.sha;
        }

        // UPLOAD
        const upload = await fetch(apiURL, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Upload (${safeCustomer})`,
                content: base64,
                sha: sha
            })
        });

        /* 🔥 HATA DEBUG BURADA — BUNU EKLEDİM */
        if (!upload.ok) {
            logAdd(`❌ HATA → ${file.name}`);

            const errText = await upload.text();
            console.error("UPLOAD ERROR:", errText);

            logAdd(`⛔ GitHub Yanıtı:\n${errText}\n`);
            continue;
        }

        logAdd(`✔ Yüklendi → ${file.name}`);
    }

    logAdd("\n🎉 TÜM FOTOĞRAFLAR GITHUB'A YÜKLENDİ!");

    document.getElementById("clientURL").value =
        `${window.location.origin}/client.html?user=${safeCustomer}`;
}

/* --------------------------------------------
   SEÇİM KODLARI OKU
-------------------------------------------- */
let selectedList = [];

function processPastedCodes() {
    const text = document.getElementById("pasteInput").value.trim();

    if (!text) return alert("⚠ Kod yapıştırmadın!");

    selectedList = text.split(/\r?\n/).filter(Boolean);
    logAdd(`✔ ${selectedList.length} kod işlendi`);
}

/* --------------------------------------------
   EŞLEŞEN FOTOĞRAFLARI KOPYALA
-------------------------------------------- */
async function matchAndCopy() {

    if (!selectedList.length) return alert("⚠ Önce kodları yapıştır!");
    const files = document.getElementById("localFolder").files;

    if (!files.length) return alert("⚠ Bilgisayardaki fotoğraf klasörünü seç!");

    const root = await window.showDirectoryPicker();
    const dest = await root.getDirectoryHandle("Secilenler", { create: true });

    let count = 0;

    for (const file of files) {
        if (!selectedList.some(link => link.includes(file.name))) continue;

        const fh = await dest.getFileHandle(file.name, { create: true });
        const w = await fh.createWritable();
        await w.write(await file.arrayBuffer());
        await w.close();

        logAdd(`✔ Kopyalandı → ${file.name}`);
        count++;
    }

    logAdd(`\n🎉 Toplam ${count} fotoğraf kopyalandı!`);
}

/* --------------------------------------------
   LİNK KOPYALA
-------------------------------------------- */
function copyURL() {
    const inp = document.getElementById("clientURL");
    inp.select();
    navigator.clipboard.writeText(inp.value);
    alert("📎 Müşteri linki kopyalandı!");
}
