import React from 'react';

interface HistoricoCellProps {
  value: string;
}

export function HistoricoCell({ value }: HistoricoCellProps) {
  const match = value.match(/\(predefinido:\s*(.+?)\)/);
  const contenido = match ? match[1].trim() : value;

  return <>{contenido}</>;
}
