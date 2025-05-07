/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         'primary-color':'#463EC2',
//         'secondary-color':'#620F99',
//         'tertiary-color':'#4900E6',

//         'input-primary-color':'#463EC2',
//         'input-secondary-color':'#620F99',
//         'input-tertiary-color':'#4900E6',

//         'select-primary-color':'#463EC2',
//         'select-secondary-color':'#3128B9',
//         'select-text-color-list':'#fff',
//         'select-tertiary-color':'#4900E6',

//         'togle-primary-color':'#463EC2',
//         'togle-secondary-color':'#3128B9',
//         'togle-tertiary-color':'#4900E6',

//         'btn-primary-color':'#463EC2',
//         'btn-secondary-color':'#3128B9',
//         'btn-tertiary-color':'#4900E6',

//         'drawer-primary-color':'#463EC2',
//         'drawer-secondary-color':'#3128B9',
//         'drawer-tertiary-color':'#4900E6',

//         // 'table-bg-header':'#f2f2f2',
//         'table-bg-header':'#ffffff',
//         'table-text-header':'#030229',

//         'table-primary-color':'#3128B9',
//         'table-secondary-color':'#463EC2',
//         'table-tertiary-color':'#4900E6',

//         'table-body-line-gb-color-one':'#fff',
//         'table-body-line-gb-color-two':'#F8F8F8',

//         'alert-bg-success-color': '#DCFCE7',
//         'alert-text-success-color': '#15803D',

//         'alert-bg-warning-color': '#FEF9C3',
//         'alert-text-warning-color': '#A16207',

//         'alert-bg-info-color': '#DBEAFE',
//         'alert-text-info-color': '#1D4ED8',

//         'alert-bg-danger-color': '#FEE2E2',
//         'alert-text-danger-color': '#B91C1C',

//         'main-bg-color': "#F9F9FB",
//         'sidebar-bg-color': "#463EC2",
//         'sidebar-item-text-color' : '#fff',
//         'sidebar-item-hover-color' : '#3128B9',
//         'sidebar-select-item-bg-color' : '#3128B9',

//         'sidebar-select-item-icon-bg-color' : '',
//         'sidebar-select-item-icon-text-color' : '#fff',

//         'sidebar-sub-item-text-color' : '#383F6B',
//         'sidebar-sub-item-hover-color' : '#E9ECEF',
//         'sidebar-select-item-sub-bg-color' : '#3128B9',

//         'text-login-bienvenido': '#463EC2',

//         'btn-login-bg-color': '#463EC2',
//         'btn-login-hover-bg-color': '#3128B9',
//         'btn-login-text-color': '#ffffff',
//         'btn-login-hover-text-color': '#ffffff',

//         'btn-success-bg-color': '#463EC2',
//         'btn-success-hover-bg-color': '#3128B9',
//         'btn-success-text-color': '#ffffff',
//         'btn-success-hover-text-color': '#ffffff',

//         'btn-danger-bg-color': '#F02000',
//         'btn-danger-hover-bg-color': '#F05038',
//         'btn-danger-text-color': '#ffffff',
//         'btn-danger-hover-text-color': '#ffffff',

//         'btn-info-bg-color': '#0094F0',
//         'btn-info-hover-bg-color': '#3D9FDB',
//         'btn-info-text-color': '#ffffff',
//         'btn-info-hover-text-color': '#ffffff',

//         'btn-info-gray-bg-color': '#BFBFBF',
//         'btn-info-gray-hover-bg-color': '#AEAEAE',
//         'btn-info-gray-text-color': '#ffffff',
//         'btn-info-gray-hover-text-color': '#ffffff',

//         'btn-warning-bg-color': '#F06200',
//         'btn-warning-hover-bg-color': '#F07E2F',
//         'btn-warning-text-color': '#ffffff',
//         'btn-warning-hover-text-color': '#ffffff',

//       }
//     },
//   },
//   plugins: [],
// }

const plugin = require('tailwindcss/plugin')
const withMT = require('@material-tailwind/react/utils/withMT')

