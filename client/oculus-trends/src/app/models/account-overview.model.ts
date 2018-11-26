export interface AccountOverviewInterface {
  firstName: string, 
  userId: number, 
  accountName: string, 
  accountId: number, 
  roleId: number,
  dashboards: DashboardInterface[], 
  dbcs: DatabaseConnectionInterface[]
}

export interface DashboardInterface {
  id: string, 
  name: string, 
  urlAlias: string
}

export interface DatabaseConnectionInterface {
  id: number, 
  name: string
}
