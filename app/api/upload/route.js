import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { success: false, error: "Dosya alınamadı." },
                { status: 400 }
            );
        }

        const token = process.env.BLOB_READ_WRITE_TOKEN;

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Blob token bulunamadı (ENV eksik)" },
                { status: 500 }
            );
        }

        // ---- Dosyayı Buffer olarak oku ----
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ---- VERCEL BLOB V1 ----
        const upload = await fetch("https://blob.vercel-storage.com/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "x-vercel-filename": file.name,
            },
            body: buffer
        });

        const data = await upload.json();

        if (!data || !data.url) {
            return NextResponse.json(
                { success: false, error: data.error || "Blob API yanıtı geçersiz" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: data.url,
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
