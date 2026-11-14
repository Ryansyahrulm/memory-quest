import './FrameTable.css'

export default function FrameTable({
  steps = [],
  frameCount = 3,
  currentStepIndex = null,
  limitToCurrentStep = false,
  caption = 'Tabel visualisasi simulasi pergantian frame memori',
}) {
  if (!steps || steps.length === 0) {
    return (
      <div className="frame-table-container" style={{ padding: 'var(--space-24)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Belum ada data simulasi untuk ditampilkan.
      </div>
    )
  }

  // Tentukan deretan langkah yang akan ditampilkan
  const visibleSteps = limitToCurrentStep && currentStepIndex !== null
    ? steps.slice(0, currentStepIndex + 1)
    : steps

  const frameIndices = Array.from({ length: frameCount }, (_, i) => i)

  return (
    <div className="frame-table-container">
      <table className="frame-table">
        <caption className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          {caption}
        </caption>
        <thead>
          <tr>
            <th className="frame-label-col" scope="col">
              Waktu (t)
            </th>
            {visibleSteps.map((_, idx) => (
              <th
                key={idx}
                scope="col"
                className={`ref-header-cell ${currentStepIndex === idx ? 'is-current-step' : ''}`}
              >
                t{idx + 1}
              </th>
            ))}
          </tr>
          <tr>
            <th className="frame-label-col" scope="col">
              Referensi
            </th>
            {visibleSteps.map((s, idx) => (
              <th
                key={idx}
                scope="col"
                className={`ref-header-cell ${currentStepIndex === idx ? 'is-current-step' : ''}`}
              >
                {s.page}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Baris setiap Frame (Frame 1 s.d. Frame N) */}
          {frameIndices.map((fIndex) => (
            <tr key={fIndex}>
              <th className="frame-label-col" scope="row">
                Frame {fIndex + 1}
              </th>
              {visibleSteps.map((step, sIdx) => {
                const pageInFrame = step.frames[fIndex]
                const isTargetCell = step.frameIndex === fIndex
                const isCurrent = currentStepIndex === sIdx

                let cellHighlightClass = ''
                if (isTargetCell) {
                  cellHighlightClass = step.isHit ? 'cell-hit-active' : 'cell-fault-active'
                }

                return (
                  <td
                    key={sIdx}
                    className={`frame-value-cell ${cellHighlightClass} ${isCurrent ? 'col-current-step' : ''}`}
                  >
                    {pageInFrame !== undefined ? (
                      pageInFrame
                    ) : (
                      <span className="frame-value-empty">—</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}

          {/* Baris Status (Hit / Fault) */}
          <tr>
            <th className="frame-label-col" scope="row">
              Status
            </th>
            {visibleSteps.map((step, idx) => {
              const isCurrent = currentStepIndex === idx
              const statusClass = step.isHit ? 'status-cell-hit' : 'status-cell-fault'

              return (
                <td
                  key={idx}
                  className={`status-row-cell ${statusClass} ${isCurrent ? 'col-current-step' : ''}`}
                  title={step.isHit ? 'Page Hit' : 'Page Fault'}
                >
                  {step.isHit ? 'H' : 'F'}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
