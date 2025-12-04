document.addEventListener("DOMContentLoaded", () => {
    const uploadBtn = document.getElementById("uploadBtn");

    if (!uploadBtn) {
        console.error("uploadBtn bulunamadı!");
        return;
    }

    uploadBtn.addEventListener("click", () => {
        console.log("Upload butonuna basıldı.");
    });
});
