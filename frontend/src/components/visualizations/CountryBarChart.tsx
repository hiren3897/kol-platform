import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import Tooltip from './Tooltip';
import Card from '../ui/Card';
import type { CountryData } from '../../types/kol.types';

interface CountryBarChartProps {
    data: CountryData[];
}

const margin = { top: 20, right: 30, bottom: 50, left: 100 };
const BAR_COLOR = '#1D4ED8'; // primary-blue from Tailwind config

/**
 * Renders a responsive horizontal D3 bar chart showing KOL distribution by country.
 */
const CountryBarChart: React.FC<CountryBarChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const [tooltipState, setTooltipState] = useState({
        country: '',
        count: 0,
        percentage: 0,
        x: 0,
        y: 0,
        visible: false,
    });

    const totalKOLs = useMemo(() => d3.sum(data, d => d.count), [data]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const renderChart = () => {
            const chartWidth = wrapper.clientWidth;
            const width = chartWidth - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            svg.attr('width', chartWidth).attr('height', 400);

            const chart = svg.select('.chart-group')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

            chart.selectAll('*').remove();

            const xMax = d3.max(data, d => d.count) || 0;
            const xScale = d3.scaleLinear()
                .domain([0, xMax])
                .range([0, width]);

            const yScale = d3.scaleBand()
                .domain(data.map(d => d.country))
                .range([0, height])
                .padding(0.2);

            const xAxis = d3.axisBottom(xScale).ticks(5).tickSizeOuter(0);
            chart.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${height})`)
                .call(xAxis)
                .selectAll('text')
                .attr('class', 'text-gray-600 text-sm');

            const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
            chart.append('g')
                .attr('class', 'y-axis')
                .call(yAxis)
                .selectAll('text')
                .attr('class', 'text-gray-800 text-sm');

            chart.append('text')
                .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
                .attr('class', 'text-gray-700 text-base font-semibold')
                .style('text-anchor', 'middle')
                .text('Number of KOLs');

            const bars = chart.selectAll<SVGRectElement, CountryData>('.bar')
                .data(data, (d) => (d as CountryData).country);

            bars.enter().append('rect')
                .attr('class', 'bar fill-primary-blue/80 cursor-pointer')
                .attr('y', d => yScale(d.country)!)
                .attr('height', yScale.bandwidth())
                .attr('x', 0)
                .attr('width', 0) // Start at zero width for transition
                .on('mouseover', function (event, d) {
                    d3.select(this).attr('fill', BAR_COLOR); // Hover effect
                    setTooltipState({
                        country: d.country,
                        count: d.count,
                        percentage: (d.count / totalKOLs) * 100,
                        x: event.clientX,
                        y: event.clientY,
                        visible: true,
                    });
                })
                .on('mousemove', function (event) {
                    setTooltipState(prev => ({
                        ...prev,
                        x: event.clientX,
                        y: event.clientY
                    }));
                })
                .on('mouseleave', function () {
                    d3.select(this).attr('fill', 'rgba(29, 78, 216, 0.8)');
                    setTooltipState(prev => ({ ...prev, visible: false }));
                })
                .transition()
                .duration(750)
                .attr('width', d => xScale(d.count));

            chart.selectAll('.bar-label')
                .data(data, (d) => (d as CountryData).country)
                .enter().append('text')
                .attr('class', 'bar-label text-sm fill-text-dark font-medium')
                .attr('x', d => xScale(d.count) + 5)
                .attr('y', d => yScale(d.country)! + yScale.bandwidth() / 2 + 4)
                .style('opacity', 0)
                .text(d => d.count)
                .transition()
                .delay(750)
                .duration(300)
                .style('opacity', 1);
        };

        const observer: ResizeObserver = new ResizeObserver(renderChart);

        renderChart();

        observer.observe(wrapper);

        return () => {
            observer.disconnect();
            svg.select('.chart-group').selectAll('*').remove();
        };
    }, [data, totalKOLs]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.append('g').attr('class', 'chart-group');
    }, []);

    return (
        <Card className="p-0 border-none">
            <div ref={wrapperRef} className="w-full h-[400px]">
                <svg ref={svgRef} className="w-full h-full"></svg>
            </div>
            <Tooltip
                country={tooltipState.country}
                count={tooltipState.count}
                percentage={tooltipState.percentage}
                x={tooltipState.x}
                y={tooltipState.y}
                visible={tooltipState.visible}
            />
        </Card>
    );
};

export default CountryBarChart;