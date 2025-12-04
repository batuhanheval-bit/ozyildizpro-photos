document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("fileInput");
    const logBox = document.getElementById("log");

    function log(msg) {
        logBox.value += msg + "\n";
    }

    uploadBtn.addEventListener("click", async () => {
        if (!fileInput.files.length) {
            log("⚠️ Lütfen bir dosya seçin.");
            return;
        }

        const file = fileInput.files[0];
        log("Yükleniyor: " + file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                log("❌ HATA → " + JSON.stringify(result));
                return;
            }

            log("✅ BAŞARILI → " + result.url);

        } catch (err) {
            log("❌ HATA → " + err.message);
        }
    });
});
