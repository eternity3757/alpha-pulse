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

  function addHolding() {
    if (!name || !code || !avgPrice || !quantity || !currentPrice) return;

    const calculated = calculateProfit(avgPrice, currentPrice);

    const newHolding: Holding = {
      name,
      code,
      avgPrice,
      quantity,
      currentPrice,
      profit: calculated.profit,
      isProfit: calculated.isProfit,
      score: 75,
      status: "분석 대기",
      comment: "종목코드 기반 실시간 현재가 연결 예정",
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
              보유 종목을 등록하고 수익률, 상태, AI 분석을 관리합니다.
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

            <input
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              placeholder="현재가"
              className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none"
            />

            <button
              onClick={addHolding}
              className="rounded-xl bg-white px-4 py-3 font-bold text-black hover:bg-zinc-200"
            >
              추가
            </button>
          </div>

          <p className="mt-3 text-sm text-zinc-500">
            입력한 종목은 브라우저에 자동 저장됩니다. 새로고침해도 유지됩니다.
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
            <h2 className="mt-2 text-3xl font-bold text-yellow-300">준비 중</h2>
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