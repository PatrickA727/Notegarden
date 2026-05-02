interface IconFretGridProps {
  size?: number
  color?: string
}

export default function IconFretGrid({ size = 96, color = '#f5f5f2' }: IconFretGridProps) {
  const x = [17, 39, 61, 83]
  const y = [17, 39, 61, 83]
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <line x1={x[0]} y1={y[0]} x2={x[3]} y2={y[0]} stroke={color} strokeWidth="3" />
      {y.slice(1).map((yy, i) => (
        <line key={'h' + i} x1={x[0]} y1={yy} x2={x[3]} y2={yy} stroke={color} strokeWidth="1.2" />
      ))}
      {x.map((xx, i) => (
        <line key={'v' + i} x1={xx} y1={y[0]} x2={xx} y2={y[3]} stroke={color} strokeWidth="1.2" />
      ))}
      <circle cx={x[1]} cy={(y[1] + y[2]) / 2} r="5" fill={color} />
      <circle cx={x[2]} cy={(y[2] + y[3]) / 2} r="5" fill={color} />
    </svg>
  )
}
