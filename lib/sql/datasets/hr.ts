import { Database, Table } from '../types';
import { DatasetDefinition, TableRelationship, ExampleQueryFixture } from './types';
import { DeterministicRNG } from './seed';

export function createHrDataset(): DatasetDefinition {
  const rng = new DeterministicRNG(303);

  // 1. Locations
  const locationRows = [
    { location_id: 1, city: 'San Francisco', state: 'CA', country: 'USA', cost_of_living_index: 185 },
    { location_id: 2, city: 'New York', state: 'NY', country: 'USA', cost_of_living_index: 175 },
    { location_id: 3, city: 'Austin', state: 'TX', country: 'USA', cost_of_living_index: 120 },
    { location_id: 4, city: 'London', state: 'Greater London', country: 'UK', cost_of_living_index: 160 },
    { location_id: 5, city: 'Toronto', state: 'ON', country: 'Canada', cost_of_living_index: 135 },
    { location_id: 6, city: 'Berlin', state: 'Berlin', country: 'Germany', cost_of_living_index: 125 },
  ];

  const locationsTable: Table = {
    name: 'locations',
    columns: [
      { name: 'location_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique location identifier' },
      { name: 'city', type: 'TEXT', description: 'Metropolitan office city' },
      { name: 'state', type: 'TEXT', description: 'State, province, or region' },
      { name: 'country', type: 'TEXT', description: 'Country location' },
      { name: 'cost_of_living_index', type: 'INTEGER', description: 'Relative cost of living baseline index' },
    ],
    rows: locationRows,
  };

  // 2. Departments
  const departmentRows = [
    { department_id: 1, department_name: 'Engineering', location_id: 1, annual_budget: 4500000 },
    { department_id: 2, department_name: 'Data & Analytics', location_id: 1, annual_budget: 2200000 },
    { department_id: 3, department_name: 'Product Management', location_id: 2, annual_budget: 1800000 },
    { department_id: 4, department_name: 'Sales & BD', location_id: 3, annual_budget: 3100000 },
    { department_id: 5, department_name: 'Marketing & Growth', location_id: 2, annual_budget: 1600000 },
    { department_id: 6, department_name: 'People Operations & HR', location_id: 3, annual_budget: 950000 },
    { department_id: 7, department_name: 'Finance & Legal', location_id: 2, annual_budget: 1200000 },
  ];

  const departmentsTable: Table = {
    name: 'departments',
    columns: [
      { name: 'department_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique department identifier' },
      { name: 'department_name', type: 'TEXT', description: 'Official business function name' },
      { name: 'location_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'locations', foreignColumn: 'location_id', description: 'Primary office location reference' },
      { name: 'annual_budget', type: 'DECIMAL', description: 'Fiscal year operating and payroll budget in USD' },
    ],
    rows: departmentRows,
  };

  // 3. Job Roles
  const jobRoles = [
    { role_id: 1, title: 'Junior Data Analyst', department_id: 2, job_level: 'IC1', min_salary: 65000, max_salary: 85000 },
    { role_id: 2, title: 'Senior Data Analyst', department_id: 2, job_level: 'IC3', min_salary: 110000, max_salary: 145000 },
    { role_id: 3, title: 'Lead Analytics Engineer', department_id: 2, job_level: 'IC4', min_salary: 150000, max_salary: 195000 },
    { role_id: 4, title: 'Software Engineer I', department_id: 1, job_level: 'IC1', min_salary: 90000, max_salary: 115000 },
    { role_id: 5, title: 'Senior Backend Engineer', department_id: 1, job_level: 'IC3', min_salary: 140000, max_salary: 185000 },
    { role_id: 6, title: 'Staff Systems Architect', department_id: 1, job_level: 'IC5', min_salary: 190000, max_salary: 240000 },
    { role_id: 7, title: 'Associate Product Manager', department_id: 3, job_level: 'IC2', min_salary: 85000, max_salary: 110000 },
    { role_id: 8, title: 'Principal Product Manager', department_id: 3, job_level: 'IC4', min_salary: 160000, max_salary: 205000 },
    { role_id: 9, title: 'Account Executive', department_id: 4, job_level: 'IC2', min_salary: 75000, max_salary: 110000 },
    { role_id: 10, title: 'Enterprise Sales Director', department_id: 4, job_level: 'M2', min_salary: 170000, max_salary: 230000 },
    { role_id: 11, title: 'Performance Marketing Lead', department_id: 5, job_level: 'IC3', min_salary: 105000, max_salary: 140000 },
    { role_id: 12, title: 'People Business Partner', department_id: 6, job_level: 'IC3', min_salary: 95000, max_salary: 130000 },
    { role_id: 13, title: 'Senior Financial Analyst', department_id: 7, job_level: 'IC3', min_salary: 115000, max_salary: 150000 },
  ];

  const jobRolesTable: Table = {
    name: 'job_roles',
    columns: [
      { name: 'role_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique job position profile ID' },
      { name: 'title', type: 'TEXT', description: 'Position title' },
      { name: 'department_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'departments', foreignColumn: 'department_id', description: 'Associated functional department' },
      { name: 'job_level', type: 'TEXT', description: 'Career ladder seniority grade (IC1-IC5, M1-M3)' },
      { name: 'min_salary', type: 'INTEGER', description: 'Standard salary band minimum' },
      { name: 'max_salary', type: 'INTEGER', description: 'Standard salary band maximum' },
    ],
    rows: jobRoles,
  };

  // 4. Employees & Salaries (100 synthetic employees)
  const firstNames = ['Marcus', 'Elena', 'David', 'Chloe', 'Nathan', 'Maya', 'Julian', 'Sarah', 'Leo', 'Zoe', 'Gabriel', 'Hannah', 'Samuel', 'Victoria', 'Anthony', 'Grace', 'Christopher', 'Natalie', 'Andrew', 'Leah'];
  const lastNames = ['Vance', 'Rostova', 'Kim', 'Chen', 'Patel', 'Dubois', 'Morales', 'Kowalski', 'Singh', 'O\'Connor', 'Muller', 'Sato', 'Silva', 'Taylor', 'Bennett', 'Nakamura', 'Larsson', 'Rossi', 'Gomez', 'Johansson'];

  const employeeRows: any[] = [];
  const salaryRows: any[] = [];
  const reviewRows: any[] = [];

  for (let empId = 1; empId <= 100; empId++) {
    const role = rng.choice(jobRoles);
    const fn = firstNames[(empId * 3) % firstNames.length];
    const ln = lastNames[(empId * 7) % lastNames.length];
    const loc = rng.choice(locationRows);
    const isTerminated = empId <= 8; // 8% attrition
    const hireDate = rng.dateBetween('2021-01-15', '2025-06-30');
    const termDate = isTerminated ? rng.dateBetween('2025-07-01', '2026-06-30') : null;
    const status = isTerminated ? 'Terminated' : 'Active';
    const isRemote = rng.choice([true, false, false]);

    employeeRows.push({
      employee_id: empId,
      first_name: fn,
      last_name: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase().replace(/[^a-z]/g, '')}@company.org`,
      department_id: role.department_id,
      role_id: role.role_id,
      location_id: loc.location_id,
      hire_date: hireDate,
      termination_date: termDate,
      employment_status: status,
      is_remote: isRemote,
    });

    // Salary assignment within or slightly outside role bands
    const baseSal = rng.intBetween(role.min_salary, role.max_salary);
    const bonus = rng.choice([5000, 10000, 15000, 20000, 0]);

    salaryRows.push({
      salary_id: empId,
      employee_id: empId,
      base_salary: baseSal,
      bonus,
      effective_date: hireDate,
    });

    // Performance review
    const perfScore = rng.choice([3, 4, 4, 5, 2]);
    reviewRows.push({
      review_id: empId,
      employee_id: empId,
      review_year: 2025,
      performance_score: perfScore, // 1 to 5
      potential_rating: rng.choice(['High', 'Medium', 'Medium', 'Growth']),
      promotion_eligible: perfScore >= 4,
    });
  }

  const employeesTable: Table = {
    name: 'employees',
    columns: [
      { name: 'employee_id', type: 'INTEGER', isPrimaryKey: true, description: 'Unique staff employee identifier' },
      { name: 'first_name', type: 'TEXT', description: 'Employee given name' },
      { name: 'last_name', type: 'TEXT', description: 'Employee family name' },
      { name: 'email', type: 'TEXT', description: 'Internal corporate email' },
      { name: 'department_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'departments', foreignColumn: 'department_id', description: 'Department assignment' },
      { name: 'role_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'job_roles', foreignColumn: 'role_id', description: 'Position role assignment' },
      { name: 'location_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'locations', foreignColumn: 'location_id', description: 'Base office branch' },
      { name: 'hire_date', type: 'DATE', description: 'Employment commencement date' },
      { name: 'termination_date', type: 'DATE', nullable: true, description: 'Date of departure if terminated' },
      { name: 'employment_status', type: 'TEXT', description: 'Current status: Active, Terminated, On Leave' },
      { name: 'is_remote', type: 'BOOLEAN', description: 'Full-time remote work agreement status' },
    ],
    rows: employeeRows,
  };

  const salariesTable: Table = {
    name: 'salaries',
    columns: [
      { name: 'salary_id', type: 'INTEGER', isPrimaryKey: true, description: 'Compensation schedule ID' },
      { name: 'employee_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'employees', foreignColumn: 'employee_id', description: 'Employee reference' },
      { name: 'base_salary', type: 'INTEGER', description: 'Annual base compensation in USD' },
      { name: 'bonus', type: 'INTEGER', description: 'Annual variable incentive bonus in USD' },
      { name: 'effective_date', type: 'DATE', description: 'Compensation effective start date' },
    ],
    rows: salaryRows,
  };

  const performanceReviewsTable: Table = {
    name: 'performance_reviews',
    columns: [
      { name: 'review_id', type: 'INTEGER', isPrimaryKey: true, description: 'Annual appraisal review ID' },
      { name: 'employee_id', type: 'INTEGER', isForeignKey: true, foreignTable: 'employees', foreignColumn: 'employee_id', description: 'Appraised staff member' },
      { name: 'review_year', type: 'INTEGER', description: 'Review evaluation period' },
      { name: 'performance_score', type: 'INTEGER', description: 'Manager evaluation rating from 1 (Low) to 5 (Exceeds)' },
      { name: 'potential_rating', type: 'TEXT', description: 'Future leadership potential tier' },
      { name: 'promotion_eligible', type: 'BOOLEAN', description: 'Readiness for title upgrade' },
    ],
    rows: reviewRows,
  };

  const database: Database = {
    name: 'hr_db',
    tables: {
      locations: locationsTable,
      departments: departmentsTable,
      job_roles: jobRolesTable,
      employees: employeesTable,
      salaries: salariesTable,
      performance_reviews: performanceReviewsTable,
    },
  };

  const relationships: TableRelationship[] = [
    {
      id: 'rel_dept_emp',
      fromTable: 'departments',
      fromColumn: 'department_id',
      toTable: 'employees',
      toColumn: 'department_id',
      type: 'ONE_TO_MANY',
      description: 'Each department employs multiple staff members.',
    },
    {
      id: 'rel_role_emp',
      fromTable: 'job_roles',
      fromColumn: 'role_id',
      toTable: 'employees',
      toColumn: 'role_id',
      type: 'ONE_TO_MANY',
      description: 'Multiple employees can hold the same job role title.',
    },
    {
      id: 'rel_loc_emp',
      fromTable: 'locations',
      fromColumn: 'location_id',
      toTable: 'employees',
      toColumn: 'location_id',
      type: 'ONE_TO_MANY',
      description: 'Multiple employees are stationed at a geographical location.',
    },
    {
      id: 'rel_emp_sal',
      fromTable: 'employees',
      fromColumn: 'employee_id',
      toTable: 'salaries',
      toColumn: 'employee_id',
      type: 'ONE_TO_ONE',
      description: 'Each employee record links to compensation details.',
    },
    {
      id: 'rel_emp_review',
      fromTable: 'employees',
      fromColumn: 'employee_id',
      toTable: 'performance_reviews',
      toColumn: 'employee_id',
      type: 'ONE_TO_MANY',
      description: 'Employees accumulate annual performance reviews.',
    },
  ];

  const exampleQueries: ExampleQueryFixture[] = [
    {
      id: 'q_hr_dept_payroll',
      title: 'Department Headcount & Total Annual Payroll',
      description: 'Aggregate active employee counts and compute total payroll commitments per department.',
      difficulty: 'Intermediate',
      sql: `SELECT d.department_name,
              COUNT(e.employee_id) AS active_headcount,
              ROUND(AVG(s.base_salary), 0) AS avg_base_salary,
              SUM(s.base_salary + s.bonus) AS total_payroll
            FROM departments d
            INNER JOIN employees e ON d.department_id = e.department_id
            INNER JOIN salaries s ON e.employee_id = s.employee_id
            WHERE e.employment_status = 'Active'
            GROUP BY d.department_name
            ORDER BY total_payroll DESC;`,
      expectedColumns: ['department_name', 'active_headcount', 'avg_base_salary', 'total_payroll'],
      minimumExpectedRows: 7,
    },
    {
      id: 'q_hr_high_performers',
      title: 'Top Rated Employees Eligible for Promotion',
      description: 'Filter high performing team members with performance score >= 4.',
      difficulty: 'Beginner',
      sql: `SELECT e.employee_id, e.first_name, e.last_name, jr.title, pr.performance_score, s.base_salary
            FROM employees e
            INNER JOIN job_roles jr ON e.role_id = jr.role_id
            INNER JOIN performance_reviews pr ON e.employee_id = pr.employee_id
            INNER JOIN salaries s ON e.employee_id = s.employee_id
            WHERE pr.performance_score >= 4 AND e.employment_status = 'Active'
            ORDER BY pr.performance_score DESC, s.base_salary DESC;`,
      expectedColumns: ['employee_id', 'first_name', 'last_name', 'title', 'performance_score', 'base_salary'],
      minimumExpectedRows: 20,
    },
  ];

  return {
    id: 'hr',
    name: 'Enterprise HR & Talent Compensation Analytics',
    description: 'Relational data for global workforce management analyzing headcount distribution, compensation benchmarking, career levels, and annual appraisals.',
    category: 'Human Resources',
    difficulty: 'Intermediate',
    database,
    relationships,
    learningObjectives: [
      'Analyze department headcount, compensation ratios, and budget utilization',
      'Evaluate pay equity and salary distribution across career seniority levels',
      'Identify top-talent promotion cohorts using multi-condition filtering',
    ],
    estimatedRows: 6 + 7 + 13 + 100 + 100 + 100,
    tags: ['HR', 'Headcount', 'Payroll', 'Performance', 'Salary Bands', 'Workforce'],
    exampleQueries,
  };
}
