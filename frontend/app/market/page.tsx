export default function MarketPage() {
  const marketData = [
    {
      title: "미국 나스닥",
      value: "-1.82%",
      status: "주의",
      color: "text-red-400",
    },
    {
      title: "외국인 수급",
      value: "+2,341억",
      status: "긍정",
      color: "text-green-400",
    },
    {
      title: "코스피 위험도",
      value: "보통",
      status: "중립",
      color: "text-yellow-300",
    },
  ];

  const themes = [
    {
      name: "AI 반도체",
      description: "엔비디아·AI 서버 투자 확대",
    },
    {
      name: "전력 인프라",
      description: "미국 전력 부족 및 변압기 수요 증가",
    },
    {
      name: "로봇",
      description: "휴머노이드 및 자동화 투자 확대",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            📈 시장 분석
          </h1>

          <p className="text-zinc-400">
            글로벌 시장 흐름 및 핵심 테마 분석
          </p>
        </div>

        {/* 시장 현황 */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">
            🌍 글로벌 시장 현황
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {marketData.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <p className="text-sm text-zinc-500">
                  {item.title}
                </p>

                <h3 className={`mt-3 text-3xl font-bold ${item.color}`}>
                  {item.value}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  상태: {item.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 강세 테마 */}
        <section>
          <h2 className="mb-4 text-2xl font-bold">
            🔥 현재 강세 테마
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {themes.map((theme) => (
              <div
                key={theme.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <h3 className="mb-3 text-2xl font-bold text-green-400">
                  {theme.name}
                </h3>

                <p className="text-zinc-400">
                  {theme.description}
                </p>

                <button className="mt-5 w-full rounded-xl bg-white py-3 font-bold text-black hover:bg-zinc-200">
                  관련 종목 보기
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}