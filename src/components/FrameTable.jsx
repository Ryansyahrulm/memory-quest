import { useRef, useEffect } from 'react'
import Badge from './Badge'
import './FrameTable.css'

export default function FrameTable({ steps = [], frameCount = 3 }) {
  const containerRef = useRef(null)

  // Gulir otomatis tabel ke kanan saat langkah baru ditambahkan
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth
    }
  }, [steps.length])

  if (!steps || steps.length === 0) {
    return (
      <div className="frame-table-empty">
        <p>Belum ada data langkah simulasi untuk ditampilkan.</p>
      </div>
    )
  }

  const frameIndices = Array.from({ length: frameCount }, (_, i) => i)
  const currentStepIdx = steps.length - 1

  return (
    <div className="frame-table-wrapper">
      <div className="frame-table-container" ref={containerRef}>
        <table className="frame-table" aria-label="Tabel langkah pergantian frame memori">
          <thead>
            <tr className="step-number-row">
              <th scope="col" className="frame-table-sticky-col">
                Langkah
              </th>
              {steps.map((_, index) => {
                const isCurrent = index === currentStepIdx
                return (
                  <th
                    key={`step-${index}`}
                    scope="col"
                    className={`cell-mono ${isCurrent ? 'col-current-header' : ''}`.trim()}
                  >
                    {index + 1}
                  </th>
                )
              })}
            </tr>
            <tr className="page-row">
              <th scope="row" className="frame-table-sticky-col">
                Halaman
              </th>
              {steps.map((step, index) => {
                const isCurrent = index === currentStepIdx
                return (
                  <th
                    key={`page-${index}`}
                    className={`cell-mono page-val ${isCurrent ? 'col-current-page' : ''}`.trim()}
                  >
                    {step.page}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {frameIndices.map((frameIdx) => (
              <tr key={`frame-${frameIdx}`}>
                <th scope="row" className="frame-table-sticky-col">
                  Frame {frameIdx + 1}
                </th>
                {steps.map((step, stepIdx) => {
                  const pageInFrame = step.frames[frameIdx]
                  const isTargetCell = step.frameIndex === frameIdx
                  const isCurrent = stepIdx === currentStepIdx

                  if (pageInFrame === undefined) {
                    return (
                      <td
                        key={`cell-${stepIdx}-${frameIdx}`}
                        className={`cell-mono cell-empty ${isCurrent ? 'col-current-cell' : ''}`.trim()}
                        aria-label={`Frame ${frameIdx + 1} kosong`}
                      >
                        -
                      </td>
                    )
                  }

                  let cellClass = 'cell-mono'
                  let titleDesc = `Frame ${frameIdx + 1}: ${pageInFrame}`

                  if (isTargetCell) {
                    if (step.isHit) {
                      cellClass += ' cell-hit'
                      titleDesc += ' (Hit)'
                    } else {
                      cellClass += ' cell-fault-entry'
                      titleDesc +=
                        step.replaced !== null
                          ? ` (Baru masuk menggantikan ${step.replaced})`
                          : ' (Baru masuk)'
                    }
                  }

                  if (isCurrent) {
                    cellClass += ' col-current-cell'
                  }

                  return (
                    <td
                      key={`cell-${stepIdx}-${frameIdx}`}
                      className={cellClass}
                      title={titleDesc}
                    >
                      {pageInFrame}
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className="status-row">
              <th scope="row" className="frame-table-sticky-col">
                Status
              </th>
              {steps.map((step, index) => {
                const isCurrent = index === currentStepIdx
                return (
                  <td
                    key={`status-${index}`}
                    className={isCurrent ? 'col-current-cell' : ''}
                  >
                    <Badge variant={step.isHit ? 'hit' : 'fault'}>
                      {step.isHit ? 'HIT' : 'FAULT'}
                    </Badge>
                  </td>
                )
              })}
            </tr>
            <tr className="info-row">
              <th scope="row" className="frame-table-sticky-col">
                Keterangan
              </th>
              {steps.map((step, index) => {
                const isCurrent = index === currentStepIdx
                let note = 'Hit'
                if (!step.isHit) {
                  note = step.replaced !== null ? `Ganti ${step.replaced}` : 'Masuk'
                }
                return (
                  <td
                    key={`info-${index}`}
                    className={`cell-info ${isCurrent ? 'col-current-cell' : ''}`.trim()}
                  >
                    {note}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
