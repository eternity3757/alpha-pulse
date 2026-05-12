import { NextResponse } from "next/server";

async function fetchYahooPrice(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  const result = data?.chart?.result?.[0];

  const price = result?.meta?.regularMarketPrice;
  const name = result?.meta?.shortName || symbol;

  if (!price) return null;

  return {
    symbol,
    name,
    price: Math.round(price).toLocaleString("ko-KR"),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "종목코드가 없습니다." },
      { status: 400 }
    );
  }

  const kospi = await fetchYahooPrice(`${code}.KS`);
  if (kospi) return NextResponse.json(kospi);

  const kosdaq = await fetchYahooPrice(`${code}.KQ`);
  if (kosdaq) return NextResponse.json(kosdaq);

  return NextResponse.json(
    { error: "현재가를 찾을 수 없습니다." },
    { status: 404 }
  );
}