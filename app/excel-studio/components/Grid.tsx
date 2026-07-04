// app/excel-studio/components/Grid.tsx
import React, { useCallback } from 'react';
import { FixedSizeGrid as GridVirtualizer } from 'react-window';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 30;

export default function Grid() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId, selectedCell } = state;
  const sheet = sheets[activeSheetId];

  const cellKey = (row: number, col: number) => `${row},${col}`;

  const handleDoubleClick = (row: number, col: number) => {
    const address = { sheetId: activeSheetId, row, col };
    const existing = sheet.cells[cellKey(row, col)];
    const value = existing?.value ?? '';
    const newValue = prompt('Edit cell', String(value));
    if (newValue !== null) {
      dispatch({ type: 'UPDATE_CELL', payload: { address, value: isNaN(Number(newValue)) ? newValue : Number(newValue) } });
    }
  };

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: any) => {
      const key = cellKey(rowIndex, columnIndex);
      const cell = sheet.cells[key];
      const isSelected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === columnIndex && selectedCell.sheetId === activeSheetId;
      return (
        <div
          style={{ ...style, border: '1px solid #e0e0e0', background: isSelected ? '#d0eaff' : 'transparent', display: 'flex', alignItems: 'center', padding: '0 4px', cursor: 'pointer' }}
          onClick={() => dispatch({ type: 'SELECT_CELL', payload: { address: { sheetId: activeSheetId, row: rowIndex, col: columnIndex } } })}
          onDoubleClick={() => handleDoubleClick(rowIndex, columnIndex)}
          role="gridcell"
          aria-colindex={columnIndex + 1}
          aria-rowindex={rowIndex + 1}
        >
          {cell?.value ?? ''}
        </div>
      );
    },
    [sheet, selectedCell, activeSheetId, dispatch]
  );

  // Header row/col labels (A, B, C...)
  const HeaderCell = ({ index, style }: any) => (
    <div style={{ ...style, border: '1px solid #c0c0c0', background: '#f5f5f5', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {String.fromCharCode(65 + index)}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto" role="grid" aria-label="Spreadsheet grid">
      {/* Top-left corner */}
      <div style={{ width: CELL_WIDTH, height: CELL_HEIGHT }} />
      {/* Column headers */}
      <div style={{ marginLeft: CELL_WIDTH, height: CELL_HEIGHT, overflow: 'hidden' }}>
        <GridVirtualizer columnCount={sheet.cols} columnWidth={CELL_WIDTH} height={CELL_HEIGHT} rowCount={1} rowHeight={CELL_HEIGHT} width={Math.min(sheet.cols * CELL_WIDTH, 800)}>
          {HeaderCell}
        </GridVirtualizer>
      </div>
      {/* Row headers */}
      <div style={{ position: 'absolute', top: CELL_HEIGHT, left: 0, width: CELL_WIDTH, height: 'calc(100% - 30px)', overflow: 'hidden' }}>
        <GridVirtualizer columnCount={1} columnWidth={CELL_WIDTH} height={Math.min(sheet.rows * CELL_HEIGHT, 600)} rowCount={sheet.rows} rowHeight={CELL_HEIGHT} width={CELL_WIDTH}>
          {({ rowIndex, style }) => (
            <div style={{ ...style, border: '1px solid #c0c0c0', background: '#f5f5f5', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{rowIndex + 1}</div>
          )}
        </GridVirtualizer>
      </div>
      {/* Main grid */}
      <div style={{ marginLeft: CELL_WIDTH, marginTop: CELL_HEIGHT }}>
        <GridVirtualizer
          columnCount={sheet.cols}
          columnWidth={CELL_WIDTH}
          height={Math.min(sheet.rows * CELL_HEIGHT, 600)}
          rowCount={sheet.rows}
          rowHeight={CELL_HEIGHT}
          width={Math.min(sheet.cols * CELL_WIDTH, 800)}
        >
          {Cell}
        </GridVirtualizer>
      </div>
    </div>
  );
}
