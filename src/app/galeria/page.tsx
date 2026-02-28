"use client";
import React, { useEffect, useState } from 'react';

import { AnimalsService } from '@/app/services/animals.service';
import { MovementsService } from '@/app/services/movements.service';
import { ExpedienteCard } from '@/components/animals/ExpedienteCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeleteConfirmModal } from '@/components/animals/DeleteConfirmModal';
import Link from 'next/link';
import Image from 'next/image';
import type { Animal } from '@/schemas/animal.schema';
import type { Movimiento } from '@/schemas/movimiento.schema';


const getTipoHuella = (movimientos: Movimiento[]): 'entrada' | 'salida' | null => {
	if (!movimientos.length) return null;
	const salida = movimientos.find(m => m.tipo_movimiento === 'salida');
	if (salida) return 'salida';
	const entrada = movimientos.find(m => m.tipo_movimiento === 'entrada');
	if (entrada) return 'entrada';
	return null;
};

export default function GaleriaPage() {
	const [animales, setAnimales] = useState<Animal[]>([]);
	const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
	const [busqueda, setBusqueda] = useState('');
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		AnimalsService.getAll().then(setAnimales);
		MovementsService.getAll().then(setMovimientos);
	}, []);

	const animalesFiltrados = animales.filter(animal =>
		animal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
		(animal.id_animal && animal.id_animal.toLowerCase().includes(busqueda.toLowerCase()))
	);

	const handleDelete = async () => {
		if (!deleteId) return;
		await AnimalsService.delete(deleteId);
		setAnimales(animales => animales.filter(a => a.id_animal !== deleteId));
		setShowDeleteModal(false);
		setDeleteId(null);
	};

	return (
		<div className="min-h-screen bg-[#F1F1F1] p-8">
			<div className="flex justify-between items-center mb-10 h-[60px]">
				<div className="flex-1 flex items-center">
					<div className="bg-[#E9E9E9] flex items-center px-3 py-2 h-[45px] w-full max-w-xl" style={{ boxShadow: '2px 4px 6px #e0e0e0' }}>
						<Link href="/expediente" className="flex items-center">
							<Image src="/imagenes/flecha.svg" alt="volver" width={32} height={32} />
							<span className="ml-3 text-[#22345A] font-medium text-lg">Galeria de expedientes</span>
						</Link>
						<div className="flex-1" />
						<Link href="/expediente/nuevo">
							<button className="flex items-center justify-center hover:scale-105 transition-transform">
								<Image src="/imagenes/galeria/addAnimal.svg" alt="nuevo" width={32} height={32} />
							</button>
						</Link>
					</div>
				</div>
				<div className="w-96 relative ml-8">
					<Image src='/imagenes/galeria/buscar.svg' alt="buscar" width={20} height={20} className="absolute left-3 top-2.5" />
					<Input
						placeholder="Buscar paciente por nombre o ID"
						value={busqueda}
						onChange={e => setBusqueda(e.target.value)}
						className="pl-10 h[60px] w-full"
					/>
				</div>
			</div>
			<div className="bg-[#E8E8E8] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center" style={{ boxShadow: '2px 4px 6px #e0e0e0' }}>
				{animalesFiltrados.map(animal => {
					const movimientosAnimal = movimientos.filter(m => m.animal_id === animal.id_animal);
					const tipoHuella = getTipoHuella(movimientosAnimal);
					return (
						<ExpedienteCard
							key={animal.id_animal}
							nombre={animal.nombre}
							raza={animal.raza}
							imagen={animal.imagen}
							tipoHuella={tipoHuella}
							onClick={() => {
								window.location.href = `/expediente/${animal.id_animal}`;
							}}
							onDelete={() => {
								setDeleteId(animal.id_animal ?? null);
								setShowDeleteModal(true);
							}}
						/>
					);
				})}
				<DeleteConfirmModal
					isOpen={showDeleteModal}
					onConfirm={handleDelete}
					onCancel={() => { setShowDeleteModal(false); setDeleteId(null); }}
					message="¿Estás seguro de eliminar este expediente?"
				/>
			</div>
		</div>
	);
}
