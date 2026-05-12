"use client";

import { useEffect, useState } from "react";

type Holding = {
  name: string;
  code: string;
  avgPrice: string;
  quantity: string;
  currentPrice: string;
  profit: string;
  isProfit: boolean;
  score: number;
  status: string;
  comment: string;
};

const mockPriceMap: Record<string, string> = {
  "005930": "75,000", // 삼성전자
  "030530": "38,000", // 원익홀딩스
  "007660": "48,500", // 이수페타시스
  "078600": "182,800", // 대주전자재료
  "298040": "420,000", // 효성중공업
};

const defaultHoldings: Holding[] = [
  {
    name: "원익홀딩스",
    code: "030530",
    avgPrice: "34,250",
    quantity: "30",
    currentPrice: "38,000",
    profit: "+10.9%",
    isProfit: true,
    score: 92,
    status: "추세 유지",
    comment: "외인 수급 개선 시 추가 상승 가능성",
  },
  {
    name: "이수페타시스",
    code: "007660",
    avgPrice: "42,000",
    quantity: "20",
    currentPrice: "48,500",
    profit: "+15.5%",
    isProfit: true,
    score: 88,
    status: "단기 과열",
    comment: "AI 서버 모멘텀 지속, 단기 변동성 주의",
  },
];

function formatNumber(value: string) {
  const number = Number(value.replaceAll(",", ""));
  if (!number) return "";
  return number.toLocaleString("ko-KR");
}

function calculateProfit(avgPrice: string, currentPrice: string) {
  const avg = Number(avgPrice.replaceAll(",", ""));
  const current = Number(currentPrice.replaceAll(",", ""));

  if (!avg || !current) return { profit: "계산 대기", isProfit: true };

  const rate = ((current - avg) / avg) * 100;
  const sign = rate >= 0 ? "+" : "";

  return {
    profit: `${sign}${rate.toFixed(1)}%`,
    isProfit: rate >= 0,
  };
}

function getMockCurrentPrice(code: string) {
  return mockPriceMap[code] || "50,000";
}

function getAutoStatus(profit: string) {
  const rate = Number(profit.replace("%", ""));

  if (rate >= 80) return "고수익 구간";
  if (rate >= 30) return "추세 강화";
  if (rate >= 10) return "추세 유지";
  if (rate <= -10) return "지지선 주의";
  if (rate < 0) return "약세 구간";

  return "분석 대기";
}

function getAutoComment(status: string) {
  if (status === "고수익 구간") {
    return "큰 수익 이후 변동성 확대 가능성, 분할 매도 전략 점검";
  }

  if (status === "추세 강화") {
    return "수익 구간 진입, 추세 유지 여부 확인";
  }

  if (status === "추세 유지") {
    return "상승 흐름 유지 중, 시장 급변 시 알림 확인";
  }

  if (status === "지지선 주의") {
    return "손실 확대 구간, 지지선 이탈 여부 확인 필요";
  }

  if (status === "약세 구간") {
    return "단기 약세 흐름, 추가 매수보다는 관망 우선";
  }

  return "실시간 데이터 연결 후 AI 분석 예정";
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(defaultHoldings);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("holdings");

    if (saved) {
      setHoldings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("holdings", JSON.stringify(holdings));
  }, [holdings]);

  function fetchCurrentPrice() {
    if (!code) return;

    const price = getMockCurrentPrice(code);
    setCurrentPrice(price);
  }

  function addHolding() {
    if (!name || !code || !avgPrice || !quantity) return;

    const price = currentPrice || getMockCurrentPrice(code);
    const calculated = calculateProfit(avgPrice, price);
    const status = getAutoStatus(calculated.profit);

    const newHolding: Holding = {
      name,
      code,
      avgPrice: formatNumber(avgPrice),
      quantity,
      currentPrice: price,
      profit: calculated.profit,
      isProfit: calculated.isProfit,
      score: 75,
      status,
      comment: getAutoComment(status),
    };

    setHoldings([newHolding, ...holdings]);
    setName("");
    setCode("");
    setAvgPrice("");
    setQuantity("");
    setCurrentPrice("");
  }

  function removeHolding(targetCode: string) {
    setHoldings(holdings.filter((stock) => stock.code !== targetCode));
  }

  function resetHoldings() {
    localStorage.removeItem("holdings");
    setHoldings(defaultHoldings);
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">📒 매매일지</h1>
            <p className="text-zinc-400">
              종목코드 기반으로 현재가를 불러오고 수익률을 자동 계산합니다.
            </p>
          </div>

          <button
            onClick={resetHoldings}
            className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 hover:bg-zinc-900"
          >
            기본값으로 초기화
          </button>
        </div>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <h2 className="mb-4 text-2xl font-bold">➕ 보유종목 추가</h2>

          <div className="grid gap-3 md:grid-cols-6">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="종목명"
              className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
            />

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="종목코드"
              className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
            />

            <input
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              placeholder="평단"
              className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
            />

            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="수량"
              className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
            />

            <button
              onClick={fetchCurrentPrice}
              className="rounded-xl border border-green-700 px-4 py-3 font-bold text-green-300 hover:bg-green-950"
            >
              현재가 불러오기
            </button>

            <button
              onClick={addHolding}
              className="rounded-xl bg-white px-4 py-3 font-bold text-black hover:bg-zinc-200"
            >
              추가
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-black/40 p-4">
            <p className="text-sm text-zinc-500">불러온 현재가</p>
            <p className="mt-1 text-2xl font-bold text-green-300">
              {currentPrice ? `${currentPrice}원` : "아직 불러오지 않음"}
            </p>
          </div>

          <p className="mt-3 text-sm text-zinc-500">
            현재는 테스트용 더미 가격입니다. 다음 단계에서 실제 API로 교체합니다.
          </p>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">등록 종목</p>
            <h2 className="mt-2 text-3xl font-bold">{holdings.length}개</h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">저장 상태</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">자동 저장</h2>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">현재가 연동</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-300">테스트 모드</h2>
          </div>
        </section>

        <section className="grid gap-4">
          {holdings.map((stock) => (
            <article
              key={stock.code}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{stock.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    종목코드 {stock.code}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    평단 {stock.avgPrice}원 · 수량 {stock.quantity}주 · 현재가{" "}
                    {stock.currentPrice}원
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-xl px-4 py-2 font-bold ${
                      stock.isProfit
                        ? "bg-green-950 text-green-300"
                        : "bg-red-950 text-red-300"
                    }`}
                  >
                    {stock.profit}
                  </span>

                  <span className="rounded-xl bg-zinc-900 px-4 py-2 text-zinc-300">
                    AI {stock.score}
                  </span>

                  <button
                    onClick={() => removeHolding(stock.code)}
                    className="rounded-xl bg-red-900 px-4 py-2 font-bold text-white hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-black/40 p-4">
                  <p className="text-sm text-zinc-500">현재 상태</p>
                  <p className="mt-1 font-bold text-yellow-300">
                    {stock.status}
                  </p>
                </div>

                <div className="rounded-xl bg-black/40 p-4">
                  <p className="text-sm text-zinc-500">AI 분석</p>
                  <p className="mt-1 font-semibold">💬 {stock.comment}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}