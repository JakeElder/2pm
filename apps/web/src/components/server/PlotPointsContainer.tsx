import api from "@/api";

interface Props {}

const PlotPointsContainer = async ({}: Props) => {
  const res = await api.environments.getPlotPointsByEnvironment(10);
  if (res.ok) {
    const plotPoints = await res.json();
    return <pre>{JSON.stringify(plotPoints)}</pre>;
  }
};

export default PlotPointsContainer;
