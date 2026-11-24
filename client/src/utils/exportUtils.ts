/**
 * Client-side Export Utilities (CSV & Formatted Table PDF) for Sudabelt Medical CRM
 */

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
): void {
  const escapeCell = (val: string | number | undefined | null): string => {
    const str = String(val ?? '').replace(/\r?\n/g, ' ').trim()
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvLines = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ]

  const csvContent = '\uFEFF' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapePdfText(str: string): string {
  return str
    .replace(/[^\x20-\x7E]/g, (ch) => {
      if (ch === '™') return '(TM)'
      if (ch === '®') return '(R)'
      if (ch === '©') return '(C)'
      if (ch === '•' || ch === '·') return '-'
      return '-'
    })
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}

function wrapCellText(text: string, maxChars: number): string[] {
  const cleaned = text.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
  if (!cleaned) return ['-']
  const safeMax = Math.max(8, maxChars)
  const words = cleaned.split(' ')
  const lines: string[] = []
  let current = ''

  for (const rawWord of words) {
    // Hard-wrap very long single tokens like emails or URLs if they exceed cell width
    if (rawWord.length > safeMax) {
      if (current) {
        lines.push(current)
        current = ''
      }
      for (let i = 0; i < rawWord.length; i += safeMax) {
        lines.push(rawWord.slice(i, i + safeMax))
      }
      continue
    }

    if (!current) {
      current = rawWord
    } else if (current.length + 1 + rawWord.length <= safeMax) {
      current += ' ' + rawWord
    } else {
      lines.push(current)
      current = rawWord
    }
  }
  if (current) lines.push(current)
  return lines
}

export function exportToPDF(
  filename: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number | undefined | null)[][]
): void {
  // Use Landscape (792 x 612 pt) for wide tables (4+ columns), Portrait (612 x 792 pt) for 3 or fewer
  const isLandscape = headers.length >= 4
  const pageWidth = isLandscape ? 792 : 612
  const pageHeight = isLandscape ? 612 : 792
  const marginX = 32
  const tableWidth = pageWidth - marginX * 2

  // Prepend '#' index column
  const allHeaders = ['#', ...headers]
  const allRows = rows.map((r, idx) => [String(idx + 1), ...r.map((c) => String(c ?? '-'))])

  // Compute smart proportional column widths
  const indexColWidth = 28
  const remainingWidth = tableWidth - indexColWidth
  const colWeights = headers.map((h, colIdx) => {
    const sampleLengths = rows
      .slice(0, 25)
      .map((r) => String(r[colIdx] ?? '').length)
    const avgLen =
      sampleLengths.length > 0
        ? sampleLengths.reduce((a, b) => a + b, 0) / sampleLengths.length
        : h.length
    const effective = Math.max(h.length + 2, Math.min(48, avgLen))
    return Math.max(10, effective)
  })
  const totalWeight = colWeights.reduce((a, b) => a + b, 0) || 1
  const colWidths = [
    indexColWidth,
    ...colWeights.map((w) => (w / totalWeight) * remainingWidth),
  ]

  // Compute column X offsets
  const colX: number[] = []
  let accX = marginX
  for (const w of colWidths) {
    colX.push(accX)
    accX += w
  }

  const fontSize = isLandscape && headers.length >= 6 ? 7.8 : 8.5
  const lineHeight = fontSize + 3.5
  const cellPadX = 5
  const cellPadY = 5.5
  const charWidthApprox = fontSize * 0.51

  // Pre-wrap all rows so we know each row's exact height
  const wrappedRows = allRows.map((row) => {
    const wrappedCells = row.map((cellVal, colIdx) => {
      const availWidth = colWidths[colIdx] - cellPadX * 2
      const maxChars = Math.max(4, Math.floor(availWidth / charWidthApprox))
      return wrapCellText(cellVal, maxChars)
    })
    const maxLines = Math.max(1, ...wrappedCells.map((c) => c.length))
    const rowHeight = maxLines * lineHeight + cellPadY * 2
    return { wrappedCells, rowHeight }
  })

  const generatedAt = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const drawPageChrome = (isFirstPage: boolean): { ops: string[]; startY: number } => {
    const ops: string[] = []
    if (isFirstPage) {
      // Top Deep Navy Brand Banner (#001142 -> 0, 0.067, 0.259)
      const bannerH = 68
      const bannerY = pageHeight - bannerH
      ops.push(`0 0.067 0.259 rg ${0} ${bannerY} ${pageWidth} ${bannerH} re f`)
      // Green Accent Stripe (#006837 -> 0, 0.408, 0.216)
      ops.push(`0 0.408 0.216 rg ${0} ${bannerY - 3.5} ${pageWidth} 3.5 re f`)
      // Red Brand Accent Pill (#E30613 -> 0.89, 0.024, 0.075)
      ops.push(`0.89 0.024 0.075 rg ${marginX} ${pageHeight - 19} 22 2.5 re f`)

      // Brand Eyebrow
      ops.push(
        `BT /F2 8 Tf 0.22 0.71 0.98 rg ${marginX + 28} ${pageHeight - 19} Td (SUDABELT MEDICAL  |  EXECUTIVE CRM REPORT) Tj ET`
      )
      // Main Report Title
      ops.push(
        `BT /F2 16 Tf 1 1 1 rg ${marginX} ${pageHeight - 40} Td (${escapePdfText(title)}) Tj ET`
      )
      // Subtitle
      ops.push(
        `BT /F1 9 Tf 0.82 0.88 0.95 rg ${marginX} ${pageHeight - 55} Td (${escapePdfText(subtitle)}) Tj ET`
      )

      // Summary Metadata Bar below header
      const metaY = bannerY - 34
      ops.push(`0.96 0.98 0.97 rg ${marginX} ${metaY} ${tableWidth} 22 re f`)
      ops.push(`0.82 0.89 0.85 RG 0.7 w ${marginX} ${metaY} ${tableWidth} 22 re S`)
      ops.push(
        `BT /F2 8.5 Tf 0 0.067 0.259 rg ${marginX + 10} ${metaY + 7.5} Td (TOTAL RECORDS: ${rows.length}) Tj ET`
      )
      ops.push(
        `BT /F1 8.5 Tf 0.28 0.35 0.42 rg ${marginX + 145} ${metaY + 7.5} Td (GENERATED: ${escapePdfText(generatedAt)}) Tj ET`
      )
      ops.push(
        `BT /F2 8 Tf 0 0.408 0.216 rg ${pageWidth - marginX - 155} ${metaY + 7.5} Td (VERIFIED SUDABELT CRM DATA) Tj ET`
      )

      return { ops, startY: metaY - 12 }
    } else {
      // Compact continuation header on subsequent pages
      const barY = pageHeight - 36
      ops.push(`0 0.067 0.259 rg 0 ${barY} ${pageWidth} 36 re f`)
      ops.push(`0 0.408 0.216 rg 0 ${barY - 2.5} ${pageWidth} 2.5 re f`)
      ops.push(
        `BT /F2 10 Tf 1 1 1 rg ${marginX} ${pageHeight - 22} Td (${escapePdfText(title)}  -  Continued) Tj ET`
      )
      ops.push(
        `BT /F1 8 Tf 0.82 0.88 0.95 rg ${pageWidth - marginX - 135} ${pageHeight - 22} Td (${escapePdfText(generatedAt)}) Tj ET`
      )
      return { ops, startY: barY - 14 }
    }
  }

  const drawTableHeader = (ops: string[], topY: number): number => {
    const headerH = 22
    const boxY = topY - headerH
    // Navy fill for table header
    ops.push(`0 0.067 0.259 rg ${marginX} ${boxY} ${tableWidth} ${headerH} re f`)

    allHeaders.forEach((h, colIdx) => {
      const x = colX[colIdx] + cellPadX
      const textY = boxY + 7
      ops.push(
        `BT /F2 ${fontSize} Tf 1 1 1 rg ${x.toFixed(1)} ${textY.toFixed(1)} Td (${escapePdfText(h.toUpperCase())}) Tj ET`
      )
    })

    return boxY
  }

  // Paginate rows
  const pageStreams: string[][] = []
  let currentChrome = drawPageChrome(true)
  let currentOps = currentChrome.ops
  let y = drawTableHeader(currentOps, currentChrome.startY)
  const bottomLimit = 44

  if (wrappedRows.length === 0) {
    const emptyBoxY = y - 36
    currentOps.push(`0.98 0.98 0.99 rg ${marginX} ${emptyBoxY} ${tableWidth} 36 re f`)
    currentOps.push(`0.86 0.89 0.92 RG 0.6 w ${marginX} ${emptyBoxY} ${tableWidth} 36 re S`)
    currentOps.push(
      `BT /F1 9.5 Tf 0.4 0.45 0.52 rg ${marginX + 14} ${emptyBoxY + 14} Td (No records available in this view.) Tj ET`
    )
    pageStreams.push(currentOps)
  } else {
    wrappedRows.forEach((rowObj, rowIdx) => {
      if (y - rowObj.rowHeight < bottomLimit) {
        pageStreams.push(currentOps)
        currentChrome = drawPageChrome(false)
        currentOps = currentChrome.ops
        y = drawTableHeader(currentOps, currentChrome.startY)
      }

      const rowBottomY = y - rowObj.rowHeight
      // Alternating Zebra Background
      if (rowIdx % 2 === 1) {
        currentOps.push(
          `0.969 0.976 0.984 rg ${marginX} ${rowBottomY.toFixed(1)} ${tableWidth} ${rowObj.rowHeight.toFixed(1)} re f`
        )
      } else {
        currentOps.push(
          `1 1 1 rg ${marginX} ${rowBottomY.toFixed(1)} ${tableWidth} ${rowObj.rowHeight.toFixed(1)} re f`
        )
      }

      // Row outer border & vertical column dividers
      currentOps.push(
        `0.86 0.89 0.92 RG 0.5 w ${marginX} ${rowBottomY.toFixed(1)} ${tableWidth} ${rowObj.rowHeight.toFixed(1)} re S`
      )
      for (let c = 1; c < colX.length; c++) {
        const vx = colX[c].toFixed(1)
        currentOps.push(
          `0.89 0.91 0.94 RG 0.4 w ${vx} ${y.toFixed(1)} m ${vx} ${rowBottomY.toFixed(1)} l S`
        )
      }

      // Render cell text lines
      rowObj.wrappedCells.forEach((cellLines, colIdx) => {
        const x = colX[colIdx] + cellPadX
        const isBoldCol = colIdx === 0 || colIdx === 1
        const fontRef = isBoldCol ? '/F2' : '/F1'
        const colorCmd =
          colIdx === 0
            ? '0 0.408 0.216 rg'
            : colIdx === 1
              ? '0 0.067 0.259 rg'
              : '0.18 0.23 0.30 rg'

        cellLines.forEach((lineStr, lineIdx) => {
          const lineY = y - cellPadY - fontSize - lineIdx * lineHeight + 1.5
          currentOps.push(
            `BT ${fontRef} ${fontSize} Tf ${colorCmd} ${x.toFixed(1)} ${lineY.toFixed(1)} Td (${escapePdfText(lineStr)}) Tj ET`
          )
        })
      })

      y = rowBottomY
    })

    pageStreams.push(currentOps)
  }

  // Add Footer with Page X of Y to every page
  const totalPages = pageStreams.length
  const finalPages = pageStreams.map((ops, idx) => {
    const footerOps = [...ops]
    footerOps.push(`0.84 0.87 0.91 RG 0.6 w ${marginX} 30 m ${pageWidth - marginX} 30 l S`)
    footerOps.push(
      `BT /F1 7.5 Tf 0.42 0.47 0.53 rg ${marginX} 18 Td (Sudabelt Medical Ltd.  |  Official CRM Export  |  info@sudabelt.com) Tj ET`
    )
    footerOps.push(
      `BT /F2 7.5 Tf 0 0.067 0.259 rg ${pageWidth - marginX - 55} 18 Td (Page ${idx + 1} of ${totalPages}) Tj ET`
    )
    return footerOps.join('\n')
  })

  // Assemble PDF 1.4 document
  const objects: string[] = []
  const pageObjIds: number[] = []

  // Obj 1: Catalog, Obj 2: Pages, Obj 3: Helvetica, Obj 4: Helvetica-Bold
  objects.push('')
  objects.push('')
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

  for (const pageContent of finalPages) {
    const contentObjId = objects.length + 1
    objects.push(`<< /Length ${pageContent.length} >>\nstream\n${pageContent}\nendstream`)

    const pageObjId = objects.length + 1
    pageObjIds.push(pageObjId)
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjId} 0 R >>`
    )
  }

  objects[0] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[1] = `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageObjIds.length} >>`

  let pdfStr = '%PDF-1.4\n'
  const offsets: number[] = [0]

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdfStr.length)
    pdfStr += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
  }

  const xrefOffset = pdfStr.length
  pdfStr += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= objects.length; i++) {
    pdfStr += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdfStr += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  const blob = new Blob([pdfStr], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
