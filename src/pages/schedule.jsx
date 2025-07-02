import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useFetch } from "../services/use_service";

const startDate = dayjs("2025-06-09");
const days = Array.from({ length: 14 }, (_, i) => startDate.add(i, "day"));

const OrderSchedulerCustom = () => {
  const [availableOrders, setAvailableOrders] = useState();
  const [resourceLines, setResourceLines] = useState([]);

  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [expandedLines, setExpandedLines] = useState({});

  const toggleExpand = (lineId) => {
    setExpandedLines((prev) => ({ ...prev, [lineId]: !prev[lineId] }));
  };
  console.log("resourceLines", resourceLines, availableOrders);

  const handleDrop = (lineId, dateStr, order) => {
    const line = resourceLines.find((l) => l.id === lineId);
    const date = dayjs(dateStr);
    const daysNeeded = Math.ceil(order.qty / line.capacity);
    const orderSpan = {
      ...order,
      lineId,
      start: dateStr,
      end: date.add(daysNeeded - 1, "day").format("YYYY-MM-DD"),
      days: daysNeeded,
    };

    const overlaps = scheduledOrders.some(
      (o) =>
        o.lineId === lineId &&
        dayjs(o.start).isBefore(orderSpan.end) &&
        dayjs(o.end).isAfter(orderSpan.start)
    );

    if (overlaps) {
      alert("This line already has an overlapping order.");
      return;
    }

    setScheduledOrders([...scheduledOrders, orderSpan]);
    setAvailableOrders((prev) => prev.filter((o) => o.id !== order.id));
  };

  const fetchOrders = async () => {
    let getOrders = await useFetch("orders");
    setAvailableOrders(getOrders);
  };
  const fetchLines = async () => {
    let getLines = await useFetch("lines");
    setResourceLines(getLines);
  };

  useEffect(() => {
    fetchLines();
    fetchOrders();
  }, []);

  const renderCell = (lineId, dateStr, skipMap) => {
    const order = scheduledOrders.find(
      (o) => o.lineId === lineId && o.start === dateStr
    );

    if (skipMap[`${lineId}_${dateStr}`]) return null;

    if (order) {
      const colSpan = order.days;
      for (let i = 1; i < colSpan; i++) {
        const skipDate = dayjs(dateStr).add(i, "day").format("YYYY-MM-DD");
        skipMap[`${lineId}_${skipDate}`] = true;
      }

      return (
        <td
          key={`${lineId}_${dateStr}`}
          colSpan={colSpan}
          style={{
            background: order.color,
            color: "#fff",
            fontSize: 10,
            textAlign: "left",
            padding: 4,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          {order.title} ({order.qty})
        </td>
      );
    }

    return (
      <td
        key={`${lineId}_${dateStr}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const orderData = e.dataTransfer.getData("application/json");
          if (!orderData) return;
          const order = JSON.parse(orderData);
          if (order) handleDrop(lineId, dateStr, order);
        }}
        style={{ border: "1px solid #ccc", height: 80 }}
      ></td>
    );
  };

  const renderTotals = () => {
    return (
      <tr style={{ background: "#f9f9f9", fontWeight: "bold" }}>
        <td>Totals</td>
        {days.map((d) => {
          const date = d.format("YYYY-MM-DD");
          let total = 0;
          scheduledOrders.forEach((o) => {
            const oStart = dayjs(o.start);
            const oEnd = dayjs(o.end);
            if (
              dayjs(date).isBetween(
                oStart.subtract(1, "day"),
                oEnd.add(1, "day")
              )
            ) {
              const line = resourceLines.find((l) => l.id === o.lineId);
              const perDay = Math.ceil(o.qty / o.days);
              total += Math.min(perDay, line?.capacity);
            }
          });
          return (
            <td
              key={date}
              style={{ fontSize: 10 }}
            >{`${resourceLines[0]?.capacity} / ${total}`}</td>
          );
        })}
      </tr>
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: 150 }}>Line</th>
              {days.map((d, index) => (
                <th
                  key={`month-${index}`}
                  colSpan={1}
                  style={{ textAlign: "center", background: "#f3f3f3" }}
                >
                  {index === 0 || d.date() === 1 ? d.format("MMMM YYYY") : ""}
                </th>
              ))}
            </tr>
            <tr>
              <th></th>
              {days.map((d) => (
                <th key={d.format("YYYY-MM-DD")}>{d.format("ddd DD")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resourceLines.map((line) => {
              const skipMap = {};
              return (
                <tr
                  key={line.id}
                  style={{ height: expandedLines[line.id] ? "auto" : 60 }}
                >
                  <td>
                    <div key={line.id} style={{ marginBottom: 10 }}>
                      <div
                        onClick={() => toggleExpand(line.id)}
                        style={{
                          cursor: "pointer",
                          fontWeight: "bold",
                          marginBottom: 4,
                        }}
                      >
                        {expandedLines[line.id] ? "▼" : "▶"} {line.name}{" "}
                        {/* (Capacity: {line.capacity}) */}
                      </div>
                      {expandedLines[line.id] && (
                        <div style={{ paddingLeft: 10 }}>
                          {availableOrders
                            .filter((o) => o.lineIds === line.id)
                            .map((order) => (
                              <div
                                key={order.id}
                                draggable
                                onDragStart={(e) =>
                                  e.dataTransfer.setData(
                                    "application/json",
                                    JSON.stringify(order)
                                  )
                                }
                                style={{
                                  background: order.color,
                                  color: "#fff",
                                  padding: 6,
                                  borderRadius: 4,
                                  cursor: "grab",
                                  fontSize: 11,
                                  marginBottom: 4,
                                }}
                              >
                                {order.title} ({order.qty})
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {days.map((d) =>
                    renderCell(line.id, d.format("YYYY-MM-DD"), skipMap)
                  )}
                </tr>
              );
            })}
            {renderTotals()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSchedulerCustom;
