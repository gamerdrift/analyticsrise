// app/excel-studio/page.tsx
import ExcelStudioProvider from '@/app/excel-studio/contexts/ExcelStudioContext';
import Toolbar from '@/app/excel-studio/components/Toolbar';
import WorkbookTabs from '@/app/excel-studio/components/WorkbookTabs';
import FormulaBar from '@/app/excel-studio/components/FormulaBar';
import NameBox from '@/app/excel-studio/components/NameBox';
import Grid from '@/app/excel-studio/components/Grid';
import MissionSidebar from '@/app/excel-studio/components/MissionSidebar';
import HintsPanel from '@/app/excel-studio/components/HintsPanel';
import DatasetExplorer from '@/app/excel-studio/components/DatasetExplorer';
import ProgressFooter from '@/app/excel-studio/components/ProgressFooter';

export default function ExcelStudioPage() {
  return (
    <ExcelStudioProvider>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Toolbar />
        <WorkbookTabs />
        <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800">
          <NameBox />
          <FormulaBar />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <Grid />
          <aside className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
            <MissionSidebar />
            <HintsPanel />
            <DatasetExplorer />
          </aside>
        </div>
        <ProgressFooter />
      </div>
    </ExcelStudioProvider>
  );
}
