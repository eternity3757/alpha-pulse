import { NextResponse } from "next/server";

const KIS_BASE_URL = "https://openapi.koreainvestment.com:9443";

async function getKisAccessToken() {
  const appKey = process.env.KIS_APP_KEY;
  const appSecret = process.env.KIS_APP_SECRET;

  if (!appKey || !appSecret) {
    throw new Error("KIS_APP_KEY 또는 KIS_APP_SECRET이 없습니다.");
  }

  const res = await fetch(`${KIS_BASE_URL}/oauth2/tokenP`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: appKey,
      appsecret: appSecret,
    }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error(data.msg1 || "KIS 토큰 발급 실패");
  }

  return data.access_token as string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim();

  if (!code) {
    return NextResponse.json(
      { error: "종목코드를 입력하세요." },
      { status: 400 }
    );
  }

  try {
    const appKey = process.env.KIS_APP_KEY!;
    const appSecret = process.env.KIS_APP_SECRET!;
    const accessToken = await getKisAccessToken();

    const url =
      `${KIS_BASE_URL}/uapi/domestic-stock/v1/quotations/inquire-price` +
      `?fid_cond_mrkt_div_code=J&fid_input_iscd=${code}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json; charset=utf-8",
        authorization: `Bearer ${accessToken}`,
        appkey: appKey,
        appsecret: appSecret,
        tr_id: "FHKST01010100",
        custtype: "P",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || data.rt_cd !== "0") {
      return NextResponse.json(
        {
          error: data.msg1 || "현재가 조회 실패",
          raw: data,
        },
        { status: 500 }
      );
    }

    const output = data.output;

    return NextResponse.json({
      code,
      name: output.hts_kor_isnm,
      price: Number(output.stck_prpr),
      change: Number(output.prdy_vrss),
      changeRate: Number(output.prdy_ctrt),
      open: Number(output.stck_oprc),
      high: Number(output.stck_hgpr),
      low: Number(output.stck_lwpr),
      volume: Number(output.acml_vol),
      source: "KIS 한국투자증권 API",
      notice: "한국투자증권 OpenAPI 기준 국내주식 현재가입니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
