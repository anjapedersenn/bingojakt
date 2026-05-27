import { useState } from 'react'

interface Props {
  onComplete: () => void
}

const STEPS = [
  {
    emoji: '🍇',
    title: 'Velkommen til Bingojakt!',
    text: 'Dere skal løse oppgaver rundt på området, samle poeng og prøve å slå de andre lagene. Prøv å få fult bingobrett!',
    illustration: null,
  },
  {
    emoji: '🎯',
    title: 'Finn oppgavene',
    text: 'Brettet har 9 oppgaver fordelt på Quiz, Fysisk og Tenke. Rad 1 gir opptil 10p, rad 2 gir opptil 20p, rad 3 gir opptil 30p.',
    illustration: 'board',
  },
  {
    emoji: '⚠️',
    title: 'Kun ett forsøk!',
    text: 'Dere har bare én sjanse per oppgave — tenk før dere svarer! I oppgaver med flere felt som skal hukes av eller fylles inn fordeles poengene per oppgave (20p med 4 felt = 5p per riktig).',
    illustration: 'scoring',
  },
  {
    emoji: '🗺️',
    title: 'Kart og poengstilling',
    text: 'Bruk kartet for å finne oppgavene rundt på området. Noen oppgaver gir poeng automatisk og noen tildeles av admin. Sjekk leaderboardet for å se hvor dere ligger an — det oppdateres live!',
    illustration: 'map',
  },
]

function BoardIllustration() {
  const cells = [
    { type: 'empty' },
    { type: 'done' },
    { type: 'empty' },
    { type: 'pending' },
    { type: 'empty' },
    { type: 'empty' },
    { type: 'empty' },
    { type: 'empty' },
    { type: 'empty' },
  ]
  return (
    <div className="grid grid-cols-3 gap-1.5 w-40 mx-auto">
      {cells.map((cell, i) => (
        <div
          key={i}
          className={`h-12 rounded-lg flex items-center justify-center text-lg font-bold
            ${cell.type === 'done' ? 'bg-green-500 text-white' : ''}
            ${cell.type === 'pending' ? 'bg-orange-400 text-white' : ''}
            ${cell.type === 'empty' ? 'bg-[var(--color-card)] border border-[var(--color-border)]' : ''}
          `}
        >
          {cell.type === 'done' && '✓'}
          {cell.type === 'pending' && '⏳'}
        </div>
      ))}
    </div>
  )
}


function ScoringIllustration() {
  return (
    <div className="flex gap-3 justify-center">
      <div
        className="flex flex-col items-center gap-2 rounded-xl p-4 w-[120px]"
        style={{ background: 'var(--color-primary-light)' }}
      >
        <span className="text-3xl">🧠</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-primary-dark)' }}>Quiz</span>
        <span className="text-xs text-center" style={{ color: 'var(--color-primary-dark)' }}>Riktig = full poeng{'\n'}Feil = 0 poeng</span>
      </div>
      <div
        className="flex flex-col items-center gap-2 rounded-xl p-4 w-[120px]"
        style={{ background: 'var(--color-accent-light)' }}
      >
        <span className="text-3xl">📋</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--color-accent-dark)' }}>Fler-felts</span>
        <span className="text-xs text-center" style={{ color: 'var(--color-accent-dark)' }}>Poeng / antall felt per riktig svar</span>
      </div>
    </div>
  )
}

function MapIllustration() {
  return (
    <div className="flex gap-3 justify-center">
      <div
        className="flex flex-col items-center gap-2 rounded-xl p-4 w-[120px]"
        style={{ background: 'var(--color-primary-light)' }}
      >
        <span className="text-4xl">🗺️</span>
        <span className="text-xs font-medium text-center" style={{ color: 'var(--color-primary-dark)' }}>
          Finn stasjonene
        </span>
      </div>
      <div
        className="flex flex-col items-center gap-2 rounded-xl p-4 w-[120px]"
        style={{ background: 'var(--color-accent-light)' }}
      >
        <span className="text-4xl">🏆</span>
        <span className="text-xs font-medium text-center" style={{ color: 'var(--color-accent-dark)' }}>
          Følg stillingen
        </span>
      </div>
    </div>
  )
}

export default function OnboardingGuide({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const total = STEPS.length
  const current = STEPS[step]
  const isLast = step === total - 1

  const transition = (callback: () => void) => {
    setVisible(false)
    setTimeout(() => {
      callback()
      setVisible(true)
    }, 200)
  }

  const goNext = () => {
    if (isLast) {
      transition(onComplete)
    } else {
      transition(() => setStep(s => s + 1))
    }
  }

  const skip = () => {
    setVisible(false)
    setTimeout(onComplete, 200)
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex justify-center overflow-y-auto"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-[430px] min-h-screen flex flex-col px-6 pt-12 pb-10">
        {/* Hopp over */}
        <div className="flex justify-end mb-6">
          <button
            onClick={skip}
            className="text-sm text-[var(--color-muted)] cursor-pointer bg-transparent font-[inherit] border-none p-0"
          >
            Hopp over
          </button>
        </div>

        {/* Step content */}
        <div
          className="flex flex-col items-center text-center flex-1 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div className="text-6xl mt-4">{current.emoji}</div>

          {current.illustration === 'board' && <BoardIllustration />}
          {current.illustration === 'scoring' && <ScoringIllustration />}
          {current.illustration === 'map' && <MapIllustration />}

          <div className="flex flex-col gap-3 max-w-[300px]">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-primary-dark)' }}>
              {current.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {current.text}
            </p>
          </div>
        </div>

        {/* Dots + button */}
        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex gap-2 items-center">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-200"
                style={{
                  width: i === step ? '16px' : '8px',
                  background: i === step ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="w-full py-4 rounded-xl text-base font-semibold text-white cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: 'var(--color-primary)' }}
          >
            {isLast ? 'La oss jakte! 🍇' : 'Neste →'}
          </button>
        </div>
      </div>
    </div>
  )
}
