// const CAT_COLORS: Record<0 | 1 | 2, string> = {
//   0: 'var(--color-primary-dark)',
//   1: 'var(--color-accent-dark)',
//   2: '#5a4080',
// }

// interface Props {
//   col: 0 | 1 | 2
//   x: number
//   y: number
//   status: true | 'pending' | undefined
//   onClick: () => void
// }

// export default function MapPin({ col, x, y, status, onClick }: Props) {
//   const catColor = CAT_COLORS[col]
//   const isDone = status === true || typeof status === 'number'
//   const bg =
//     isDone
//       ? 'var(--color-primary)'
//       : status === 'pending'
//         ? 'var(--color-accent)'
//         : 'white'

//   return (
//     <div
//       className="absolute w-7.5 h-7.5 rounded-full cursor-pointer -translate-x-1/2 -translate-y-1/2 z-2 shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
//       style={{ left: `${x}%`, top: `${y}%`, background: bg, border: `2.5px solid ${catColor}` }}
//       onClick={onClick}
//     />
//   )
// }
