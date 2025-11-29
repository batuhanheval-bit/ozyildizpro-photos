/* --------------------------------------------
   GITHUB AYARLARI
-------------------------------------------- */
const GITHUB_TOKEN = "";
const REPO_OWNER = "batuhanheval-bit";
const REPO_NAME = "ozyildizpro-photos";

/* --------------------------------------------
   FOTOĞRAF YÜKLEME — STABLE SÜRÜM
-------------------------------------------- */
async function uploadPhotos() {
    console.log("uploadPhotos çalıştı!");

    const rawCustomer = document.getElementById("customerName").value.trim();
    const files = document.getElementById("folderInput").files;
    const log = document.getElementById("log");

    if (!rawCustomer) return alert("⚠ Müşteri adını yaz!");
    if (!files.length) return log.value += "❌ Fotoğraf klasörü seçilmedi!\n";

    /* 🔥 KRİTİK FIX — TÜM KARAKTER TEMİZLEME */
    const safeCustomer = rawCustomer
        .normalize("NFKD")
        .replace(/[^\w]/g, "")  // sadece A-Z 0-9 altçizgiyi bırak
        .replace(/_/g, "")      // altçizgi bile kalmasın
        .toLowerCase()          // küçük harfe çevir
        .trim();

    log.value += `\n📁 Müşteri klasörü: ${safeCustomer}\n`;

    for (const file of files) {
        if (!/\.(jpg|jpeg|png|raw|arw)$/i.test(file.name)) continue;

        log.value += `⏳ Yükleniyor → ${file.name}\n`;

        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        bytes.forEach(b => binary += String.fromCharCode(b));
        const base64 = btoa(binary);

        /* 🔥 %100 DOĞRU PATH */
        const path = `photos/${safeCustomer}/${file.name}`;

        const apiURL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

        let sha = undefined;

        const check = await fetch(apiURL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        if (check.ok) {
            const json = await check.json();
            sha = json.sha;
        }

        const upload = await fetch(apiURL, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Upload (${safeCustomer})`,
                content: base64,
                sha: sha
            })
        });

        if (!upload.ok) {
            log.value += `❌ HATA → ${file.name}\n`;
        }
    }

    log.value += "\n✔ TÜM FOTOĞRAFLAR GITHUB'A YÜKLENDİ!\n";

    document.getElementById("clientURL").value =
        `${window.location.origin}/client.html?user=${safeCustomer}`;
}

/* --------------------------------------------
   SEÇİM KODLARI OKU
-------------------------------------------- */
let selectedList = [];

function processPastedCodes() {
    const text = document.getElementById("pasteInput").value.trim();
    const log = document.getElementById("log");

    if (!text) return alert("⚠ Kod yapıştırmadın!");

    selectedList = text.split(/\r?\n/).filter(Boolean);
    log.value += `✔ ${selectedList.length} kod işlendi\n`;
}

/* --------------------------------------------
   EŞLEŞEN FOTOĞRAFLARI TOPLA
-------------------------------------------- */
async function matchAndCopy() {
    const log = document.getElementById("log");

    if (!selectedList.length) return alert("⚠ Önce kodları yapıştır!");
    const files = document.getElementById("localFolder").files;
    if (!files.length) return alert("⚠ Bilgisayardaki fotoğraf klasörünü seç!");

    const root = await window.showDirectoryPicker();
    const dest = await root.getDirectoryHandle("Secilenler", { create: true });

    let count = 0;

    for (const file of files) {
        if (!selectedList.some(link => link.includes(file.name))) continue;

        const fileHandle = await dest.getFileHandle(file.name, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(await file.arrayBuffer());
        await writable.close();

        log.value += `✔ Kopyalandı → ${file.name}\n`;
        count++;
    }

    log.value += `\n🎉 Toplam ${count} fotoğraf kopyalandı!\n`;
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
