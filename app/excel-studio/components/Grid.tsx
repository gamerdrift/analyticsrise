"use client";

import React, { useState, useEffect, useRef, KeyboardEvent, MouseEvent } from 'react';
import { Grid as GridVirtImport } from 'react-window';
const GridVirt = GridVirtImport as any;
import { useExcelStudio, CellAddress, SelectionRange } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { evaluateFormula, colIndexToLetter, formatCellReference } from '@/lib/utils/excel/formulaEvaluator';
import { Copy, Scissors, Clipboard, Plus, Trash2, EyeOff, Combine } from 'lucide-react';

const CELL_WIDTH = 120;
const CELL_HEIGHT = 32;
const ROW_HEADER_WIDTH = 50;

export default function Grid() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId, selectedCell, selectionRange } = state;
  const sheet = sheets[activeSheetId];

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isDraggingAutoFill, setIsDraggingAutoFill] = useState(false);
  const [dragEndCoords, setDragEndCoords] = useState<{ row: number; col: number } | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; row: number; col: number } | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingKey && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingKey]);

  // Close context menu on window click
  useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  if (!sheet) return null;

  const cellKey = (row: number, col: number) => `${row},${col}`;

  const formatCellValue = (val: string | number | boolean | null, format?: string): string => {
    if (val === null || val === undefined || val === '') return '';
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'string' && val.startsWith('#')) return val;
    const num = Number(val);
    if (!isNaN(num) && format) {
      if (format === 'currency') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
      }
      if (format === 'percent') {
        return `${(num * 100).toFixed(0)}%`;
      }
      if (format === 'decimal') {
        return num.toFixed(2);
      }
      if (format === 'date') {
        const d = new Date(num);
        return isNaN(d.getTime()) ? String(val) : d.toISOString().split('T')[0];
      }
    }
    return String(val);
  };

  const handleCellClick = (row: number, col: number, e: MouseEvent) => {
    if (editingKey) commitEdit();
    setContextMenu(null);

    if (e.shiftKey && selectedCell) {
      dispatch({
        type: 'SELECT_RANGE',
        payload: {
          range: {
            startRow: selectedCell.row,
            startCol: selectedCell.col,
            endRow: row,
            endCol: col,
          },
        },
      });
    } else {
      dispatch({
        type: 'SELECT_CELL',
        payload: { address: { sheetId: activeSheetId, row, col } },
      });
    }
  };

  const handleContextMenu = (e: MouseEvent, row: number, col: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, row, col });
    if (!selectedCell || selectedCell.row !== row || selectedCell.col !== col) {
      dispatch({
        type: 'SELECT_CELL',
        payload: { address: { sheetId: activeSheetId, row, col } },
      });
    }
  };

  const handleDoubleClick = (row: number, col: number) => {
    const key = cellKey(row, col);
    const cell = sheet?.cells[key];
    setEditingKey(key);
    setEditingValue(cell?.formula ?? String(cell?.value ?? ''));
  };

  const commitEdit = () => {
    if (!editingKey) return;
    const [row, col] = editingKey.split(',').map(Number);
    const address = { sheetId: activeSheetId, row, col };
    const isFormula = editingValue.trim().startsWith('=');
    const formula = isFormula ? editingValue.trim() : undefined;
    const num = Number(editingValue);
    const value = isFormula ? '' : isNaN(num) || editingValue.trim() === '' ? editingValue : num;
    dispatch({ type: 'UPDATE_CELL', payload: { address, value, formula } });
    setEditingKey(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      dispatch({ type: 'COPY_SELECTION' });
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
      dispatch({ type: 'CUT_SELECTION' });
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
      dispatch({ type: 'PASTE_SELECTION' });
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      if (e.shiftKey) dispatch({ type: 'REDO' });
      else dispatch({ type: 'UNDO' });
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      dispatch({ type: 'REDO' });
      return;
    }

    if (editingKey) {
      if (e.key === 'Enter') {
        commitEdit();
        if (selectedCell && selectedCell.row < sheet.rows - 1) {
          dispatch({
            type: 'SELECT_CELL',
            payload: { address: { ...selectedCell, row: selectedCell.row + 1 } },
          });
        }
      } else if (e.key === 'Escape') {
        setEditingKey(null);
      }
      return;
    }

    if (!selectedCell) return;
    const { row, col } = selectedCell;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextRow = Math.max(0, row - 1);
      if (e.shiftKey) {
        dispatch({ type: 'SELECT_RANGE', payload: { range: { startRow: selectedCell.row, startCol: selectedCell.col, endRow: nextRow, endCol: col } } });
      } else {
        dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row: nextRow, col } } });
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = Math.min(sheet.rows - 1, row + 1);
      if (e.shiftKey) {
        dispatch({ type: 'SELECT_RANGE', payload: { range: { startRow: selectedCell.row, startCol: selectedCell.col, endRow: nextRow, endCol: col } } });
      } else {
        dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row: nextRow, col } } });
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextCol = Math.max(0, col - 1);
      if (e.shiftKey) {
        dispatch({ type: 'SELECT_RANGE', payload: { range: { startRow: selectedCell.row, startCol: selectedCell.col, endRow: row, endCol: nextCol } } });
      } else {
        dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row, col: nextCol } } });
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextCol = Math.min(sheet.cols - 1, col + 1);
      if (e.shiftKey) {
        dispatch({ type: 'SELECT_RANGE', payload: { range: { startRow: selectedCell.row, startCol: selectedCell.col, endRow: row, endCol: nextCol } } });
      } else {
        dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row, col: nextCol } } });
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextCol = e.shiftKey ? Math.max(0, col - 1) : Math.min(sheet.cols - 1, col + 1);
      dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row, col: nextCol } } });
    } else if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      handleDoubleClick(row, col);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      dispatch({ type: 'UPDATE_CELL', payload: { address: selectedCell, value: '' } });
    } else if (e.key === 'Home') {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row, col: 0 } } });
    } else if (e.key === 'End') {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row, col: sheet.cols - 1 } } });
    }
  };

  // AutoFill Mouse Drag handlers
  const handleAutoFillMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDraggingAutoFill(true);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDraggingAutoFill) {
      setDragEndCoords({ row, col });
    }
  };

  const handleMouseUp = () => {
    if (isDraggingAutoFill && dragEndCoords && selectedCell) {
      dispatch({
        type: 'AUTO_FILL_RANGE',
        payload: {
          targetRange: {
            startRow: selectedCell.row,
            startCol: selectedCell.col,
            endRow: dragEndCoords.row,
            endCol: dragEndCoords.col,
          },
        },
      });
    }
    setIsDraggingAutoFill(false);
    setDragEndCoords(null);
  };

  const cols = sheet.cols;
  const rows = sheet.rows;

  const CellRenderer = ({ columnIndex, rowIndex, style }: any) => {
    if (columnIndex === 0) {
      const isRowSelected = selectedCell?.row === rowIndex;
      return (
        <div
          style={{
            ...style,
            backgroundColor: isRowSelected ? '#00E5FF' : '#0D1117',
            color: isRowSelected ? '#000' : '#888',
          }}
          className="sticky left-0 z-10 flex items-center justify-center font-bold text-[10px] border-r border-b border-[#00E5FF]/10 select-none"
        >
          {rowIndex + 1}
        </div>
      );
    }

    const colIdx = columnIndex - 1;

    if (sheet.hiddenRows?.includes(rowIndex) || sheet.hiddenCols?.includes(colIdx)) {
      return <div style={style} />;
    }

    const key = cellKey(rowIndex, colIdx);
    const cell = sheet.cells[key];

    const isSelected =
      selectedCell &&
      selectedCell.row === rowIndex &&
      selectedCell.col === colIdx &&
      selectedCell.sheetId === activeSheetId;

    const isInRange =
      selectionRange &&
      rowIndex >= Math.min(selectionRange.startRow, selectionRange.endRow) &&
      rowIndex <= Math.max(selectionRange.startRow, selectionRange.endRow) &&
      colIdx >= Math.min(selectionRange.startCol, selectionRange.endCol) &&
      colIdx <= Math.max(selectionRange.startCol, selectionRange.endCol);

    const isEditing = editingKey === key;

    let displayVal = '';
    if (cell) {
      if (cell.formula) {
        const evaluated = evaluateFormula(cell.formula, sheet.cells);
        displayVal = formatCellValue(evaluated, cell.formatting?.numberFormat);
      } else {
        displayVal = formatCellValue(cell.value, cell.formatting?.numberFormat);
      }
    }

    const formattingStyle: React.CSSProperties = {
      fontWeight: cell?.formatting?.bold ? 'bold' : 'normal',
      fontStyle: cell?.formatting?.italic ? 'italic' : 'normal',
      textDecoration: cell?.formatting?.underline ? 'underline' : 'none',
      textAlign: cell?.formatting?.textAlign || 'left',
      backgroundColor: cell?.formatting?.bgColor || undefined,
      color: cell?.formatting?.fontColor || undefined,
      fontFamily: cell?.formatting?.fontFamily || undefined,
      fontSize: cell?.formatting?.fontSize ? `${cell.formatting.fontSize}px` : undefined,
    };

    return (
      <div
        key={key}
        style={{ ...style, ...formattingStyle, borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        className={`relative flex items-center px-2 text-xs cursor-pointer overflow-hidden whitespace-nowrap ${
          isSelected
            ? 'bg-[#00E5FF]/15 ring-2 ring-[#00E5FF] z-10 text-white font-bold'
            : isInRange
            ? 'bg-[#00E5FF]/10'
            : ''
        }`}
        onClick={(e) => handleCellClick(rowIndex, colIdx, e)}
        onContextMenu={(e) => handleContextMenu(e, rowIndex, colIdx)}
        onDoubleClick={() => handleDoubleClick(rowIndex, colIdx)}
        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIdx)}
        role="gridcell"
      >
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={commitEdit}
            className="w-full h-full bg-[#05070B] text-[#00E5FF] font-bold px-1 border border-[#00E5FF] focus:outline-none text-xs"
          />
        ) : (
          <span className="w-full truncate" title={displayVal}>
            {displayVal}
          </span>
        )}

        {isSelected && (
          <div
            onMouseDown={handleAutoFillMouseDown}
            className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00E5FF] border border-black cursor-crosshair z-30"
            title="Drag to AutoFill formula or series"
          />
        )}
      </div>
    );
  };

  const HeaderRow = () => (
    <div className="flex sticky top-0 z-20 bg-[#0D1117] border-b border-[#00E5FF]/20 shadow-md">
      <div
        style={{ width: ROW_HEADER_WIDTH, height: CELL_HEIGHT }}
        className="flex-none border-r border-[#00E5FF]/10 bg-[#0A0D12] flex items-center justify-center text-[10px] font-bold text-slate-500"
      >
        #
      </div>
      {Array.from({ length: cols }).map((_, colIdx) => {
        if (sheet.hiddenCols?.includes(colIdx)) return null;
        const isColSelected = selectedCell?.col === colIdx;
        return (
          <div
            key={colIdx}
            style={{ width: CELL_WIDTH, height: CELL_HEIGHT }}
            className={`flex-none flex items-center justify-center font-bold text-xs border-r border-[#00E5FF]/10 ${
              isColSelected ? 'bg-[#00E5FF]/20 text-[#00E5FF] border-b-2 border-[#00E5FF]' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {colIndexToLetter(colIdx)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="flex-1 overflow-auto bg-[#05070B] text-[#F5F7FA] select-none font-mono text-xs focus:outline-none scrollbar-thin relative"
      role="grid"
      aria-label="Excel Studio Spreadsheet Grid"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseUp={handleMouseUp}
    >
      <HeaderRow />
      <GridVirt
        columnCount={cols + 1}
        columnWidth={(index) => (index === 0 ? ROW_HEADER_WIDTH : CELL_WIDTH)}
        height={Math.min(rows, 22) * CELL_HEIGHT}
        rowCount={rows}
        rowHeight={() => CELL_HEIGHT}
        width={ROW_HEADER_WIDTH + cols * CELL_WIDTH}
        style={{ overflow: 'visible' }}
      >
        {CellRenderer as any}
      </GridVirt>

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-[#0D1117] border border-[#00E5FF]/30 rounded-xl shadow-2xl p-1.5 z-50 w-56 font-mono text-xs text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { dispatch({ type: 'COPY_SELECTION' }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <Copy className="w-4 h-4 text-[#00E5FF]" /> Copy (Ctrl+C)
          </button>
          <button
            onClick={() => { dispatch({ type: 'CUT_SELECTION' }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <Scissors className="w-4 h-4 text-[#00E5FF]" /> Cut (Ctrl+X)
          </button>
          <button
            onClick={() => { dispatch({ type: 'PASTE_SELECTION' }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <Clipboard className="w-4 h-4 text-[#00E5FF]" /> Paste (Ctrl+V)
          </button>
          <div className="h-px bg-[#00E5FF]/20 my-1" />
          <button
            onClick={() => { dispatch({ type: 'INSERT_ROW', payload: { rowIndex: contextMenu.row } }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Insert Row Above
          </button>
          <button
            onClick={() => { dispatch({ type: 'DELETE_ROW', payload: { rowIndex: contextMenu.row } }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left text-rose-400"
          >
            <Trash2 className="w-4 h-4 text-rose-400" /> Delete Row
          </button>
          <div className="h-px bg-[#00E5FF]/20 my-1" />
          <button
            onClick={() => { dispatch({ type: 'INSERT_COL', payload: { colIndex: contextMenu.col } }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Insert Column Left
          </button>
          <button
            onClick={() => { dispatch({ type: 'DELETE_COL', payload: { colIndex: contextMenu.col } }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left text-rose-400"
          >
            <Trash2 className="w-4 h-4 text-rose-400" /> Delete Column
          </button>
          <div className="h-px bg-[#00E5FF]/20 my-1" />
          <button
            onClick={() => { dispatch({ type: 'TOGGLE_HIDE_ROW', payload: { rowIndex: contextMenu.row } }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <EyeOff className="w-4 h-4 text-amber-400" /> Hide Row
          </button>
          <button
            onClick={() => { dispatch({ type: 'MERGE_CELLS' }); setContextMenu(null); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded transition-colors text-left"
          >
            <Combine className="w-4 h-4 text-[#00E5FF]" /> Merge & Center
          </button>
        </div>
      )}
    </div>
  );
}
