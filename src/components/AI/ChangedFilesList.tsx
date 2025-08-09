// 変更されたファイル一覧表示コンポーネント

'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { AIEditResponse } from '@/types';

interface ChangedFilesListProps {
  changedFiles: AIEditResponse['changedFiles'];
  onOpenReview: (filePath: string, originalContent: string, suggestedContent: string) => void;
  onApplyChanges: (filePath: string, content: string) => void;
  onDiscardChanges: (filePath: string) => void;
  compact?: boolean;
}

export default function ChangedFilesList({
  changedFiles,
  onOpenReview,
  onApplyChanges,
  onDiscardChanges,
  compact = false
}: ChangedFilesListProps) {
  const { colors } = useTheme();

  if (changedFiles.length === 0) {
    return (
      <div 
        className={`text-center ${compact ? 'text-xs' : 'text-sm'} py-8`}
        style={{ color: colors.mutedFg }}
      >
        変更されたファイルはありません
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-1">
        <div 
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: colors.foreground }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          変更されたファイル ({changedFiles.length})
        </div>

        {changedFiles.map((file, index) => (
          <div
            key={index}
            className="border rounded p-1.5"
            style={{ borderColor: colors.border, background: colors.background }}
          >
            {/* ファイル名と操作ボタン */}
            <div className="flex items-center justify-between mb-1">
              <div 
                className="font-medium text-xs flex items-center gap-1"
                style={{ color: colors.foreground }}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {file.path.split('/').pop()}
              </div>
              <div className="flex gap-1">
                <button
                  className="text-xs px-1.5 py-0.5 rounded hover:opacity-80 transition"
                  style={{ background: colors.accent, color: colors.accentFg }}
                  onClick={() => onOpenReview(file.path, file.originalContent, file.suggestedContent)}
                >
                  👁️
                </button>
                <button
                  className="text-xs px-1.5 py-0.5 rounded border hover:opacity-80 transition"
                  style={{ 
                    background: 'transparent', 
                    color: colors.foreground,
                    borderColor: colors.border
                  }}
                  onClick={() => onApplyChanges(file.path, file.suggestedContent)}
                >
                  ✅
                </button>
                <button
                  className="text-xs px-1.5 py-0.5 rounded hover:opacity-80 transition"
                  style={{ background: colors.red, color: colors.background }}
                  onClick={() => onDiscardChanges(file.path)}
                >
                  ❌
                </button>
              </div>
            </div>

            {/* 変更理由（コンパクト） */}
            {file.explanation && (
              <div 
                className="text-xs mb-1"
                style={{ color: colors.mutedFg }}
              >
                💡 {file.explanation}
              </div>
            )}

            {/* 統計情報 */}
            <div 
              className="flex gap-2 text-xs items-center"
              style={{ color: colors.mutedFg }}
            >
              <span>{file.originalContent.split('\n').length}行</span>
              <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{file.suggestedContent.split('\n').length}行</span>
              <span>
                ({file.suggestedContent.split('\n').length - file.originalContent.split('\n').length > 0 ? '+' : ''}
                {file.suggestedContent.split('\n').length - file.originalContent.split('\n').length})
              </span>
            </div>

            {/* プレビュー（最初の2行） */}
            <div 
              className="text-xs mt-1 p-1 rounded font-mono"
              style={{ background: colors.editorBg, color: colors.editorFg }}
            >
              {file.suggestedContent
                .split('\n')
                .slice(0, 2)
                .map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap truncate">
                    {line || ' '}
                  </div>
                ))
              }
              {file.suggestedContent.split('\n').length > 2 && (
                <div style={{ color: colors.mutedFg }}>
                  ... +{file.suggestedContent.split('\n').length - 2} 行
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div 
        className="text-sm font-medium"
        style={{ color: colors.foreground }}
      >
        変更されたファイル ({changedFiles.length})
      </div>

      {changedFiles.map((file, index) => (
        <div
          key={index}
          className="border rounded-lg p-3"
          style={{ borderColor: colors.border, background: colors.mutedBg }}
        >
          {/* ファイル名 */}
          <div className="flex items-center justify-between mb-2">
            <div 
              className="font-medium text-sm"
              style={{ color: colors.foreground }}
            >
              {file.path}
            </div>
            <div className="flex gap-1">
              <button
                className="text-xs px-2 py-1 rounded hover:opacity-80"
                style={{ background: colors.accent, color: colors.accentFg }}
                onClick={() => onOpenReview(file.path, file.originalContent, file.suggestedContent)}
              >
                レビュー
              </button>
              <button
                className="text-xs px-2 py-1 rounded border hover:opacity-80"
                style={{ 
                  background: 'transparent', 
                  color: colors.foreground,
                  borderColor: colors.border
                }}
                onClick={() => onApplyChanges(file.path, file.suggestedContent)}
              >
                適用
              </button>
              <button
                className="text-xs px-2 py-1 rounded hover:opacity-80"
                style={{ background: colors.red, color: colors.accentFg }}
                onClick={() => onDiscardChanges(file.path)}
              >
                破棄
              </button>
            </div>
          </div>

          {/* 変更理由 */}
          {file.explanation && (
            <div 
              className="text-xs mb-2 p-2 rounded"
              style={{ background: colors.cardBg, color: colors.mutedFg }}
            >
              <strong>変更理由:</strong> {file.explanation}
            </div>
          )}

          {/* コード変更のプレビュー（最初の5行のみ） */}
          <div className="space-y-2">
            <div 
              className="text-xs font-medium"
              style={{ color: colors.mutedFg }}
            >
              変更プレビュー:
            </div>
            <div 
              className="text-xs p-2 rounded font-mono"
              style={{ background: colors.editorBg, color: colors.editorFg }}
            >
              {file.suggestedContent
                .split('\n')
                .slice(0, 5)
                .map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line || ' '}
                  </div>
                ))
              }
              {file.suggestedContent.split('\n').length > 5 && (
                <div 
                  className="mt-1"
                  style={{ color: colors.mutedFg }}
                >
                  ... 他 {file.suggestedContent.split('\n').length - 5} 行
                </div>
              )}
            </div>
          </div>

          {/* 統計情報 */}
          <div 
            className="flex gap-4 text-xs mt-2"
            style={{ color: colors.mutedFg }}
          >
            <span>元: {file.originalContent.split('\n').length}行</span>
            <span>新: {file.suggestedContent.split('\n').length}行</span>
            <span>
              差分: {file.suggestedContent.split('\n').length - file.originalContent.split('\n').length > 0 ? '+' : ''}
              {file.suggestedContent.split('\n').length - file.originalContent.split('\n').length}行
            </span>
          </div>
        </div>
      ))}

      {/* 一括操作 */}
      {changedFiles.length > 1 && (
        <div 
          className="flex gap-2 pt-3 border-t"
          style={{ borderColor: colors.border }}
        >
          <button
            className="flex-1 text-xs py-2 rounded border hover:opacity-80"
            style={{ 
              background: 'transparent', 
              color: colors.foreground,
              borderColor: colors.border
            }}
            onClick={() => {
              changedFiles.forEach(file => 
                onApplyChanges(file.path, file.suggestedContent)
              );
            }}
          >
            全て適用
          </button>
          <button
            className="flex-1 text-xs py-2 rounded hover:opacity-80"
            style={{ background: colors.red, color: colors.background }}
            onClick={() => {
              changedFiles.forEach(file => onDiscardChanges(file.path));
            }}
          >
            全て破棄
          </button>
        </div>
      )}
    </div>
  );
}
