import type { QuizQuestion } from '@/types/content'

export interface SimResults {
  score: number
  total: number
  timeTakenMs: number
  answers: { questionId: string; selectedId: string | null; correct: boolean }[]
  questions: QuizQuestion[]
  topicBreakdown: Record<string, { correct: number; total: number }>
}

export function printSimReport(results: SimResults): void {
  const { score, total, timeTakenMs, answers, questions, topicBreakdown } = results
  const pct = Math.round((score / total) * 100)
  const mins = Math.floor(timeTakenMs / 60000)
  const secs = Math.floor((timeTakenMs % 60000) / 1000)
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const passed = pct >= 70

  const wrongAnswers = answers
    .filter(a => !a.correct)
    .map(a => {
      const q = questions.find(q => q.id === a.questionId)!
      const selected = q.options.find(o => o.id === a.selectedId)
      const correct = q.options.find(o => o.isCorrect)!
      return { q, selected, correct }
    })

  const topicRows = Object.entries(topicBreakdown)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
    .map(([tid, { correct, total }]) => {
      const p = Math.round((correct / total) * 100)
      return `<tr><td>${tid.replace(/-/g, ' ')}</td><td>${correct}/${total}</td><td style="color:${p >= 70 ? 'green' : p >= 40 ? 'orange' : 'red'}">${p}%</td></tr>`
    }).join('')

  const wrongHtml = wrongAnswers.map(({ q, selected, correct }) => `
    <div class="wrong-item">
      <p class="question">${q.question}</p>
      ${selected ? `<p class="wrong">✗ Your answer: ${selected.text}</p>` : ''}
      <p class="right">✓ Correct: ${correct.text}</p>
      <p class="exp">${q.explanation}</p>
    </div>
  `).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>JavaHub — Interview Simulation Results</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 32px; color: #111; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
  .score-box { border: 2px solid #4f46e5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px; }
  .score-big { font-size: 48px; font-weight: bold; color: #4f46e5; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 13px;
    background: ${passed ? '#d1fae5' : '#fee2e2'}; color: ${passed ? '#065f46' : '#991b1b'}; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-size: 13px; }
  td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
  h2 { font-size: 16px; margin: 28px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .wrong-item { margin-bottom: 20px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; }
  .question { font-weight: 600; margin: 0 0 6px; font-size: 13px; }
  .wrong { color: #dc2626; font-size: 13px; margin: 2px 0; }
  .right { color: #16a34a; font-size: 13px; margin: 2px 0; }
  .exp { color: #6b7280; font-size: 12px; margin: 6px 0 0; }
  @media print { body { padding: 16px; } }
</style>
</head>
<body>
  <h1>JavaHub — Interview Simulation Results</h1>
  <p class="subtitle">Generated ${date}</p>

  <div class="score-box">
    <div class="score-big">${score} / ${total}</div>
    <div style="font-size:20px; margin: 4px 0">${pct}%</div>
    <span class="badge">${passed ? 'PASSED' : 'NEEDS WORK'}</span>
    <div style="color:#666; font-size:13px; margin-top:8px">Time: ${mins}m ${secs}s</div>
  </div>

  <h2>Score Breakdown by Topic</h2>
  <table>
    <tr><th>Topic</th><th>Correct</th><th>Score</th></tr>
    ${topicRows}
  </table>

  ${wrongAnswers.length > 0 ? `<h2>Wrong Answers (${wrongAnswers.length})</h2>${wrongHtml}` : '<p style="color:green">Perfect score — no wrong answers!</p>'}

  <h2>Recommended Study Areas</h2>
  <ul>
    ${Object.entries(topicBreakdown)
      .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
      .slice(0, 3)
      .map(([tid]) => `<li>${tid.replace(/-/g, ' ')}</li>`)
      .join('')}
  </ul>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}
