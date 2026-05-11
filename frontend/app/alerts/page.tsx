export default function AlertsPage() {
  const alerts = [
    {
      level: "⚠️ 주의 신호",
      stock: "이수페타시스",
      trigger: "나스닥 -2% 이상 급락 · RSI 78 과열구간",
      action: "단기 조정 가능성, 일부 매도 고려",
      color: "border-yellow-700 bg-yellow-950/40",
    },
    {
      level: "🚨 매도 경고",
      stock: "대주전자재료",
      trigger: "외인 3일 연속 순매도 · 거래량 급감 · 지지선 이탈",
      action: "상승 추세 약화, 절반 매도 검토",
      color: "border-red-800 bg-red-950/50",
    },
    {
      level: "🆘 긴급 시장 신호",
      stock: "전체 보유종목",
      trigger: "코스피 -5% · 환율 급등 · 지정학 리스크 확대",
      action: "전량 매도 또는 현금 비중 확대 고려",
      color: "border-red-600 bg-red-950",
    },
    {
      level: "🚀 매수 관심 신호",
      stock: "원익홀딩스",
      trigger: "외인 5일 순매수 · 거래량 증가 · 장기 박스권 돌파 시도",
      action: "대세 상승 초기 가능성, 분할매수 관심",
      color: "border-green-800 bg-green-950/40",
    },
  ];

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-4xl font-bold">🔔 실시간 알림</h1>
        <p className="mb-8 text-zinc-400">
          매수 기회, 매도 위험, 시장 급변 신호를 한눈에 확인합니다.
        </p>

        <div className="grid gap-4">
          {alerts.map((alert) => (
            <article
              key={alert.level + alert.stock}
              className={`rounded-2xl border p-5 ${alert.color}`}
            >
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold">{alert.level}</h2>
                <span className="rounded-full bg-black/40 px-4 py-2 text-sm">
                  {alert.stock}
                </span>
              </div>

              <p className="text-sm text-zinc-300">
                <span className="font-bold text-white">트리거: </span>
                {alert.trigger}
              </p>

              <p className="mt-4 text-lg font-semibold">💬 {alert.action}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}