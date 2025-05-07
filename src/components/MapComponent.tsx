import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'

// Corrige los iconos predeterminados de Leaflet
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
	shadowUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Un componente para inicializar el centro del mapa
const ChangeMapView = ({
	center,
	zoom,
}: {
	center: [number, number]
	zoom: number
}) => {
	const map = useMap()
	map.setView(center, zoom)
	return null
}

// Componente que detecta los clics en el mapa
const LocationMarker = () => {
	const [position, setPosition] = useState<[number, number] | null>(null)

	// Hook para manejar eventos del mapa
	useMapEvents({
		click(e) {
			// Establece las coordenadas donde se hizo clic
			setPosition([e.latlng.lat, e.latlng.lng])
			console.log('Coordenadas clic:', e.latlng)
		},
	})

	return position === null ? null : (
		<Marker position={position}>
			<Popup>
				Coordenadas: {position[0]}, {position[1]}
			</Popup>
		</Marker>
	)
}

interface IMapComponent {
	lat?: number // latitud
	lng?: number // longitud
	height?: string
	width?: string
}

export const MapComponent = (props: IMapComponent) => {
	const { lat = -8.11183109684221, lng = -79.0286386013031 } = props
	const { height = '80vh', width = '100%' } = props
	// Coordenadas del mapa inicial (ejemplo: Londres)
	const position: [number, number] = [lat, lng]

	return (
		<MapContainer

		
		
			style={{ height, width }}
		>
			{/* Cambia la vista al centro proporcionado */}
			<ChangeMapView
				center={position}
				zoom={13}
			/>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker position={position}>
				<Popup>{/* A sample popup. <br /> Easily customizable. */}</Popup>
			</Marker>
			{/* <LocationMarker /> */}
		</MapContainer>
	)
}
