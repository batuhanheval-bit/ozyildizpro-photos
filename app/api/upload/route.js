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
                { success: false, error: "Token bulunamadı (ENV eksik)" },
                { status: 500 }
            );
        }

        // --- Dosyayı buffer olarak oku ---
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const upload = await fetch("https://api.vercel.com/v2/blobs", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": file.type
            },
            body: buffer
        });

        const data = await upload.json();

        if (!upload.ok) {
            return NextResponse.json(
                { success: false, error: data.error || "Yükleme hatası" },
                { status: upload.status }
            );
        }

        return NextResponse.json({
            success: true,
            url: data.url
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
