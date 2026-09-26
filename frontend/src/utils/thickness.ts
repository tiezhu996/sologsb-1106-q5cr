import type { Block } from '../types/block'

export const THICKNESS_TOLERANCE_MM = 1
export const KEY_BLOCK_NAME = '墨线版'

export interface ThicknessIssue {
  blockId: string
  blockName: Block['blockName']
  gapMm: number
}

export function keyBlockOf(blocks: Block[]): Block | null {
  return blocks.find((block) => block.blockName === KEY_BLOCK_NAME) ?? null
}

export function thicknessGapMm(block: Block, keyBlock: Block | null): number {
  if (!keyBlock || block.id === keyBlock.id) return 0
  return Math.abs(Math.round((block.thicknessMm - keyBlock.thicknessMm) * 10) / 10)
}

export function findThicknessIssues(blocks: Block[]): ThicknessIssue[] {
  const keyBlock = keyBlockOf(blocks)
  if (!keyBlock) return []
  return blocks
    .filter((block) => block.id !== keyBlock.id)
    .map((block) => ({
      blockId: block.id,
      blockName: block.blockName,
      gapMm: thicknessGapMm(block, keyBlock),
    }))
    .filter((issue) => issue.gapMm > THICKNESS_TOLERANCE_MM)
}

export function countThicknessIssuesByDraft(blocks: Block[]): Record<string, number> {
  const byDraft = new Map<string, Block[]>()
  for (const block of blocks) {
    const list = byDraft.get(block.draftId) ?? []
    list.push(block)
    byDraft.set(block.draftId, list)
  }

  const counts: Record<string, number> = {}
  for (const [draftId, draftBlocks] of byDraft) {
    const count = findThicknessIssues(draftBlocks).length
    if (count > 0) counts[draftId] = count
  }
  return counts
}

export function formatThicknessGap(gapMm: number): string {
  return Number.isInteger(gapMm) ? String(gapMm) : gapMm.toFixed(1)
}
