import "@styles/overview.css";
import { Statistics} from "@models/incident";
import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { get_statistics } from "@api/incident";
import { useTranslation } from "react-i18next";


const CountsComponent = () => {
  const [stats, setStats] = useState({} as Statistics);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    get_statistics().then((response) => {
      setStats(response);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex align-self-center">
      <ProgressSpinner />
    </div>
  );

  const counts = {
    [t("Total Volunteers")]: stats.volunteers.total,
    [t("National Volunteers")]: stats.volunteers.nationality.National,
    [t("International Volunteers")]: stats.volunteers.nationality.International,
    [t("Total Incidents")]: stats.incidents.total,
    [t("Total Programs")]: stats.programs.total,
    [t("Total Jobs")]: stats.jobs.total,
    [t("Completed Jobs")]: stats.jobs.status["Completed"],
    [t("Jobs In Progress")]: stats.jobs.status["In Progress"],
  };
  const colors = [
    "text-orange-300",
    "text-orange-300",
    "text-orange-300",
    "text-orange-300",
    "text-orange-300",
    "text-orange-300",
    "text-orange-300",
    "text-orange-300",
  ];
  return (
    <div
      className="gap-2"
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
      }}
    >
      {Object.entries(counts).map(([label, count], index) => (
        <div
          key={label}
          className="flex flex-column justify-content-center align-items-center text-center border-round-sm bg-primary p-4"
        >
          <div className={`font-bold text-2xl ${colors[index % colors.length]}`}>{count}</div>
          <div className="font-semibold">{label}</div>
        </div>
      ))}
    </div>
  );
};


const Overview = () => {
  const { t } = useTranslation();
  // const [siteContents, setSiteContents] = useState<SiteContent[]>([]);
  // useEffect(() => {
  //   get_site_content_list().then((response) => {
  //     setSiteContents(response);
  //   });
  // }, []);
  // const overview = siteContents.find((siteContent) => siteContent.label === "overview");
  // const overviewContent = (
  //   <div>
  //     <p
  //       className="text-xl"
  //       dangerouslySetInnerHTML={{ __html: overview?.content ?? "" }}
  //     />
  //   </div>
  // );
  return (
    <section className="flex flex-wrap flex-row gap-5 align-items-center justify-content-center bg-indigo-100 p-3">
      <div className="flex-1" style={{ minWidth: "20rem" }}>
        <CountsComponent />
      </div>
      <div className="flex-1">
        <h2 className="text-4xl">{t("Overview")}</h2>
        <p className="text-xl">
          {t("Hero")}
          {/* {overviewContent} */}
        </p>
      </div>
    </section>
  );
}

export default Overview  
