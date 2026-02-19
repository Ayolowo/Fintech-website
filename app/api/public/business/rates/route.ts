import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const url = new URL(`${process.env.API_BASE_URL}/public/business/rates`);
    // Copy all query params
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Public endpoint - no auth required, but still add X-APP-KEY
    const response = await fetch(url.toString(), {
      headers: {
        'X-APP-KEY': process.env.APP_KEY!,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
