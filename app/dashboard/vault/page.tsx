'use client';

import { useState } from 'react';
import { formatRupees } from '@/lib/money';

export default function VaultPage() {
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportResult, setExportResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchAllExpenses = async () => {
    const res = await fetch('/api/expenses');
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json();
  };

  const handleCSVExport = async () => {
    setIsExportingCSV(true);
    setExportResult(null);
    try {
      const expenses = await fetchAllExpenses();
      if (expenses.length === 0) {
        setExportResult({ type: 'error', message: 'No expenses to export.' });
        return;
      }

      const headers = ['Date', 'Description', 'Category', 'Amount (₹)'];
      const rows = expenses.map((e: any) => [
        e.date,
        `"${e.description.replace(/"/g, '""')}"`,
        e.category,
        e.amount.toFixed(2),
      ]);
      const csv = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExportResult({ type: 'success', message: `Exported ${expenses.length} expenses to CSV.` });
    } catch (err) {
      setExportResult({ type: 'error', message: 'Export failed. Please try again.' });
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handlePDFExport = async () => {
    setIsExportingPDF(true);
    setExportResult(null);
    try {
      const expenses = await fetchAllExpenses();
      if (expenses.length === 0) {
        setExportResult({ type: 'error', message: 'No expenses to export.' });
        return;
      }

      // Dynamically import react-pdf to avoid SSR issues
      const { Document, Page, Text, View, StyleSheet, pdf } = await import('@react-pdf/renderer');

      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
        header: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
        subheader: { fontSize: 10, color: '#666', marginBottom: 24 },
        tableHeader: {
          flexDirection: 'row' as const,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
          paddingBottom: 8,
          marginBottom: 8,
        },
        tableRow: {
          flexDirection: 'row' as const,
          paddingVertical: 6,
          borderBottomWidth: 0.5,
          borderBottomColor: '#eee',
        },
        colDate: { width: '20%' },
        colDesc: { width: '35%' },
        colCat: { width: '20%' },
        colAmount: { width: '25%', textAlign: 'right' as const },
        bold: { fontWeight: 'bold' },
        total: {
          flexDirection: 'row' as const,
          marginTop: 16,
          paddingTop: 12,
          borderTopWidth: 2,
          borderTopColor: '#333',
        },
        footer: { position: 'absolute' as const, bottom: 30, left: 40, right: 40, textAlign: 'center' as const, fontSize: 8, color: '#999' },
      });

      const total = expenses.reduce((s: number, e: any) => s + e.amount, 0);

      const MyDoc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.header}>ExpenseTrack Report</Text>
            <Text style={styles.subheader}>
              Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })} • {expenses.length} expenses • Total: {formatRupees(total)}
            </Text>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colDate, styles.bold]}>Date</Text>
              <Text style={[styles.colDesc, styles.bold]}>Description</Text>
              <Text style={[styles.colCat, styles.bold]}>Category</Text>
              <Text style={[styles.colAmount, styles.bold]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {expenses.map((e: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.colDate}>{e.date}</Text>
                <Text style={styles.colDesc}>{e.description}</Text>
                <Text style={styles.colCat}>{e.category}</Text>
                <Text style={styles.colAmount}>{formatRupees(e.amount)}</Text>
              </View>
            ))}

            {/* Total */}
            <View style={styles.total}>
              <Text style={[styles.colDate, styles.bold]}>Total</Text>
              <Text style={styles.colDesc}></Text>
              <Text style={styles.colCat}></Text>
              <Text style={[styles.colAmount, styles.bold]}>{formatRupees(total)}</Text>
            </View>

            <Text style={styles.footer}>ExpenseTrack • Powered by Fenmo AI</Text>
          </Page>
        </Document>
      );

      const blob = await pdf(MyDoc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setExportResult({ type: 'success', message: `Exported ${expenses.length} expenses to PDF.` });
    } catch (err) {
      console.error('PDF Export failed:', err);
      setExportResult({ type: 'error', message: 'PDF export failed. Please try again.' });
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Vault</h1>
        <p className="font-body-sm text-on-surface-variant max-w-lg">
          Export your financial data for personal records, tax filing, or analysis in a spreadsheet.
        </p>
      </div>

      {/* Export Result Banner */}
      {exportResult && (
        <div
          className={`p-4 rounded-xl font-body-sm flex items-center gap-3 transition-all ${
            exportResult.type === 'success'
              ? 'bg-primary-container/20 border border-primary/30 text-primary'
              : 'bg-error-container/20 border border-error/30 text-error'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {exportResult.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {exportResult.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        {/* CSV Export Card */}
        <div className="bg-[#161616] rounded-[20px] p-8 border border-white/5 flex flex-col items-center gap-6 hover:border-primary/20 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">table_chart</span>
          </div>
          <div className="text-center">
            <h3 className="font-data-lg text-data-lg text-on-surface mb-2">CSV Spreadsheet</h3>
            <p className="font-body-sm text-sm text-on-surface-variant">
              Compatible with Excel, Google Sheets, and Numbers.
            </p>
          </div>
          <button
            onClick={handleCSVExport}
            disabled={isExportingCSV}
            className={`w-full bg-primary-container text-on-primary-container h-12 rounded-xl font-button-label text-button-label flex items-center justify-center gap-2 transition-all ${
              isExportingCSV ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-container/80 hover:scale-[1.02]'
            }`}
          >
            {isExportingCSV ? (
              <>
                <div className="spinner"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download CSV</span>
              </>
            )}
          </button>
        </div>

        {/* PDF Export Card */}
        <div className="bg-[#161616] rounded-[20px] p-8 border border-white/5 flex flex-col items-center gap-6 hover:border-tertiary/20 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-tertiary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-3xl">picture_as_pdf</span>
          </div>
          <div className="text-center">
            <h3 className="font-data-lg text-data-lg text-on-surface mb-2">PDF Report</h3>
            <p className="font-body-sm text-sm text-on-surface-variant">
              A beautifully formatted statement for your records.
            </p>
          </div>
          <button
            onClick={handlePDFExport}
            disabled={isExportingPDF}
            className={`w-full bg-tertiary-container text-on-tertiary-container h-12 rounded-xl font-button-label text-button-label flex items-center justify-center gap-2 transition-all ${
              isExportingPDF ? 'opacity-70 cursor-not-allowed' : 'hover:bg-tertiary-container/80 hover:scale-[1.02]'
            }`}
          >
            {isExportingPDF ? (
              <>
                <div className="spinner"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
