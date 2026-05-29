interface Props {
  onOpenTask?: (id: string) => void
}

export default function MapView({}: Props) {
  return (
    <div>
      <div
        className="relative rounded-[16px] overflow-hidden border-[0.5px] mb-3"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <img
          src="/map3.jpg"
          alt="Kart over vingården"
          className="w-full block"
        />
      </div>
    </div>
  )
}
