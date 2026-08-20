import { Database, Table, ColumnDef } from '../types';

export type RelationshipType = 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'ONE_TO_ONE';

export interface TableRelationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: RelationshipType;
  description: string;
}

export interface ExampleQueryFixture {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sql: string;
  expectedColumns: string[];
  minimumExpectedRows: number;
}

export interface DatasetDefinition {
  id: string;
  name: string;
  description: string;
  category: 'E-Commerce' | 'SaaS' | 'Human Resources' | 'Finance & Banking' | 'General';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  database: Database;
  relationships: TableRelationship[];
  learningObjectives: string[];
  estimatedRows: number;
  tags: string[];
  exampleQueries: ExampleQueryFixture[];
}

export interface DatasetSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tableCount: number;
  totalRows: number;
  tags: string[];
  learningObjectives: string[];
}

export interface TableSchemaSummary {
  name: string;
  description: string;
  rowCount: number;
  columns: ColumnDef[];
}

export interface DatasetSchemaSummary {
  id: string;
  name: string;
  tables: Record<string, TableSchemaSummary>;
  relationships: TableRelationship[];
}
