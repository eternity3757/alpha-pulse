export default function Home() {
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-4xl font-bold">📊 AI 투자 어시스턴트</h1>
        <p className="mb-8 text-zinc-400">
          대세 상승 후보 탐지 · 매수/매도 알림 · 시장 위험 경고
        </p>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">시장 위험도</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-300">보통</h2>
            <p className="mt-3 text-sm text-zinc-400">
              나스닥 변동성 확대 감지. 단기 조정 가능성 확인 필요.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">오늘의 강세 테마</p>
            <h2 className="mt-2 text-3xl font-bold text-green-400">
              AI · 전력 · 로봇
            </h2>
            <p className="mt-3 text-sm text-zinc-400">
              산업 성장성과 수급이 겹치는 구간 중심으로 감시.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-sm text-zinc-500">알림 상태</p>
            <h2 className="mt-2 text-3xl font-bold text-red-400">3건 발생</h2>
            <p className="mt-3 text-sm text-zinc-400">
              보유종목 리스크와 시장 급변 신호를 확인하세요.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}