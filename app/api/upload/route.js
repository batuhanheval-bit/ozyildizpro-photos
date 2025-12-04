// test deploy
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // TOKEN OKUNUYOR MU KONTROL
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        console.log("TOKEN:", token ? "VAR" : "YOK!");

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Sunucu: Blob token bulunamadı (ENV eksik).",
                },
                { status: 500 }
            );
        }

        // FORM VERİSİNİ AL
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Dosya bulunamadı.",
                },
                { status: 400 }
            );
        }

        // Dosyayı Vercel Blob’a yükle
        const uploadRes = await fetch("https://api.vercel.com/v2/blob", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: file.stream(),
        });

        const data = await uploadRes.json();

        if (!uploadRes.ok) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Vercel Blob hatası: " + (data.error?.message || "Bilinmeyen hata"),
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: data.url,
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                error: "Sunucu hatası: " + err.message,
            },
            { status: 500 }
        );
    }
}
