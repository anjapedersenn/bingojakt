import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../components/layout/AppLayout'
import AdminOverview from '../components/admin/AdminOverview'
import AdminTeams from '../components/admin/AdminTeams'
import AdminTaskList from '../components/admin/AdminTaskList'
import AdminTaskEditor from '../components/admin/AdminTaskEditor'
import type { Task } from '../types'

type AdminTab = 'overview' | 'teams' | 'tasks' | 'editor' | 'settings'

export default function AdminPage() {
  const {
    gameState,
    logout,
    writeTimer,
    writeTask,
    deleteTask,
    writeDone,
    deleteDone,
    writeAdminPts,
    writeTaskBonus,
    resetAllTeams,
    writeConfig,
  } = useApp()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(undefined)
  const [timerMinutes, setTimerMinutes] = useState(String(gameState.timer.minutes))
  const [draftRules, setDraftRules] = useState(gameState.config.rules)
  const [draftPhone, setDraftPhone] = useState(gameState.config.phone)

  const { timer } = gameState

  const handleStartTimer = () => {
    const min = parseInt(timerMinutes, 10)
    if (isNaN(min) || min < 1) return
    writeTimer({ running: true, endsAt: Date.now() + min * 60000, minutes: min })
  }

  const handleStopTimer = () => {
    writeTimer({ ...timer, running: false })
  }

  const handleResetTimer = () => {
    const min = parseInt(timerMinutes, 10)
    writeTimer({ running: false, endsAt: null, minutes: isNaN(min) ? 90 : min })
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setActiveTab('editor')
  }

  const handleNewTask = () => {
    setEditingTask(null)
    setActiveTab('editor')
  }

  const handleSaveTask = (task: Task) => {
    writeTask(task)
    setActiveTab('tasks')
    setEditingTask(undefined)
  }

  const handleCancelEditor = () => {
    setActiveTab('tasks')
    setEditingTask(undefined)
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Oversikt' },
    { id: 'teams', label: 'Lag' },
    { id: 'tasks', label: 'Oppgaver' },
    { id: 'settings', label: 'Innstillinger' },
  ]

  const tabClass = (id: AdminTab) =>
    `flex-1 py-[10px] text-[13px] border-none cursor-pointer font-[inherit] transition-colors ${
      activeTab === id
        ? 'bg-primary text-white'
        : 'bg-transparent text-[var(--color-muted)]'
    }`

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[20px] font-semibold m-0">Admin</h1>
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="flex items-center gap-[6px] text-[13px] text-[var(--color-muted)] border-[0.5px] rounded-[8px] px-3 py-2 cursor-pointer min-h-[40px] font-[inherit] bg-transparent"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <i className="ti ti-logout" aria-hidden="true" /> Logg ut
        </button>
      </div>

      {/* Timer card */}
      <div
        className="rounded-[12px] p-[16px] border-[0.5px] mb-4"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold m-0">Nedtelling</h3>
          <span
            className={`text-[12px] px-[9px] py-[3px] rounded-[20px] font-semibold ${
              timer.running ? 'bg-primary-light text-primary-dark' : 'bg-accent-light text-accent-dark'
            }`}
          >
            {timer.running ? 'Kjører' : 'Stoppet'}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            min="1"
            max="300"
            value={timerMinutes}
            onChange={e => setTimerMinutes(e.target.value)}
            className="w-[70px] p-2 border-[0.5px] rounded-[6px] text-[16px] text-center font-mono font-[inherit]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)', color: 'inherit' }}
          />
          <span className="text-[13px] text-[var(--color-muted)]">minutter</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStartTimer}
            disabled={timer.running}
            className="flex-1 bg-primary text-white border-none py-[10px] rounded-[8px] text-[13px] cursor-pointer font-[inherit] min-h-[40px] disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={handleStopTimer}
            disabled={!timer.running}
            className="flex-1 bg-accent text-white border-none py-[10px] rounded-[8px] text-[13px] cursor-pointer font-[inherit] min-h-[40px] disabled:opacity-50"
          >
            Stopp
          </button>
          <button
            onClick={handleResetTimer}
            className="flex-1 bg-primary-light text-primary-dark border-none py-[10px] rounded-[8px] text-[13px] cursor-pointer font-[inherit] min-h-[40px]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex rounded-[10px] overflow-hidden border-[0.5px] mb-4"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={tabClass(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <AdminOverview
          teams={gameState.teams}
          tasks={gameState.tasks}
          onResetTeams={resetAllTeams}
        />
      )}

      {activeTab === 'teams' && (
        <AdminTeams
          teams={gameState.teams}
          tasks={gameState.tasks}
          onApprove={(teamKey, taskId) => writeDone(teamKey, taskId, true)}
          onReject={(teamKey, taskId) => deleteDone(teamKey, taskId)}
          onSetBonus={(teamKey, pts, msg) => writeAdminPts(teamKey, pts, msg)}
          onTaskBonus={(teamKey, extraPts, msg) =>
            writeTaskBonus(teamKey, gameState.teams[teamKey]?.adminPts ?? 0, extraPts, msg)
          }
        />
      )}

      {activeTab === 'tasks' && (
        <>
          <button
            onClick={handleNewTask}
            className="w-full bg-primary text-white border-none p-[13px] rounded-[8px] text-[14px] cursor-pointer font-[inherit] min-h-[46px] mb-3"
          >
            + Ny oppgave
          </button>
          <AdminTaskList
            tasks={gameState.tasks}
            onEdit={handleEditTask}
            onDelete={deleteTask}
          />
        </>
      )}

      {activeTab === 'editor' && editingTask !== undefined && (
        <AdminTaskEditor
          initialTask={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelEditor}
        />
      )}

      {activeTab === 'settings' && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[13px] font-semibold block mb-1">Spilleregler</label>
            <textarea
              value={draftRules}
              onChange={e => setDraftRules(e.target.value)}
              rows={8}
              className="w-full p-3 border-[0.5px] rounded-[8px] text-[14px] font-[inherit] resize-y"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)', color: 'inherit' }}
            />
          </div>
          <div>
            <label className="text-[13px] font-semibold block mb-1">Telefonnummer (valgfritt)</label>
            <input
              type="tel"
              value={draftPhone}
              onChange={e => setDraftPhone(e.target.value)}
              placeholder="+47 900 00 000"
              className="w-full p-3 border-[0.5px] rounded-[8px] text-[14px] font-[inherit]"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)', color: 'inherit' }}
            />
          </div>
          <button
            onClick={() => writeConfig({ rules: draftRules, phone: draftPhone })}
            className="w-full bg-primary text-white border-none p-[13px] rounded-[8px] text-[14px] cursor-pointer font-[inherit] min-h-[46px]"
          >
            Lagre innstillinger
          </button>
        </div>
      )}
    </div>
  )
}
