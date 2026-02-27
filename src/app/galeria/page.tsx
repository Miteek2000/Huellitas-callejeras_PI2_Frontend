"use client";
import React, { useEffect, useState } from 'react';
import { AnimalsService } from '@/app/services/animals.service';
import { MovementsService } from '@/app/services/movements.service';
import { ExpedienteCard } from '@/components/animals/ExpedienteCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import Image from 'next/image';

interface Animal {
	id_animal?: string;
	nombre: string;
	raza: string;
	imagen?: string | null;
}

interface Movimiento {
	tipo_movimiento: string;
	animal_id: string;
}

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

	useEffect(() => {
		AnimalsService.getAll().then(setAnimales);
		MovementsService.getAll().then(setMovimientos);
	}, []);

	const animalesFiltrados = animales.filter(animal =>
		animal.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
		(animal.id_animal && animal.id_animal.toLowerCase().includes(busqueda.toLowerCase()))
	);

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href="/expediente">
						<span className="flex items-center text-[#194566] font-semibold text-lg">
							<Image src="/imagenes/flecha.svg" alt="volver" width={24} height={24} />
							Galeria de expedientes
						</span>
					</Link>
					<Link href="/expediente/nuevo">
						<Button variant="primary" className="ml-2 flex items-center gap-1">
							<Image src="/imagenes/galeria/addAnimal.svg" alt="nuevo" width={20} height={20} />
						</Button>
					</Link>
				</div>
				<div className="w-96 relative">
                    <Image src='/imagenes/galeria/buscar.svg' alt="buscar" width={20} height={20} className="absolute left-3 top-2.5" />
					<Input
						placeholder="Buscar paciente por nombre o ID"
						value={busqueda}
						onChange={e => setBusqueda(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
						/>
					);
				})}
			</div>
		</div>
	);
}
