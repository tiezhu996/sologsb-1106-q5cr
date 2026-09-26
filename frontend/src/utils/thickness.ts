import type { Block } from '../types/block'

export const KEY_BLOCK_NAME = '墨线版'
export const THICKNESS_TOLERANCE_MM = 1

export interface ThicknessIssue {
  block: Block
  keyThicknessMm: number
  diffMm: number
}

export function findKeyBlock(blocks: Block[]): Block | undefined {
  return blocks.find((block) => block.blockName === KEY_BLOCK_NAME)
}

export function thicknessIssueOf(block: Block, keyBlock: Block | undefined | null): ThicknessIssue | null {
  if (!keyBlock || block.id === keyBlock.id || block.blockName === KEY_BLOCK_NAME) return null
  const diffMm = Math.round(Math.abs(block.thicknessMm - keyBlock.thicknessMm) * 10) / 10
  if (diffMm <= THICKNESS_TOLERANCE_MM) return null
  return { block, keyThicknessMm: keyBlock.thicknessMm, diffMm }
}

export function findThicknessIssues(blocks: Block[]): ThicknessIssue[] {
  const keyBlock = findKeyBlock(blocks)
  if (!keyBlock) return []
  return blocks
    .map((block) => thicknessIssueOf(block, keyBlock))
    .filter((issue): issue is ThicknessIssue => issue !== null)
}