const config = {
	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
	],
	darkMode: 'class',
	theme: {
		screens: {
			xs: '475px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			width: {
				96: '24rem', // Ejemplo: agrega un ancho de 24rem
				128: '32rem', // Ejemplo: agrega un ancho de 32rem
				144: '36rem',
			},
			opacity: {
				90: '.90',
			},
			z: {
				1500: '1500',
			},
			margin: {
				'50vh': '50vh',
				'60vh': '60vh',
				'70vh': '70vh',
			},
			colors: {
				'primary-color': '#463EC2',
				'secondary-color': '#620F99',
				'tertiary-color': '#4900E6',

				'input-primary-color': '#463EC2',
				'input-secondary-color': '#620F99',
				'input-tertiary-color': '#4900E6',

				'select-primary-color': '#463EC2',
				'select-secondary-color': '#3128B9',
				'select-text-color-list': '#fff',
				'select-tertiary-color': '#4900E6',

				'togle-primary-color': '#463EC2',
				'togle-secondary-color': '#3128B9',
				'togle-tertiary-color': '#4900E6',

				'btn-primary-color': '#463EC2',
				'btn-secondary-color': '#3128B9',
				'btn-tertiary-color': '#4900E6',

				'drawer-primary-color': '#463EC2',
				'drawer-secondary-color': '#3128B9',
				'drawer-tertiary-color': '#4900E6',

				// 'table-bg-header':'#f2f2f2',
				'table-bg-header': '#ffffff',
				'table-text-header': '#030229',

				'table-primary-color': '#3128B9',
				'table-secondary-color': '#463EC2',
				'table-tertiary-color': '#4900E6',

				'table-body-line-gb-color-one': '#fff',
				'table-body-line-gb-color-two': '#F8F8F8',

				'alert-bg-success-color': '#DCFCE7',
				'alert-text-success-color': '#15803D',

				'alert-bg-warning-color': '#FEF9C3',
				'alert-text-warning-color': '#A16207',

				'alert-bg-info-color': '#DBEAFE',
				'alert-text-info-color': '#1D4ED8',

				'alert-bg-danger-color': '#FEE2E2',
				'alert-text-danger-color': '#B91C1C',

				'main-bg-color': '#F9F9FB',
				'sidebar-bg-color': '#463EC2',
				'sidebar-item-text-color': '#fff',
				'sidebar-item-hover-color': '#3128B9',
				'sidebar-select-item-bg-color': '#3128B9',

				'sidebar-select-item-icon-bg-color': '',
				'sidebar-select-item-icon-text-color': '#fff',

				'sidebar-sub-item-text-color': '#383F6B',
				'sidebar-sub-item-hover-color': '#E9ECEF',
				'sidebar-select-item-sub-bg-color': '#3128B9',

				'text-login-bienvenido': '#463EC2',

				'btn-login-bg-color': '#463EC2',
				'btn-login-hover-bg-color': '#3128B9',
				'btn-login-text-color': '#ffffff',
				'btn-login-hover-text-color': '#ffffff',

				'btn-success-bg-color': '#463EC2',
				'btn-success-hover-bg-color': '#3128B9',
				'btn-success-text-color': '#ffffff',
				'btn-success-hover-text-color': '#ffffff',

				'btn-danger-bg-color': '#F02000',
				'btn-danger-hover-bg-color': '#F05038',
				'btn-danger-text-color': '#ffffff',
				'btn-danger-hover-text-color': '#ffffff',

				'btn-info-bg-color': '#0094F0',
				'btn-info-hover-bg-color': '#3D9FDB',
				'btn-info-text-color': '#ffffff',
				'btn-info-hover-text-color': '#ffffff',

				'btn-info-gray-bg-color': '#BFBFBF',
				'btn-info-gray-hover-bg-color': '#AEAEAE',
				'btn-info-gray-text-color': '#ffffff',
				'btn-info-gray-hover-text-color': '#ffffff',

				'btn-warning-bg-color': '#F06200',
				'btn-warning-hover-bg-color': '#F07E2F',
				'btn-warning-text-color': '#ffffff',
				'btn-warning-hover-text-color': '#ffffff',
			},
		},
	},
	plugins: [
		require('@mertasan/tailwindcss-variables'),
		plugin(function ({ addBase, theme }) {
			addBase({
				h1: { fontSize: theme('fontSize.2xl') },
				h2: { fontSize: theme('fontSize.xl') },
				h3: { fontSize: theme('fontSize.lg') },
			})
		}),
	],
}

module.exports = withMT(config)
