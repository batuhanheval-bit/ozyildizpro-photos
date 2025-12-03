function addLog(text) {
    const logBox = document.getElementById("logBox");
    logBox.value += text + "\n";
}

// Tek foto yükleme
document.getElementById("uploadSingleBtn").addEventListener("click", async () => {
    const file = document.getElementById("singlePhoto").files[0];
    if (!file) {
        addLog("Fotoğraf seçilmedi.");
        return;
    }

    addLog("Yükleniyor: " + file.name);
    try {
        const url = await uploadPhoto(file);
        addLog("Yüklendi → " + url);
    } catch (err) {
        addLog("HATA → " + err.message);
    }
});

// Klasör yükleme
document.getElementById("uploadFolderBtn").addEventListener("click", async () => {
    const files = document.getElementById("folderInput").files;

    if (files.length === 0) {
        addLog("Klasör seçilmedi.");
        return;
    }

    for (const file of files) {
        addLog("Yükleniyor: " + file.name);
        try {
            const url = await uploadPhoto(file);
            addLog("Yüklendi → " + url);
        } catch (err) {
            addLog("HATA → " + err.message);
        }
    }
});

// Link kopyala
document.getElementById("copyLinkBtn").addEventListener("click", () => {
    const link = document.getElementById("customerLink").value;
    navigator.clipboard.writeText(link);
    addLog("Müşteri linki kopyalandı.");
});

// Kod yapıştır
document.getElementById("pasteCodesBtn").addEventListener("click", async () => {
    const text = await navigator.clipboard.readText();
    document.getElementById("selectionCodes").value = text;
    addLog("Kodlar yapıştırıldı.");
});
