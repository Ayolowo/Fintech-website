import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    const url = new URL(`${process.env.API_BASE_URL}/public/business/channels`);
    if (country) {
      url.searchParams.set('country', country);
    }

    // Proxy to backend with server-side secrets
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': authHeader,
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
