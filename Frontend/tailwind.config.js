/** @type {import('tailwindcss').Config} */
module.exports = {
// Este archivo configura Tailwind CSS, define dónde buscar clases CSS y permite extender el tema con estilos personalizados como animaciones.
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInDown: { 
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { 
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: { 
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        modalPopIn: { 
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        modalPopOut: { 
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
        },
      },
     
      animation: {
        'fade-in-down': 'fadeInDown 0.3s ease-out forwards', 
        'fade-in': 'fadeIn 0.3s ease-out forwards',          
        'fade-out': 'fadeOut 0.3s ease-out forwards',        
        'modal-pop-in': 'modalPopIn 0.3s ease-out forwards',  
        'modal-pop-out': 'modalPopOut 0.3s ease-out forwards',
      },
    },
  },
  
  plugins: [],
};