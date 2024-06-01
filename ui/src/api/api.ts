export const server = "http://localhost:8000";
// export const server = "http://182.93.86.220";

export const endpoints = {
    user: `${server}/api/user`,
    token: `${server}/api/token`,
    site_content: `${server}/api/site_content`,
    volunteer: `${server}/api/volunteer`,
    volunteer_geotag: `${server}/api/volunteer/geotag`,
    incident: `${server}/api/incident`,
    program: `${server}/api/program`,
    job: `${server}/api/job`,
    report: `${server}/api/job_report`,
    province: `${server}/api/province`,
    district: `${server}/api/district`,
    municipality: `${server}/api/municipality`,
    ward: `${server}/api/ward`,
    province_brief: `${server}/api/province/brief`,
    district_brief: `${server}/api/district/brief`,
    municipality_brief: `${server}/api/municipality/brief`,
    ward_brief: `${server}/api/ward/brief`,
    statistics: `${server}/api/statistics`,
    notification: `${server}/api/notification`,
}
