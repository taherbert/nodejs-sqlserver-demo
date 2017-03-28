const Promise = require('bluebird')
const sql = require('mssql')
sql.Promise = require('bluebird')
const express = require('express')
const app = express()
const sqlConfig = {
  user: 'dometrics-etl',
  password: 'gHfmpF6d3uMFaF6',
  server: 'Devs-ais-etl.ou.ad3.ucdavis.edu',
  database: 'ETL_Core',
  options: { encrypt: true }
}

const allocationsQuery = `
with
	tms_purpose
	as
	(
		select
		adv_table_type,
		adv_table_code purpose_code,
		adv_short_desc,
		adv_detail1 full_desc,
		owner_usergroup,
		adv_status_code,
		adv_order,
		use_for_awc_ind,
		xcomment,
		adv_very_short_desc,
		adv_sort_name,
		added_operator,
		added,
		modified,
		operator,
		usergroup
		from AIS_Prod.ADVANCE.zz_adv_table
		where adv_table_type = 'DN'
		and is_active = 1
	),

tms_alloc_department
	as
	(
		select
			adv_table_type,
			adv_table_code alloc_department,
			adv_short_desc,
			adv_detail1 full_desc,
			adv_misc_code4,
			adv_misc_code16,
			adv_id,
			owner_usergroup,
			adv_status_code,
			adv_order,
			use_for_awc_ind,
			xcomment,
			adv_very_short_desc,
			adv_sort_name,
			added_operator,
			added,
			modified,
			operator,
			usergroup
		from    AIS_Prod.ADVANCE.zz_adv_table
		where   adv_table_type = 'J5'
		and is_active = 1
	),

tms_alloc_school
	as
	(
		select
			adv_table_type,
			adv_table_code alloc_school_code,
			adv_short_desc,
			adv_detail1 full_desc,
			owner_usergroup,
			adv_status_code,
			adv_order,
			use_for_awc_ind,
			xcomment,
			adv_very_short_desc,
			adv_sort_name,
			added_operator,
			added,
			modified,
			operator,
			usergroup
		from AIS_Prod.ADVANCE.zz_adv_table
		where adv_table_type = 'J2'
			and is_active = 1
	)

	SELECT a.allocation_code allocationCode,
      CASE WHEN a.status_code = 'A' THEN 'true' ELSE 'false' END AS isActiveAllocation,
      a.long_name longName,
      CONCAT(CONCAT(CONCAT(a.long_name, ' ('),a.allocation_code),')') printFund,
      a.fund_name fundName,
      a.alloc_school schoolCode,
      s.full_desc schoolDescription,
      a.alloc_dept_code departmentCode,
      d.full_desc departmentDescription,
      a.alloc_purpose purpose,
      p.full_desc purposeDescription,
      a.agency agency,
      a.xref kfsAccount,
      a.alpha_sort ucFundCode,
      CASE WHEN a.endow_pool_code = '1' THEN 'true' ELSE 'false' END AS isShortTermInvestmentPool,
      CASE WHEN a.endow_pool_code = '2' THEN 'true' ELSE 'false' END AS isGeneralEndowmentPool
FROM AIS_Prod.ADVANCE.allocation a,
    tms_alloc_school s,
    tms_alloc_department d,
    tms_purpose p
WHERE a.alloc_school = s.alloc_school_code
AND a.alloc_dept_code = d.alloc_department
AND a.alloc_purpose = p.purpose_code
AND a.is_active = 1
`
app.get('/allocations', (req, res) => {

  sql.connect(sqlConfig)
  .then(()=> {
    return makeRequest(allocationsQuery)
  })
  .then((data) => {
    console.dir(data)
  })
  .finally(() => {
    sql.close()
  })
  .catch(err => console.dir(err))
})

app.listen(3000, function () {
  console.log('API listening on port 3000!')
})


function makeRequest(query) {
  return new Promise( (resolve, reject) => {
    new sql.Request().query(query)
    .then(recordset => resolve(recordset))
    .catch(err => console.dir(err))
  })
}
