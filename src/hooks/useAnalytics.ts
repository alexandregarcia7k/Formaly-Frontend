import { useState, useEffect } from "react";
import { AnalyticsService, type Period, type KPI } from "@/lib/services/analytics.service";
import { isAxiosError } from "axios";

export function useAnalyticsKPIs(period: Period) {
  const [data, setData] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getKPIs(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar KPIs");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useTemporalData(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getTemporalData(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar dados temporais");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useDeviceData(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getDeviceData(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar dados de dispositivos");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useBrowserData(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getBrowserData(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar dados de navegadores");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useFunnelData(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getFunnelData(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar funil de conversão");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useHeatmapData(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getHeatmapData(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar heatmap");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useLocationData(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getLocationData(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar dados de localização");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useFieldPerformance(period: Period) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getFieldPerformance(period);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar performance de campos");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period]);

  return { data, isLoading, error };
}

export function useFormRanking(period: Period, limit: number = 5) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await AnalyticsService.getFormRanking(period, limit);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) {
          setError(isAxiosError(err) ? err.message : "Erro ao carregar ranking de formulários");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [period, limit]);

  return { data, isLoading, error };
}
