document.getElementById("uploadBtn").addEventListener("click", async () => {
    const fileInput = document.getElementById("fileInput");
    const logBox = document.getElementById("log");

    if (!fileInput.files.length) {
        logBox.value += "Lütfen bir dosya seçin.\n";
        return;
    }

    const file = fileInput.files[0];
    logBox.value += `Yükleniyor: ${file.name}\n`;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            // 🔥 ZORUNLU — Chrome’un yeni politikası
            duplex: "half"
        });

        const result = await response.json();

        if (!response.ok) {
            logBox.value += `HATA → Sunucu hatası: ${result.error}\n`;
            return;
        }

        logBox.value += `Başarılı → ${result.url}\n`;
    } catch (err) {
        logBox.value += `HATA → ${err.message}\n`;
    }
});
