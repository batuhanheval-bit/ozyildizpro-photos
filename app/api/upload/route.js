import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // TOKEN'IN DOĞRU OKUNDUĞUNU GARANTİ EDİYORUZ
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    console.log("TOKEN:", token ? "VAR" : "YOK !!!");

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Sunucu: Blob token bulunamadı (ENV eksik)"
      }, { status: 500 });
    }

    const form = await req.formData();
    const file = form.get("file");

    const filename = `photos/${Date.now()}-${file.name}`;

    const blob = await put(filename, file, {
      access: "public",
      token: token
    });

    return NextResponse.json({
      success: true,
      url: blob.url
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: "Sunucu hatası: " + err.message
    }, { status: 500 });
  }
}
