import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Bar,
  Pie,
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const AnalyticsDashboard = () => {
  const [contributions, setContributions] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [selectedContributor, setSelectedContributor] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'sandbox_contributions'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContributions(data);
    };
    fetchData();
  }, []);

  const filteredContributions = contributions.filter(c => {
    const ts = c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000) : new Date(c.createdAt);
    const emailMatch = selectedContributor === 'All' || c.contributorEmail === selectedContributor;
    const afterStart = !startDate || ts >= new Date(startDate);
    const beforeEnd = !endDate || ts <= new Date(endDate + 'T23:59:59');
    return emailMatch && afterStart && beforeEnd;
  });

  const groupedByDay = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  });

  const dailyCounts = groupedByDay.map(date =>
    filteredContributions.filter(c => {
      const ts = c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000) : new Date(c.createdAt);
      return ts.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) === date;
    }).length
  );

  const chartData = {
    labels: groupedByDay,
    datasets: [
      {
        label: 'Uploads',
        data: dailyCounts,
        backgroundColor: '#7b61ff',
        borderColor: '#7b61ff',
        fill: true,
      },
    ],
  };

  const contributorOptions = ['All', ...Array.from(new Set(contributions.map(c => c.contributorEmail || 'Anonymous')))];

  const downloadCSV = () => {
    const rows = filteredContributions.map(c => [
      c.contributorEmail || 'Anonymous',
      c.title || '',
      c.description?.replace(/\n/g, ' ') || '',
      c.approved ? 'Yes' : 'No',
      c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString() : ''
    ]);
    const headers = ['Email', 'Title', 'Description', 'Approved', 'Created At'];
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'contributions.csv');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Quanticle Contribution Report', 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Email', 'Title', 'Approved', 'Date']],
      body: filteredContributions.map(c => [
        c.contributorEmail || 'Anonymous',
        c.title,
        c.approved ? 'Yes' : 'No',
        c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleDateString() : ''
      ])
    });
    doc.save('quanticle_report.pdf');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-neonBlue mb-6">📊 Analytics Dashboard</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedContributor}
          onChange={(e) => setSelectedContributor(e.target.value)}
          className="bg-[#1c1f3a] px-3 py-2 rounded border border-gray-600"
        >
          {contributorOptions.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="bg-[#1c1f3a] px-3 py-2 rounded border border-gray-600"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="bg-[#1c1f3a] px-3 py-2 rounded border border-gray-600"
        />
        <select
          value={chartType}
          onChange={e => setChartType(e.target.value)}
          className="bg-[#1c1f3a] px-3 py-2 rounded border border-gray-600"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
        <button onClick={downloadCSV} className="bg-neonBlue text-black px-3 py-2 rounded font-bold">Download CSV</button>
        <button onClick={downloadPDF} className="bg-neonPurple text-white px-3 py-2 rounded font-bold">Download PDF</button>
      </div>

      {/* Chart */}
      <div className="bg-[#1a1c2e] p-6 rounded-lg border border-gray-700 mb-8">
        {chartType === 'bar' && <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
        {chartType === 'line' && <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
        {chartType === 'pie' && (
          <Pie data={{
            labels: groupedByDay,
            datasets: [
              {
                label: 'Uploads',
                data: dailyCounts,
                backgroundColor: [
                  '#7b61ff', '#34d399', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#a855f7'
                ],
              },
            ],
          }} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;