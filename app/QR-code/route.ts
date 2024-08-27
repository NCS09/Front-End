// app/qr-code/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const data = url.searchParams.get('data') || '';

    return NextResponse.json({ data });
}
