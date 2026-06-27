import sampleBackground from '../assets/sample_background.png'

export function buildDialoguePages(chapter) {
  const dialogues = chapter?.dialogues ?? []
  const pages = []

  dialogues.forEach((item, index) => {
    const backgroundSrc = item?.backgroundSrc || chapter?.scene?.image || sampleBackground
    const previousPage = pages[pages.length - 1]

    if (previousPage && previousPage.backgroundSrc === backgroundSrc) {
      previousPage.endIndex = index
      previousPage.dialogues.push(item)
      return
    }

    pages.push({
      id: `${chapter?.id ?? 'chapter'}-page-${pages.length + 1}`,
      pageNumber: pages.length + 1,
      startIndex: index,
      endIndex: index,
      backgroundSrc,
      dialogues: [item],
    })
  })

  return pages
}

export function getCurrentPageIndex(pages, dialogueIndex) {
  return Math.max(
    0,
    pages.findIndex((page) => dialogueIndex >= page.startIndex && dialogueIndex <= page.endIndex)
  )
}
