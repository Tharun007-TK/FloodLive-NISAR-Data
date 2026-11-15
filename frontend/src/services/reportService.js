/**
 * FloodMap Live — Export & Reporting Service
 * 
 * Provides client-side CSV and JSON export routines for calculated geospatial statistics.
 */

export function exportToCSV(data, filename = 'floodmap-export.csv') {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(field => {
      let val = row[field];
      if (val === null || val === undefined) val = '';
      if (Array.isArray(val)) val = val.join('; ');
      return JSON.stringify(val);
    }).join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data, filename = 'floodmap-analysis.json') {
  const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonString);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
