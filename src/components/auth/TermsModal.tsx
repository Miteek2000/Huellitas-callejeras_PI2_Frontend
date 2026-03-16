'use client';

import React, { useState } from 'react';

const TERMS_TEXT = `Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma, la cual constituye un proyecto de desarrollo académico elaborado por estudiantes de la Universidad Politécnica con fines exclusivamente educativos y de investigación. Al registrarse y hacer uso de los servicios ofrecidos, usted acepta de forma expresa y voluntaria las condiciones aquí descritas.

La plataforma ha sido desarrollada en el marco de un programa académico formal y su funcionamiento se encuentra supervisado por docentes y autoridades académicas correspondientes, por lo que no constituye un servicio comercial ni representa un producto oficial de la institución. Al completar el proceso de registro, usted reconoce que los datos personales proporcionados, incluyendo nombre, correo electrónico y demás información ingresada, serán recopilados, almacenados y tratados con fines estrictamente académicos. Dicha información podrá ser visualizada y analizada por el equipo de desarrollo del proyecto, así como por docentes evaluadores, con el único propósito de llevar a cabo actividades de investigación, evaluación y demostración académica. Los datos proporcionados no serán vendidos, cedidos ni compartidos con terceros ajenos al entorno académico del proyecto.

La plataforma tendrá una disponibilidad limitada de un mes calendario a partir de su fecha de lanzamiento oficial, transcurrido el cual el acceso será suspendido de manera definitiva y los datos almacenados podrán ser eliminados o archivados según lo determinen los responsables académicos. Dado su carácter temporal y educativo, se recomienda no almacenar información sensible dentro de la plataforma. El equipo responsable no garantiza disponibilidad continua del servicio.
Al hacer clic en "Acepto los Términos y Condiciones", usted declara haber leído, comprendido y aceptado en su totalidad las condiciones aquí descritas. Si no está de acuerdo, le solicitamos abstenerse de utilizar la plataforma.`;

export interface TermsModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onConfirm, onClose }) => {
  const [accepted, setAccepted] = useState(false);
  const [showCheckboxError, setShowCheckboxError] = useState(false);

  const handleConfirm = () => {
    if (!accepted) {
      setShowCheckboxError(true);
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#182F51]">Términos y Condiciones de Uso</h2>
        </div>

        <div className="overflow-y-auto px-6 py-4 flex-1">
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {TERMS_TEXT}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                if (e.target.checked) setShowCheckboxError(false);
              }}
              className="mt-0.5 h-4 w-4 rounded border-gray-400 accent-[#2B264F] cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-700">
              He leído y acepto los Términos y Condiciones
            </span>
          </label>

          {showCheckboxError && (
            <p className="text-red-500 text-sm font-medium">
              Para poder avanzar es necesario aceptar los términos y condiciones.
            </p>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-3xl border border-[#2B264F] text-[#2B264F] text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-3xl bg-[#2B264F] text-white text-sm font-semibold hover:bg-[#1F1B3D] transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
