export interface SearchParams {
  searchValue?: string
  search?: string
  healthInsuranceCompanyId?: string
  type?: string
  limit?: number
  offset?: number
  from?: string | Date
  to?: string | Date
}

export interface SearchParamsStatistics {
  startDate?: string
  endDate?: string
}
