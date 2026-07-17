import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

interface ChartData {
  date: Date;
  logins: number;
  auditEvents: number;
}

export function AdminD3Chart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Generate 30 days of mock data
    const data: ChartData[] = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d,
        logins: Math.floor(Math.random() * 50) + 10 + (i * 2), // Upward trend
        auditEvents: Math.floor(Math.random() * 10) + 2 + (i % 3),
      };
    });

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous
    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.logins, d.auditEvents)) || 100])
      .range([height, 0]);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.timeFormat("%b %d") as any))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "10px")
      .style("font-weight", "600");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "#94a3b8")
      .selectAll("text")
      .style("font-size", "10px")
      .style("font-weight", "600");

    // Remove domains
    svg.selectAll(".domain").remove();
    svg.selectAll(".tick line").attr("stroke", "#e2e8f0").attr("stroke-dasharray", "2,2");

    // Define line generators
    const lineLogins = d3.line<ChartData>()
      .x(d => x(d.date))
      .y(d => y(d.logins))
      .curve(d3.curveMonotoneX);

    const lineAudits = d3.line<ChartData>()
      .x(d => x(d.date))
      .y(d => y(d.auditEvents))
      .curve(d3.curveMonotoneX);

    // Add lines
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6") // Blue for logins
      .attr("stroke-width", 3)
      .attr("d", lineLogins);

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ef4444") // Red for audit events
      .attr("stroke-width", 3)
      .attr("d", lineAudits);

    // Add Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-slate-900 text-white p-3 rounded-xl text-xs font-bold shadow-xl pointer-events-none border border-slate-700")
      .style("z-index", 1000);

    const formatTime = d3.timeFormat("%B %d, %Y");

    // Add dots
    svg.selectAll(".dot-logins")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot-logins")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.logins))
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6);
        tooltip.classed("hidden", false)
               .html(`
                 <div class="mb-1 text-slate-400 text-[10px] uppercase tracking-widest">${formatTime(d.date)}</div>
                 <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-500"></div> User Logins: ${d.logins}</div>
               `)
               .style("left", (event.pageX + 15) + "px")
               .style("top", (event.pageY - 15) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4);
        tooltip.classed("hidden", true);
      });

    svg.selectAll(".dot-audits")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot-audits")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.auditEvents))
      .attr("r", 4)
      .attr("fill", "#ef4444")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6);
        tooltip.classed("hidden", false)
               .html(`
                 <div class="mb-1 text-slate-400 text-[10px] uppercase tracking-widest">${formatTime(d.date)}</div>
                 <div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-red-500"></div> Audit Events: ${d.auditEvents}</div>
               `)
               .style("left", (event.pageX + 15) + "px")
               .style("top", (event.pageY - 15) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4);
        tooltip.classed("hidden", true);
      });

    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm col-span-1 lg:col-span-3 mb-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">System Access & Audit Telemetry</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 30 Days Trend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-md shadow-blue-500/20" />
            <span className="text-xs font-bold text-slate-600">User Logins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/20" />
            <span className="text-xs font-bold text-slate-600">Critical Audit Events</span>
          </div>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[300px]" />
    </motion.div>
  );
}
