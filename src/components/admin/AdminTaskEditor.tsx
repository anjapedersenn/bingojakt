import { useState } from 'react'
import type { Task, TaskType } from '../../types'

interface Props {
  initialTask: Task | null
  onSave: (task: Task) => void
  onCancel: () => void
}

interface FieldPair {
  label: string
  answer: string
  options: string[] | null    // null = text field, string[4] = multiple choice
  correctIndex: number        // index into options of correct answer
}

function toFieldPairs(fields: Task['fields']): FieldPair[] {
  if (!fields || fields.length === 0) return [{ label: '', answer: '', options: null, correctIndex: 0 }]
  return fields.map(f => {
    if (f.options && f.options.length === 4) {
      const idx = f.options.indexOf(f.answer ?? '')
      return {
        label: f.label,
        answer: f.answer ?? '',
        options: [...f.options],
        correctIndex: idx >= 0 ? idx : 0,
      }
    }
    return { label: f.label, answer: f.answer ?? '', options: null, correctIndex: 0 }
  })
}

export default function AdminTaskEditor({ initialTask, onSave, onCancel }: Props) {
  const [id, setId] = useState(initialTask?.id ?? '')
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [col, setCol] = useState<number>(initialTask?.col ?? 0)
  const [row, setRow] = useState<number>(initialTask?.row ?? 0)
  const [pts, _setPts] = useState<number>(initialTask?.pts ?? 10)
  const [type, setType] = useState<TaskType>(initialTask?.type ?? 'quiz')
  const [question, setQuestion] = useState(initialTask?.question ?? '')
  const [answer, setAnswer] = useState(initialTask?.answer ?? '')
  const [hint, setHint] = useState(initialTask?.hint ?? '')
  const [fields, setFields] = useState<FieldPair[]>(toFieldPairs(initialTask?.fields))

  const inputClass =
    'w-full p-[10px] border-[0.5px] rounded-[8px] text-[14px] font-[inherit]'
  const inputStyle = {
    borderColor: 'var(--color-border)',
    background: 'var(--color-card)',
    color: 'inherit',
  }
  const labelClass = 'text-[13px] text-[var(--color-muted)] mb-[4px] block'

  const handleSave = () => {
    if (!id.trim() || !title.trim() || !question.trim()) {
      alert('Fyll inn ID, tittel og spørsmål.')
      return
    }

    const task: Task = {
      id: id.trim(),
      title: title.trim(),
      col: col as 0 | 1 | 2,
      row: row as 0 | 1 | 2,
      pts: pts as 10 | 20 | 30,
      type,
      question: question.trim(),
    }

    if (type === 'quiz') {
      if (answer.trim()) task.answer = answer.trim()
      if (hint.trim()) task.hint = hint.trim()
    }

    if (type === 'multi') {
      task.fields = fields
        .filter(f => f.label.trim())
        .map(f => {
          if (f.options) {
            return {
              label: f.label.trim(),
              answer: f.options[f.correctIndex]?.trim() || null,
              options: f.options,
            }
          }
          return {
            label: f.label.trim(),
            answer: f.answer.trim() || null,
          }
        })
    }

    onSave(task)
  }

  const toggleFieldType = (i: number) => {
    const next = [...fields]
    const f = next[i]
    if (f.options) {
      next[i] = { ...f, options: null, answer: '', correctIndex: 0 }
    } else {
      next[i] = { ...f, options: ['', '', '', ''], answer: '', correctIndex: 0 }
    }
    setFields(next)
  }

  const updateOption = (fieldIdx: number, optIdx: number, val: string) => {
    const next = [...fields]
    const opts = [...(next[fieldIdx].options ?? [])]
    opts[optIdx] = val
    next[fieldIdx] = { ...next[fieldIdx], options: opts }
    setFields(next)
  }

  const LETTERS = ['A', 'B', 'C', 'D']

  return (
    <div>
      <h3 className="text-[16px] font-semibold mb-3">
        {initialTask ? 'Rediger oppgave' : 'Ny oppgave'}
      </h3>

      <div className="mb-3">
        <label className={labelClass}>ID</label>
        <input className={inputClass} style={inputStyle} value={id} onChange={e => setId(e.target.value)} placeholder="f.eks. 1a" />
      </div>

      <div className="mb-3">
        <label className={labelClass}>Tittel</label>
        <input className={inputClass} style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Oppgavetittel" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass}>Kategori</label>
          <select className={inputClass} style={inputStyle} value={col} onChange={e => setCol(Number(e.target.value))}>
            <option value={0}>0 – Trivia</option>
            <option value={1}>1 – Fysisk</option>
            <option value={2}>2 – Brains</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Poeng</label>
          <select className={inputClass} style={inputStyle} value={row} onChange={e => setRow(Number(e.target.value))}>
            <option value={0}>0 – 10p</option>
            <option value={1}>1 – 20p</option>
            <option value={2}>2 – 30p</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className={labelClass}>Oppgavetype</label>
        <select className={inputClass} style={inputStyle} value={type} onChange={e => setType(e.target.value as TaskType)}>
          <option value="quiz">Quiz</option>
          <option value="multi">Fler-felt / Flervalg</option>
          <option value="admin">Admin bedømmer</option>
        </select>
      </div>

      <div className="mb-3">
        <label className={labelClass}>Spørsmål / beskrivelse</label>
        <textarea
          className={`${inputClass} resize-y min-h-[80px]`}
          style={inputStyle}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Skriv oppgaveteksten her"
        />
      </div>

      {type === 'quiz' && (
        <>
          <div className="mb-3">
            <label className={labelClass}>Fasitsvar</label>
            <input className={inputClass} style={inputStyle} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Riktig svar (normalisert)" />
          </div>
          <div className="mb-3">
            <label className={labelClass}>Hint (valgfri)</label>
            <input className={inputClass} style={inputStyle} value={hint} onChange={e => setHint(e.target.value)} placeholder="Hint til spillerne" />
          </div>
        </>
      )}

      {type === 'multi' && (
        <div className="mb-3">
          <div className={labelClass}>Felter</div>
          {fields.map((f, i) => (
            <div
              key={i}
              className="border-[0.5px] rounded-[8px] p-3 mb-2"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Header row: label + type toggle + delete */}
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 p-[10px] border-[0.5px] rounded-[8px] text-[14px] font-[inherit]"
                  style={inputStyle}
                  value={f.label}
                  onChange={e => {
                    const next = [...fields]
                    next[i] = { ...next[i], label: e.target.value }
                    setFields(next)
                  }}
                  placeholder={`Felt ${i + 1} navn`}
                />
                <button
                  type="button"
                  onClick={() => toggleFieldType(i)}
                  className="px-[10px] border-[0.5px] rounded-[8px] text-[13px] cursor-pointer font-[inherit] whitespace-nowrap"
                  style={{
                    borderColor: f.options ? 'var(--color-primary)' : 'var(--color-border)',
                    color: f.options ? 'var(--color-primary)' : 'var(--color-muted)',
                    background: 'var(--color-card)',
                  }}
                >
                  {f.options ? 'Flervalg' : 'Tekstfelt'}
                </button>
                <button
                  type="button"
                  onClick={() => setFields(fields.filter((_, j) => j !== i))}
                  className="p-[10px] border-[0.5px] rounded-[8px] text-[14px] cursor-pointer font-[inherit] bg-transparent text-[var(--color-muted)]"
                  style={{ borderColor: 'var(--color-border)' }}
                  disabled={fields.length === 1}
                >
                  ✕
                </button>
              </div>

              {/* Text field answer */}
              {!f.options && (
                <input
                  className={inputClass}
                  style={inputStyle}
                  value={f.answer}
                  onChange={e => {
                    const next = [...fields]
                    next[i] = { ...next[i], answer: e.target.value }
                    setFields(next)
                  }}
                  placeholder="Fasit (tom = ingen sjekk)"
                />
              )}

              {/* Multiple choice options */}
              {f.options && (
                <div className="mt-1 space-y-1">
                  <div className="text-[12px] text-[var(--color-muted)] mb-2">
                    Fyll inn 4 alternativer — trykk ✓ for å markere riktig svar
                  </div>
                  {LETTERS.map((letter, optIdx) => {
                    const isCorrect = f.correctIndex === optIdx
                    return (
                      <div key={optIdx} className="flex gap-2 items-center">
                        <span
                          className="text-[13px] font-semibold w-5 text-center shrink-0"
                          style={{ color: isCorrect ? 'var(--color-primary)' : 'var(--color-muted)' }}
                        >
                          {letter}
                        </span>
                        <input
                          className="flex-1 p-[8px] border-[0.5px] rounded-[8px] text-[14px] font-[inherit]"
                          style={{
                            borderColor: isCorrect ? 'var(--color-primary)' : 'var(--color-border)',
                            background: 'var(--color-card)',
                            color: 'inherit',
                          }}
                          value={f.options![optIdx]}
                          onChange={e => updateOption(i, optIdx, e.target.value)}
                          placeholder={`Alternativ ${letter}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...fields]
                            next[i] = { ...next[i], correctIndex: optIdx }
                            setFields(next)
                          }}
                          className="w-8 h-8 rounded-full border-[0.5px] text-[14px] cursor-pointer font-[inherit] shrink-0 flex items-center justify-center"
                          style={{
                            borderColor: isCorrect ? 'var(--color-primary)' : 'var(--color-border)',
                            background: isCorrect ? 'var(--color-primary)' : 'var(--color-card)',
                            color: isCorrect ? '#fff' : 'var(--color-muted)',
                          }}
                          title="Marker som riktig svar"
                        >
                          ✓
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFields([...fields, { label: '', answer: '', options: null, correctIndex: 0 }])}
            className="w-full p-[10px] border-[0.5px] rounded-[8px] text-[14px] cursor-pointer font-[inherit] bg-transparent text-primary mt-1"
            style={{ borderColor: 'var(--color-primary)' }}
          >
            + Legg til felt
          </button>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-primary text-white border-none p-[13px] rounded-[8px] text-[15px] cursor-pointer font-[inherit] min-h-[48px]"
        >
          Lagre
        </button>
        <button
          onClick={onCancel}
          className="flex-1 border-[0.5px] bg-transparent p-[13px] rounded-[8px] text-[15px] cursor-pointer font-[inherit] min-h-[48px] text-[var(--color-muted)]"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Avbryt
        </button>
      </div>
    </div>
  )
}
