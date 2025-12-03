import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        if (!file) return NextResponse.json({ success: false, error: "Dosya yok" });
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        const upload = await put(file.name, file, { access: "public", token });
        return NextResponse.json({ success: true, url: upload.url });
    } catch (e) {
        return NextResponse.json({ success: false, error: e.message });
    }
}