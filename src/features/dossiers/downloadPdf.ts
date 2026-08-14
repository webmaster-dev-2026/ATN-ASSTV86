import { toJpeg } from 'html-to-image'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 18
const PRINT_SHEET_CLASS = 'document-print-sheet'
const CAPTURE_WIDTH = 794

const encoder = new TextEncoder()

function bytes(value: string) {
  return encoder.encode(value)
}

function concat(chunks: readonly Uint8Array[]) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const output = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }
  return output
}

function jpegFromDataUrl(dataUrl: string) {
  const binary = atob(dataUrl.slice(dataUrl.indexOf(',') + 1))
  const output = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    output[index] = binary.charCodeAt(index)
  }
  return output
}

function fitImage(imgWidth: number, imgHeight: number) {
  const maxWidth = PAGE_WIDTH - PAGE_MARGIN * 2
  const maxHeight = PAGE_HEIGHT - PAGE_MARGIN * 2
  const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
  const width = imgWidth * scale
  const height = imgHeight * scale
  return {
    width,
    height,
    x: (PAGE_WIDTH - width) / 2,
    y: PAGE_HEIGHT - PAGE_MARGIN - height,
  }
}

function createPdfFromJpegs(pages: Array<{ jpeg: Uint8Array; width: number; height: number }>) {
  const objects: Uint8Array[] = []
  const kids = pages.map((_, index) => `${3 + index * 3} 0 R`).join(' ')

  objects.push(bytes(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`))
  objects.push(bytes(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>\nendobj\n`))

  pages.forEach((page, index) => {
    const pageId = 3 + index * 3
    const imageId = pageId + 1
    const contentId = pageId + 2
    const box = fitImage(page.width, page.height)
    const content = `q ${box.width.toFixed(2)} 0 0 ${box.height.toFixed(2)} ${box.x.toFixed(2)} ${box.y.toFixed(2)} cm /Im0 Do Q`

    objects.push(
      bytes(
        `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`,
      ),
    )
    objects.push(
      concat([
        bytes(
          `${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>\nstream\n`,
        ),
        page.jpeg,
        bytes(`\nendstream\nendobj\n`),
      ]),
    )
    objects.push(
      bytes(`${contentId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`),
    )
  })

  const header = bytes('%PDF-1.4\n%\x80\x81\x82\x83\n')
  const parts: Uint8Array[] = [header]
  const offsets = [0]
  let offset = header.length

  for (const object of objects) {
    offsets.push(offset)
    parts.push(object)
    offset += object.length
  }

  const xrefLines = ['xref', `0 ${objects.length + 1}`, '0000000000 65535 f ']
  for (let index = 1; index <= objects.length; index += 1) {
    xrefLines.push(`${String(offsets[index]).padStart(10, '0')} 00000 n `)
  }

  const xref = bytes(`${xrefLines.join('\n')}\n`)
  const trailer = bytes(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF\n`,
  )
  const pdf = concat([...parts, xref, trailer])
  return new Blob([pdf.slice()], { type: 'application/pdf' })
}

function waitForFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

async function captureArticle(article: HTMLElement) {
  const host = window.document.createElement('div')
  host.style.cssText = [
    'position:fixed',
    'left:-12000px',
    'top:0',
    `width:${CAPTURE_WIDTH}px`,
    'background:#fffdf8',
    'z-index:-1',
    'pointer-events:none',
  ].join(';')

  const clone = article.cloneNode(true) as HTMLElement
  clone.style.width = '100%'
  clone.style.maxWidth = 'none'
  clone.style.boxShadow = 'none'
  clone.style.overflow = 'visible'
  host.appendChild(clone)
  window.document.body.appendChild(host)
  await waitForFrame()

  try {
    const dataUrl = await toJpeg(clone, {
      quality: 0.92,
      pixelRatio: 2,
      backgroundColor: '#fffdf8',
      cacheBust: true,
      style: {
        transform: 'none',
        zoom: '1',
      },
    })
    const image = new Image()
    image.src = dataUrl
    await image.decode()
    return {
      jpeg: jpegFromDataUrl(dataUrl),
      width: image.naturalWidth,
      height: image.naturalHeight,
    }
  } finally {
    host.remove()
  }
}

export function pdfFileName(name: string) {
  return /\.pdf$/i.test(name) ? name : `${name.replace(/\.[^.]+$/, '') || name}.pdf`
}

export function mountPrintSheet(source: HTMLElement) {
  removePrintSheet()
  const sheet = window.document.createElement('div')
  sheet.className = PRINT_SHEET_CLASS
  const clone = source.cloneNode(true) as HTMLElement
  clone.style.zoom = '1'
  clone.style.transform = 'none'
  sheet.appendChild(clone)
  window.document.body.appendChild(sheet)
}

export function removePrintSheet() {
  window.document.querySelectorAll(`.${PRINT_SHEET_CLASS}`).forEach((node) => node.remove())
}

export async function createPdfFromPapers(root: HTMLElement) {
  const articles = [...root.querySelectorAll('article')]
  if (articles.length === 0) {
    throw new Error('No document page to export')
  }

  const pages = []
  for (const article of articles) {
    pages.push(await captureArticle(article))
  }
  return createPdfFromJpegs(pages)
}
