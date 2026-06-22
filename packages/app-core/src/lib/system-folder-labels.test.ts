import { describe, it, expect } from 'vitest'
import {
  DEFAULT_SYSTEM_FOLDER_LABELS,
  normalizeSystemFolderLabels,
  getSystemFolderLabel,
  resolveSystemFolderLabels
} from './system-folder-labels'

describe('system folder labels', () => {
  it('defaults cover the four folders plus the virtual tasks view', () => {
    expect(DEFAULT_SYSTEM_FOLDER_LABELS).toEqual({
      inbox: 'Inbox',
      quick: 'Quick Notes',
      archive: 'Archive',
      trash: 'Trash',
      tasks: 'Tasks'
    })
  })

  describe('getSystemFolderLabel', () => {
    it('returns the default when there is no override', () => {
      expect(getSystemFolderLabel('tasks')).toBe('Tasks')
      expect(getSystemFolderLabel('inbox', {})).toBe('Inbox')
    })

    it('returns the override when present', () => {
      expect(getSystemFolderLabel('tasks', { tasks: 'To-dos' })).toBe('To-dos')
    })
  })

  describe('resolveSystemFolderLabels', () => {
    it('falls back to defaults for unset keys', () => {
      expect(resolveSystemFolderLabels({ tasks: 'Work' })).toEqual({
        inbox: 'Inbox',
        quick: 'Quick Notes',
        archive: 'Archive',
        trash: 'Trash',
        tasks: 'Work'
      })
    })
  })

  describe('normalizeSystemFolderLabels', () => {
    it('keeps the tasks override alongside folder overrides', () => {
      expect(normalizeSystemFolderLabels({ tasks: 'My Tasks', inbox: 'In' })).toEqual({
        tasks: 'My Tasks',
        inbox: 'In'
      })
    })

    it('trims and collapses internal whitespace', () => {
      expect(normalizeSystemFolderLabels({ tasks: '  My   Tasks  ' })).toEqual({
        tasks: 'My Tasks'
      })
    })

    it('drops empty / whitespace-only labels so the default shows through', () => {
      expect(normalizeSystemFolderLabels({ tasks: '   ', inbox: '' })).toEqual({})
    })

    it('caps labels at 48 characters', () => {
      const long = 'a'.repeat(60)
      expect(normalizeSystemFolderLabels({ tasks: long }).tasks).toHaveLength(48)
    })

    it('ignores non-string values and non-object input', () => {
      expect(normalizeSystemFolderLabels({ tasks: 123 })).toEqual({})
      expect(normalizeSystemFolderLabels(null)).toEqual({})
      expect(normalizeSystemFolderLabels('nope')).toEqual({})
    })
  })
})
