import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const dayLabels = (data) =>
  data.map((d) => new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' }));

const lightOpts = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#9ca3af', font: { family: 'Inter', size: 11, weight: '600' } },
    },
    tooltip: {
      backgroundColor: '#fff',
      borderColor: '#fce7f3',
      borderWidth: 1.5,
      titleColor: '#1e1b4b',
      bodyColor: '#6b7280',
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: { color: '#fce7f3' },
      ticks: { color: '#d1a3c8', font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: '#fce7f3' },
      ticks: { color: '#d1a3c8', font: { family: 'Inter', size: 11 } },
      beginAtZero: true,
    },
  },
});

export const CalorieChart = ({ data }) => (
  <div style={{ height: 230 }}>
    <Line
      data={{
        labels: dayLabels(data),
        datasets: [{
          label: 'Calories (kcal)',
          data: data.map((d) => d.calories),
          borderColor: '#ec4899',
          borderWidth: 2.5,
          backgroundColor: 'rgba(236,72,153,0.07)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        }],
      }}
      options={lightOpts()}
    />
  </div>
);

export const WaterChart = ({ data }) => (
  <div style={{ height: 230 }}>
    <Bar
      data={{
        labels: dayLabels(data),
        datasets: [{
          label: 'Water (ml)',
          data: data.map((d) => d.water),
          backgroundColor: 'rgba(6,182,212,0.55)',
          hoverBackgroundColor: 'rgba(6,182,212,0.8)',
          borderRadius: 8,
          borderSkipped: false,
        }],
      }}
      options={lightOpts()}
    />
  </div>
);

export const SleepChart = ({ data }) => (
  <div style={{ height: 230 }}>
    <Line
      data={{
        labels: dayLabels(data),
        datasets: [{
          label: 'Sleep (hours)',
          data: data.map((d) => d.sleep),
          borderColor: '#a855f7',
          borderWidth: 2.5,
          backgroundColor: 'rgba(168,85,247,0.07)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#a855f7',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
        }],
      }}
      options={lightOpts()}
    />
  </div>
);

export const ExerciseChart = ({ data }) => (
  <div style={{ height: 230 }}>
    <Bar
      data={{
        labels: dayLabels(data),
        datasets: [{
          label: 'Exercise (min)',
          data: data.map((d) => d.exercise),
          backgroundColor: 'rgba(249,115,22,0.55)',
          hoverBackgroundColor: 'rgba(249,115,22,0.8)',
          borderRadius: 8,
          borderSkipped: false,
        }],
      }}
      options={lightOpts()}
    />
  </div>
);

export const MoodDonut = ({ activities }) => {
  const moodCount = { excellent: 0, good: 0, neutral: 0, bad: 0, terrible: 0 };
  activities.forEach((a) => { if (a.mood) moodCount[a.mood]++; });
  return (
    <div style={{ height: 230 }}>
      <Doughnut
        data={{
          labels: ['Excellent', 'Good', 'Neutral', 'Bad', 'Terrible'],
          datasets: [{
            data: Object.values(moodCount),
            backgroundColor: ['#10b981', '#06b6d4', '#a855f7', '#f97316', '#f43f5e'],
            borderWidth: 3,
            borderColor: '#fff',
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#9ca3af', font: { family: 'Inter', size: 11 }, padding: 14 },
            },
            tooltip: {
              backgroundColor: '#fff',
              borderColor: '#fce7f3',
              borderWidth: 1.5,
              titleColor: '#1e1b4b',
              bodyColor: '#6b7280',
            },
          },
          cutout: '68%',
        }}
      />
    </div>
  );
};
