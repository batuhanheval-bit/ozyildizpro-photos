async function uploadPhoto(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error || "Yükleme hatası");
    }

    return data.url;
}
