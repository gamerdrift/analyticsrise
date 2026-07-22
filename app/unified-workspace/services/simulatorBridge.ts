'use client';

import React from 'react';
import SqlSimulator from '@/app/simulators/sql/page';
import ExcelSimulator from '@/app/simulators/excel/page';
import PowerBiSimulator from '@/app/simulators/powerbi/page';
import TableauSimulator from '@/app/simulators/tableau/page';

export function getSimulatorComponent(type: string): React.ComponentType<any> {
  switch (type) {
    case 'sql':
      return SqlSimulator;
    case 'excel':
      return ExcelSimulator;
    case 'powerbi':
      return PowerBiSimulator;
    case 'tableau':
      return TableauSimulator;
    case 'python':
    default:
      return SqlSimulator;
  }
}
