"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MetricReading {
  id: number;
  metricName: string;
  value: number;
  timestamp: string;
}

interface AlertRule {
  id: number;
  metricName: string;
  operator: string;
  threshold: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<MetricReading[]>([]);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newMetric, setNewMetric] = useState({
    metricName: "",
    value: "",
  });

  const [newAlert, setNewAlert] = useState({
    metricName: "",
    operator: ">",
    threshold: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const metricRes = await fetch("/api/metrics");
        const alertsRes = await fetch("/api/alerts");

        if (!metricRes.ok || !alertsRes.ok) {
          throw new Error("Failed to load data");
        }

        setMetrics(await metricRes.json());
        setAlerts(await alertsRes.json());
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateMetric = async () => {
    try {
      const res = await fetch("/api/metrics/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricName: newMetric.metricName,
          value: parseFloat(newMetric.value),
        }),
      });

      if (!res.ok) throw new Error("Failed to create metric");
      const data = await res.json();

      setMetrics([data.metric, ...metrics]);
      setNewMetric({ metricName: "", value: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to create metric");
    }
  };

  const handleCreateAlert = async () => {
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metricName: newAlert.metricName,
          operator: newAlert.operator,
          threshold: parseFloat(newAlert.threshold),
        }),
      });

      if (!res.ok) throw new Error("Failed to create alert");
      const data = await res.json();

      setAlerts([data.newRule, ...alerts]);
      setNewAlert({ metricName: "", operator: ">", threshold: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to create alert");
    }
  };

  const handleDeleteAlert = async (id: number) => {
    try {
      const res = await fetch(`/api/alerts?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete alert");

      setAlerts(alerts.filter((alert) => alert.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete alert");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          DevOps Dashboard
        </h1>

        {/* Navigation to Home */}
        <Link href="/" className="text-blue-500 hover:underline mb-4 block">
          Home
        </Link>

        {/* Error Handling */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Loading State */}
        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Create Metric */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Create New Metric</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Metric Name"
              value={newMetric.metricName}
              onChange={(e) =>
                setNewMetric({ ...newMetric, metricName: e.target.value })
              }
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Value"
              value={newMetric.value}
              onChange={(e) =>
                setNewMetric({ ...newMetric, value: e.target.value })
              }
              className="border p-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleCreateMetric}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Metrics Display */}
        <h2 className="text-xl font-semibold mb-2">Recent Metrics</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          {metrics.length === 0 ? (
            <p>No metrics found</p>
          ) : (
            <ul className="space-y-2">
              {metrics.map((m) => (
                <li key={m.id} className="border-b pb-2">
                  {m.metricName} = {m.value} @{" "}
                  {new Date(m.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create Alert */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Create New Alert</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Metric Name"
              value={newAlert.metricName}
              onChange={(e) =>
                setNewAlert({ ...newAlert, metricName: e.target.value })
              }
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={newAlert.operator}
              onChange={(e) =>
                setNewAlert({ ...newAlert, operator: e.target.value })
              }
              className="border p-2 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value=">">{">"}</option>
              <option value="<">{"<"}</option>
              <option value=">=">{">="}</option>
              <option value="<=">{"<="}</option>
            </select>
            <input
              type="number"
              placeholder="Threshold"
              value={newAlert.threshold}
              onChange={(e) =>
                setNewAlert({ ...newAlert, threshold: e.target.value })
              }
              className="border p-2 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleCreateAlert}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* Alert Display */}
        <h2 className="text-xl font-semibold mt-4">Alert Rules</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          {alerts.length === 0 ? (
            <p>No alerts found</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex justify-between items-center mb-2">
                <span>
                  {alert.metricName} {alert.operator} {alert.threshold}
                </span>
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
