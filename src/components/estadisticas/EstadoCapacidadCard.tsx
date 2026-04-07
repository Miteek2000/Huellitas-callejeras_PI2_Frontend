import React from 'react';

interface EstadoCapacidadCardProps {
  espaciosLibres: number;
  espaciosEnRiesgo: number;
  totalActivos: number;
  capacidadMax: number;
}

export function EstadoCapacidadCard({
  espaciosLibres,
  espaciosEnRiesgo,
  totalActivos,
  capacidadMax,
}: EstadoCapacidadCardProps) {
  const pctOcupacion = capacidadMax > 0 ? (totalActivos / capacidadMax) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E5EBF8] p-5 w-full h-fit">
      <h3 className="text-xs font-bold text-[#666] ml-1 mb-4 uppercase tracking-widest">
        ESTADO DE CAPACIDAD
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-5">

        <div className="bg-[#F8F9FB] rounded-lg p-4 text-center border border-[#E5EBF8]">
          <p className="text-3xl font-bold text-[#194566]">{espaciosLibres}</p>
          <p className="text-xs text-[#888] mt-1">Espacios libres</p>
        </div>


        <div className="bg-[#F8F9FB] rounded-lg p-4 text-center border border-[#E5EBF8]">
          <p className="text-3xl font-bold text-[#DC2626]">{espaciosEnRiesgo}</p>
          <p className="text-xs text-[#888] mt-1">Espacios en riesgo</p>
        </div>
      </div>


      <div className="bg-gradient-to-r from-[#F6F8FC] to-[#ECEEF8] rounded-lg p-4 border border-[#E5EBF8]">
        <div className="mb-3">
          <div className="w-full bg-[#D6DCE4] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#2855CF] h-full transition-all duration-300"
              style={{ width: `${Math.min(pctOcupacion, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-[#44506A] font-medium text-center">
          {totalActivos} de {capacidadMax} espacios ocupados ({Math.round(pctOcupacion)}%)
        </p>
      </div>
    </div>
  );
}
