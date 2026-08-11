import { institutionInitials } from '../lib/data'

interface InstitutionMarksProps {
  institutions: string[]
}

export function InstitutionMarks({ institutions }: InstitutionMarksProps) {
  const visible = institutions.slice(0, 2)
  const remaining = institutions.length - visible.length
  const label = institutions.join(', ')

  return (
    <span className="institution-marks" role="img" aria-label={`Institutions: ${label}`} title={label}>
      {visible.map((institution) => (
        <span className="institution-mark" aria-hidden="true" key={institution}>
          {institutionInitials(institution)}
        </span>
      ))}
      {remaining > 0 && <span className="institution-mark institution-mark--more" aria-hidden="true">+{remaining}</span>}
    </span>
  )
}
