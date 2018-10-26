export interface AccountOverviewInterface {
  first_name: string, 
  user_id: number, 
  account_name: string, 
  account_id: number, 
  role_id: number,
  dashboards: DashboardInterface[], 
  dbcs: DatabaseConnectionInterface[]
}

export interface DashboardInterface {
  id: string, 
  name: string, 
  url_alias: string
}

export interface DatabaseConnectionInterface {
  id: number, 
  name: string
}
