import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const PDF_MARGIN = 12
const PDF_FOOTER = 10
const PDF_SECTION_GAP = 3

async function waitForImages(element: HTMLElement): Promise<void> {
  await Promise.all(
    Array.from(element.querySelectorAll('img')).map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
    )
  )
}

async function captureSection(element: HTMLElement): Promise<HTMLCanvasElement> {
  await waitForImages(element)
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
  })
}

function addPageNumbers(pdf: jsPDF, totalPages: number): void {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(130)
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' })
  }
}

/** Place a section image on the PDF, starting a new page if it won't fit */
function placeSection(
  pdf: jsPDF,
  imgData: string,
  imgWidth: number,
  imgHeight: number,
  state: { y: number; page: number },
  maxContentHeight: number
): void {
  if (state.y + imgHeight > maxContentHeight && state.y > PDF_MARGIN) {
    pdf.addPage()
    state.page++
    state.y = PDF_MARGIN
  }

  pdf.addImage(imgData, 'PNG', PDF_MARGIN, state.y, imgWidth, imgHeight)
  state.y += imgHeight + PDF_SECTION_GAP
}

/** Slice a tall section across multiple pages without overlapping the footer */
function placeTallSection(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  imgWidth: number,
  state: { y: number; page: number },
  maxContentHeight: number
): void {
  const fullHeight = (canvas.height * imgWidth) / canvas.width
  const pageSliceHeight = maxContentHeight - PDF_MARGIN
  let offsetY = 0

  while (offsetY < fullHeight) {
    const remaining = fullHeight - offsetY
    const sliceHeight = Math.min(remaining, pageSliceHeight)

    if (state.y + sliceHeight > maxContentHeight && state.y > PDF_MARGIN) {
      pdf.addPage()
      state.page++
      state.y = PDF_MARGIN
    }

    const srcY = (offsetY / fullHeight) * canvas.height
    const srcH = (sliceHeight / fullHeight) * canvas.height

    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = srcH
    const ctx = sliceCanvas.getContext('2d')
    if (!ctx) break

    ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH)
    const sliceData = sliceCanvas.toDataURL('image/png')

    pdf.addImage(sliceData, 'PNG', PDF_MARGIN, state.y, imgWidth, sliceHeight)

    offsetY += sliceHeight
    if (offsetY < fullHeight) {
      pdf.addPage()
      state.page++
      state.y = PDF_MARGIN
    } else {
      state.y += sliceHeight + PDF_SECTION_GAP
    }
  }
}

export async function generatePDFBlob(elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId)
  if (!element) throw new Error('Document element not found')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PDF_MARGIN * 2
  const maxContentHeight = pageHeight - PDF_MARGIN - PDF_FOOTER

  const sections = element.querySelectorAll('[data-pdf-section]')
  const targets =
    sections.length > 0 ? Array.from(sections) : [element]

  const state = { y: PDF_MARGIN, page: 1 }

  for (const section of targets) {
    const el = section as HTMLElement
    const canvas = await captureSection(el)
    const imgData = canvas.toDataURL('image/png')
    const imgHeight = (canvas.height * contentWidth) / canvas.width
    const pageSliceHeight = maxContentHeight - PDF_MARGIN

    if (imgHeight <= pageSliceHeight) {
      placeSection(pdf, imgData, contentWidth, imgHeight, state, maxContentHeight)
    } else {
      placeTallSection(pdf, canvas, contentWidth, state, maxContentHeight)
    }
  }

  addPageNumbers(pdf, pdf.getNumberOfPages())
  return pdf.output('blob')
}

export async function generatePDF(elementId: string, filename: string): Promise<Blob> {
  const blob = await generatePDFBlob(elementId)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return blob
}

export async function sharePDF(blob: Blob, filename: string, title: string) {
  const file = new File([blob], filename, { type: 'application/pdf' })

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title })
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function printDocument(elementId: string) {
  const element = document.getElementById(elementId)
  if (!element) return

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n')
      } catch {
        return ''
      }
    })
    .join('\n')

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bhavana Studio</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />
        <style>
          ${styles}
          body { margin: 0; padding: 12mm; background: white; }
          @page { size: A4; margin: 12mm; }
          .pdf-section { page-break-inside: avoid; break-inside: avoid; }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}
