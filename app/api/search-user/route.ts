import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const current_wallet = searchParams.get('current_wallet');

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const params = new URLSearchParams({ name });
    if (current_wallet) params.set('current_wallet', current_wallet);

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/search-user?${params.toString()}`,
      {
        headers: {
          'Authorization': authHeader,
          'X-APP-KEY': process.env.APP_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

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
