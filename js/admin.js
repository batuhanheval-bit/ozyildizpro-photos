/* ---------------------------------------------------
   FOTOĞRAFLARI ZIP OLARAK GÖNDERME (TOKEN YOK!)
--------------------------------------------------- */

// ZIP oluşturmak için JSZip kullanacağız (admin panel EXE'de çalışacak)
async function uploadPhotos() {
    const rawCustomer = document.getElementById("customerName").value.trim();
    const files = document.getElementById("folderInput").files;
    const log = document.getElementById("log");

    if (!rawCustomer) return alert("⚠ Müşteri adını yaz!");
    if (!files.length) return logAdd("❌ Fotoğraf klasörü seçilmedi!");

    const safeCustomer = rawCustomer
        .normalize("NFKD")
        .replace(/[^\w]/g, "")
        .toLowerCase();

    logAdd(`📁 ZIP hazırlanıyor → ${safeCustomer}`);

    // ZIP oluştur
    const zip = new JSZip();

    for (const file of files) {
        if (!/\.(jpg|jpeg|png|raw|arw)$/i.test(file.name)) continue;

        const data = await file.arrayBuffer();
        zip.file(file.name, data);
    }

    // Base64 olarak al
    const zipBase64 = await zip.generateAsync({ type: "base64" });

    logAdd(`📦 ZIP hazır! GitHub’a gönderiliyor...`);

    // GitHub Actions çalıştır
    await fetch(`https://api.github.com/repos/batuhanheval-bit/ozyildizpro-photos/actions/workflows/upload-zip.yml/dispatches`, {
        method: "POST",
        headers: {
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ref: "main",
            inputs: {
                customer: safeCustomer,
                zipfile: zipBase64
            }
        })
    });

    logAdd("🎉 ZIP gönderildi!");
    document.getElementById("clientURL").value =
        `${window.location.origin}/client.html?user=${safeCustomer}`;
}

/* ---------------------------------------------------
   LOG FONKSİYONU
--------------------------------------------------- */
function logAdd(msg) {
    const log = document.getElementById("log");
    log.value += msg + "\n";
}

/* ---------------------------------------------------
   SEÇİM KODLARI OKU
--------------------------------------------------- */
let selectedList = [];

function processPastedCodes() {
    const text = document.getElementById("pasteInput").value.trim();
    if (!text) return alert("⚠ Kod yapıştırmadın!");

    selectedList = text.split(/\r?\n/).filter(Boolean);
    logAdd(`✔ ${selectedList.length} kod işlendi`);
}

/* ---------------------------------------------------
   EŞLEŞEN FOTOĞRAFLARI KOPYALA
--------------------------------------------------- */
async function matchAndCopy() {
    const files = document.getElementById("localFolder").files;
    const log = document.getElementById("log");

    if (!selectedList.length) return alert("⚠ Önce kodları yapıştır!");
    if (!files.length) return alert("⚠ Fotoğraf klasörü seç!");

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

    logAdd(`🎉 Toplam ${count} fotoğraf kopyalandı!`);
}

/* ---------------------------------------------------
   LİNK KOPYALA
--------------------------------------------------- */
function copyURL() {
    const inp = document.getElementById("clientURL");
    inp.select();
    navigator.clipboard.writeText(inp.value);
    alert("📎 Müşteri linki kopyalandı!");
}
