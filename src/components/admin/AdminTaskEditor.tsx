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
}

function toFieldPairs(fields: Task['fields']): FieldPair[] {
  const base: FieldPair[] = [
    { label: '', answer: '' },
    { label: '', answer: '' },
    { label: '', answer: '' },
    { label: '', answer: '' },
  ]
  if (!fields) return base
  return base.map((_, i) => ({
    label: fields[i]?.label ?? '',
    answer: fields[i]?.answer ?? '',
  }))
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
        .map(f => ({
          label: f.label.trim(),
          answer: f.answer.trim() || null,
        }))
    }

    onSave(task)
  }

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
          <option value="multi">Fler-felt</option>
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
          <div className={labelClass}>Felter (label + fasitsvar)</div>
          {fields.map((f, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 mb-2">
              <input
                className={inputClass}
                style={inputStyle}
                value={f.label}
                onChange={e => {
                  const next = [...fields]
                  next[i] = { ...next[i], label: e.target.value }
                  setFields(next)
                }}
                placeholder={`Felt ${i + 1} navn`}
              />
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
            </div>
          ))}
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
